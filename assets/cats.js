/**
 * Meme-katten
 * -----------
 * Met de kattenknop vliegen er katten over het scherm.
 * Hoe verder je in een post scrollt, hoe meer katten er tegelijk rondvliegen.
 * Staat standaard uit; de keuze wordt onthouden in localStorage.
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Instellingen
  // ---------------------------------------------------------------------------
  const CONFIG = {
    // Plaatjes van cataas.com (Cat as a Service). Eigen memes kun je in
    // assets/img/cats/ zetten en hier toevoegen, bijv. "/assets/img/cats/huh.gif".
    sources: [
      "https://cataas.com/cat/funny?width=220",
      "https://cataas.com/cat/gif?width=220",
      "https://cataas.com/cat/cute?width=220",
    ],
    poolSize: 14, // aantal verschillende katten dat vooraf wordt geladen
    // Zelfde punten als in derail.js, zodat de katten komen als de achtergrond rood wordt
    calmUntil: 0.15, // tot hier nog geen katten
    fullyDerailedAt: 0.9, // vanaf hier het maximum aantal katten
    minCats: 2, // katten tegelijk zodra de achtergrond rood begint te worden
    maxCats: 22, // katten tegelijk als de site volledig ontspoord is
    interval: 450, // ms tussen pogingen om een kat te laten vliegen
    size: [70, 170], // breedte van een kat in px (min, max)
    duration: [5000, 11000], // hoe lang een vlucht duurt in ms (min, max)
  };

  // ---------------------------------------------------------------------------
  // Hulpfuncties
  // ---------------------------------------------------------------------------
  const random = (min, max) => min + Math.random() * (max - min);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------
  const root = document.documentElement;
  const toggle = document.querySelector(".cat-toggle");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let enabled = false;
  try {
    enabled = localStorage.getItem("cats") === "on";
  } catch (e) {
    /* geen opslag beschikbaar */
  }

  // Elke kat krijgt een eigen ?i= zodat cataas niet steeds hetzelfde plaatje geeft
  const pool = Array.from({ length: CONFIG.poolSize }, (_, i) => {
    const src = CONFIG.sources[i % CONFIG.sources.length];
    return src + (src.includes("?") ? "&" : "?") + "i=" + i;
  });

  // De stijl staat hier en niet in de CSS: zonder position: fixed belanden de
  // katten onderaan de pagina en wordt de pagina eindeloos lang.
  const field = document.createElement("div");
  field.className = "cat-field";
  field.setAttribute("aria-hidden", "true");
  Object.assign(field.style, {
    position: "fixed",
    inset: "0",
    zIndex: "3",
    overflow: "hidden",
    pointerEvents: "none",
  });
  document.body.appendChild(field);

  // Vooraf laden, zodat een kat meteen zichtbaar is als hij gaat vliegen
  let preloaded = false;
  function preload() {
    if (preloaded) return;
    preloaded = true;
    pool.forEach((src) => (new Image().src = src));
  }

  // Zelfde berekening als derail.js: 0 tot calmUntil, daarna oplopend naar 1
  function catLevel() {
    const scrollable = root.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    const range = CONFIG.fullyDerailedAt - CONFIG.calmUntil;
    return Math.min(1, Math.max(0, (progress - CONFIG.calmUntil) / range));
  }

  // ---------------------------------------------------------------------------
  // Een kat laten vliegen: van de ene kant van het scherm naar de andere
  // ---------------------------------------------------------------------------
  function launchCat() {
    const cat = document.createElement("img");
    cat.src = pick(pool);
    cat.alt = "";
    const width = random(...CONFIG.size);
    Object.assign(cat.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: width + "px",
      maxWidth: "none",
      margin: "0",
      borderRadius: "8px",
    });
    field.appendChild(cat);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const fromLeft = Math.random() < 0.5;
    const startX = fromLeft ? -width - 20 : w + 20;
    const endX = fromLeft ? w + 20 : -width - 20;
    const startY = random(-0.1, 0.9) * h;
    const endY = random(-0.1, 0.9) * h;
    const spin = random(-720, 720);
    const flip = fromLeft ? 1 : -1; // kijkt de kat in de vliegrichting

    cat.animate(
      [
        { transform: `translate(${startX}px, ${startY}px) scaleX(${flip}) rotate(0deg)` },
        {
          transform: `translate(${(startX + endX) / 2}px, ${Math.min(startY, endY) - random(40, 200)}px) scaleX(${flip}) rotate(${spin / 2}deg)`,
        },
        { transform: `translate(${endX}px, ${endY}px) scaleX(${flip}) rotate(${spin}deg)` },
      ],
      { duration: random(...CONFIG.duration), easing: "ease-in-out" },
    ).onfinish = () => cat.remove();
  }

  setInterval(() => {
    if (!enabled || reduceMotion || document.hidden) return;
    const level = catLevel();
    if (level <= 0) return;
    const wanted = CONFIG.minCats + (CONFIG.maxCats - CONFIG.minCats) * level;
    if (field.childElementCount < Math.round(wanted)) launchCat();
  }, CONFIG.interval);

  // ---------------------------------------------------------------------------
  // Aan/uit-knop
  // ---------------------------------------------------------------------------
  function setEnabled(on) {
    enabled = on;
    try {
      localStorage.setItem("cats", on ? "on" : "off");
    } catch (e) {
      /* geen opslag beschikbaar */
    }

    if (toggle) {
      toggle.textContent = on ? "Vang de katten" : "Laat de katten los";
      toggle.setAttribute("aria-pressed", String(on));
    }
    if (on) preload();
    else field.replaceChildren();
  }

  if (toggle) toggle.addEventListener("click", () => setEnabled(!enabled));
  setEnabled(enabled);
})();
