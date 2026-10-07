/**
 * De site ontspoort
 * -----------------
 * Hoe verder je in een post scrollt, hoe meer de site hapert, net als de mentor in ANIMA.
 *
 * Eén getal stuurt alles: `derail`, van 0 (rustig) tot 1 (volledig ontspoord).
 * Het script zet dat getal als CSS-variabele `--derail` op <html>, zodat de CSS
 * er kleuren mee kan mengen. Daarnaast gebruikt het script het voor drie effecten:
 *   1. glitchende koppen
 *   2. glitchende afbeeldingen (het beeld scheurt in stroken)
 *   3. zwevende glitch-blokjes op de achtergrond
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Instellingen: hier kun je het effect bijstellen
  // ---------------------------------------------------------------------------
  const CONFIG = {
    calmUntil: 0.15, // tot dit deel van de post blijft alles rustig
    fullyDerailedAt: 0.9, // vanaf hier is de site volledig ontspoord

    headings: {
      chanceOnEnter: 1.2, // kans = derail × dit getal
      spontaneousFrom: 0.6, // vanaf welke derail ze ook spontaan glitchen
      interval: 2200, // ms tussen spontane pogingen
    },

    images: {
      chanceOnEnter: 0.6,
      spontaneousFrom: 0.5,
      interval: 3800,
      strips: [3, 6], // aantal stroken (min, max)
      stripHeight: [3, 18], // hoogte van een strook in % (min, max)
      maxShift: 60, // hoe ver een strook opzij schiet, in px
    },

    blocks: {
      from: 0.2, // vanaf welke derail de blokjes verschijnen
      interval: 160, // ms tussen pogingen om een blokje te maken
      max: 40, // maximaal aantal blokjes tegelijk
      calmChance: 0.2, // kans op een groen in plaats van rood blokje
    },
  };

  // ---------------------------------------------------------------------------
  // Hulpfuncties
  // ---------------------------------------------------------------------------
  const random = (min, max) => min + Math.random() * (max - min);
  const randomInt = (min, max) => Math.floor(random(min, max + 1));
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const clamp = (value) => Math.min(1, Math.max(0, value));
  const chance = (probability) => Math.random() < probability;

  function isInView(el) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  // Speelt een CSS-animatie één keer af door tijdelijk een class toe te voegen
  function playOnce(el, className) {
    if (el.classList.contains(className)) return false;
    el.classList.add(className);
    el.addEventListener("animationend", () => el.classList.remove(className), {
      once: true,
    });
    return true;
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------
  const root = document.documentElement;
  const toggle = document.querySelector(".derail-toggle");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const headings = Array.from(
    document.querySelectorAll(".post-body h2, .post-body h3"),
  );
  const images = Array.from(document.querySelectorAll(".post-body img"));

  let derail = 0;
  let enabled = true;
  try {
    enabled = localStorage.getItem("derail") !== "off";
  } catch (e) {
    /* geen opslag beschikbaar */
  }

  // Mogen bewegende effecten nu afspelen?
  const canMove = () => enabled && !reduceMotion;

  // ---------------------------------------------------------------------------
  // Scrollpositie → derail
  // ---------------------------------------------------------------------------
  function updateDerail() {
    const scrollable = root.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    const range = CONFIG.fullyDerailedAt - CONFIG.calmUntil;

    derail = enabled ? clamp((progress - CONFIG.calmUntil) / range) : 0;
    root.style.setProperty("--derail", derail.toFixed(3));
  }

  // ---------------------------------------------------------------------------
  // Effect 1: glitchende koppen
  // ---------------------------------------------------------------------------
  function glitchHeading(heading) {
    if (canMove()) playOnce(heading, "glitch");
  }

  // ---------------------------------------------------------------------------
  // Effect 2: glitchende afbeeldingen
  // Een <img> kun je niet in stukken knippen, dus maken we kopieën,
  // leggen die over het origineel en knippen elke kopie bij tot één strook.
  // ---------------------------------------------------------------------------
  function createStrip(img) {
    const { strips, stripHeight } = CONFIG.images;
    const top = random(0, 85);
    const height = random(...stripHeight);

    const strip = img.cloneNode();
    strip.removeAttribute("alt");
    strip.setAttribute("aria-hidden", "true");
    strip.className = "img-strip";
    if (chance(0.5)) strip.classList.add(chance(0.5) ? "red" : "cyan");

    Object.assign(strip.style, {
      left: img.offsetLeft + "px",
      top: img.offsetTop + "px",
      width: img.offsetWidth + "px",
      height: img.offsetHeight + "px",
      clipPath: `inset(${top}% 0 ${Math.max(0, 100 - top - height)}% 0)`,
    });
    return strip;
  }

  function animateStrip(strip) {
    const shift = random(-1, 1) * CONFIG.images.maxShift;
    strip.animate(
      [
        { transform: `translateX(${shift}px)`, opacity: 1 },
        { transform: `translateX(${-shift * 0.6}px)`, opacity: 1, offset: 0.4 },
        { transform: `translateX(${shift * 0.3}px)`, opacity: 1, offset: 0.75 },
        { transform: "translateX(0)", opacity: 0 },
      ],
      { duration: random(350, 600), easing: "steps(4, end)" },
    ).onfinish = () => strip.remove();
  }

  function glitchImage(img) {
    const host = img.offsetParent;
    if (!canMove() || !img.complete || !host) return;
    if (!playOnce(img, "img-glitch")) return;

    const count = randomInt(...CONFIG.images.strips);
    for (let i = 0; i < count; i++) {
      const strip = createStrip(img);
      host.appendChild(strip);
      animateStrip(strip);
    }
  }

  // ---------------------------------------------------------------------------
  // Effect 3: zwevende glitch-blokjes
  // ---------------------------------------------------------------------------
  const field = document.createElement("div");
  field.className = "glitch-field";
  field.setAttribute("aria-hidden", "true");
  document.body.appendChild(field);

  function spawnBlock() {
    if (field.childElementCount >= CONFIG.blocks.max) return;

    const block = document.createElement("span");
    if (chance(CONFIG.blocks.calmChance)) block.classList.add("calm");
    Object.assign(block.style, {
      width: random(4, 14 + derail * 40) + "px", // later in de post: grotere blokjes
      height: random(2, 12) + "px",
      left: random(0, 100) + "vw",
      opacity: random(0.15, 0.15 + 0.45 * derail).toFixed(2),
    });
    field.appendChild(block);

    // Zes stappen omhoog, met af en toe een sprong opzij
    const rise = window.innerHeight + 40;
    const steps = 6;
    const frames = Array.from({ length: steps + 1 }, (_, i) => ({
      transform: `translate(${chance(0.35) ? random(-30, 30) : 0}px, ${(-rise * i) / steps}px)`,
    }));
    frames[steps].opacity = 0;

    const duration = 9000 - derail * 5000 + random(0, 2000); // later in de post: sneller
    block.animate(frames, { duration, easing: "linear" }).onfinish = () =>
      block.remove();
  }

  // ---------------------------------------------------------------------------
  // Wanneer glitcht er iets?
  // ---------------------------------------------------------------------------

  // Bij in beeld komen
  const triggers = new Map([
    ...headings.map((el) => [
      el,
      () => chance(derail * CONFIG.headings.chanceOnEnter) && glitchHeading(el),
    ]),
    ...images.map((el) => [
      el,
      () => chance(derail * CONFIG.images.chanceOnEnter) && glitchImage(el),
    ]),
  ]);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(
        (entry) => entry.isIntersecting && triggers.get(entry.target)(),
      );
    },
    { threshold: 0.5 },
  );
  triggers.forEach((_, el) => observer.observe(el));

  // Spontaan, als de site al ver ontspoord is
  function spontaneous(elements, settings, effect) {
    setInterval(() => {
      if (derail < settings.spontaneousFrom || !chance(derail)) return;
      const visible = elements.filter(isInView);
      if (visible.length) effect(pick(visible));
    }, settings.interval);
  }
  spontaneous(headings, CONFIG.headings, glitchHeading);
  spontaneous(images, CONFIG.images, glitchImage);

  // Blokjes
  setInterval(() => {
    if (canMove() && derail >= CONFIG.blocks.from && chance(derail * 0.9))
      spawnBlock();
  }, CONFIG.blocks.interval);

  // ---------------------------------------------------------------------------
  // Aan/uit-knop
  // ---------------------------------------------------------------------------
  function setEnabled(on) {
    enabled = on;
    try {
      localStorage.setItem("derail", on ? "on" : "off");
    } catch (e) {
      /* geen opslag beschikbaar */
    }

    if (toggle) {
      toggle.textContent = on
        ? "Laat de site met rust"
        : "Laat de site ontsporen";
      toggle.setAttribute("aria-pressed", String(!on));
    }
    if (!on) field.replaceChildren();
    updateDerail();
  }

  // ---------------------------------------------------------------------------
  // Start
  // ---------------------------------------------------------------------------
  if (toggle) toggle.addEventListener("click", () => setEnabled(!enabled));
  window.addEventListener("scroll", () => requestAnimationFrame(updateDerail), {
    passive: true,
  });
  window.addEventListener("resize", updateDerail);
  setEnabled(enabled);
})();
