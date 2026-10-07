/* De site ontspoort
   Hoe verder je in een post scrollt, hoe meer de site gaat haperen.
   Scrollpositie → CSS-variabele --derail (0 = rustig, 1 = volledig ontspoord). */
(function () {
  const root = document.documentElement;
  const toggle = document.querySelector('.derail-toggle');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let derail = 0;
  let enabled = true;

  try { enabled = localStorage.getItem('derail') !== 'off'; } catch (e) {}

  // Koppen krijgen hun eigen tekst als data-attribuut, voor de glitch
  const headings = Array.from(document.querySelectorAll('.post-body h2, .post-body h3'));
  headings.forEach(h => h.dataset.text = h.textContent);

  function update() {
    if (!enabled) { derail = 0; root.style.setProperty('--derail', 0); return; }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    // De eerste 15% blijft alles rustig, daarna loopt het op
    derail = Math.min(1, Math.max(0, (progress - 0.15) / 0.75));
    root.style.setProperty('--derail', derail.toFixed(3));
    root.classList.toggle('derailed', derail > 0.85);
  }

  function glitch(el) {
    if (reduceMotion || !enabled || el.classList.contains('glitch')) return;
    el.classList.add('glitch');
    el.addEventListener('animationend', () => el.classList.remove('glitch'), { once: true });
  }

  // Een kop glitcht als hij in beeld komt, maar alleen als de site al aan het ontsporen is
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && Math.random() < derail * 1.2) glitch(entry.target);
    });
  }, { threshold: 1 });
  headings.forEach(h => observer.observe(h));

  // Bijna onderaan: af en toe glitcht er spontaan een kop die in beeld is
  setInterval(() => {
    if (derail < 0.6) return;
    const visible = headings.filter(h => {
      const r = h.getBoundingClientRect();
      return r.top > 0 && r.bottom < window.innerHeight;
    });
    if (visible.length && Math.random() < derail) {
      glitch(visible[Math.floor(Math.random() * visible.length)]);
    }
  }, 2200);

  function setEnabled(on) {
    enabled = on;
    try { localStorage.setItem('derail', on ? 'on' : 'off'); } catch (e) {}
    if (toggle) {
      toggle.textContent = on ? 'Laat de site met rust' : 'Laat de site ontsporen';
      toggle.setAttribute('aria-pressed', String(!on));
    }
    update();
  }

  if (toggle) toggle.addEventListener('click', () => setEnabled(!enabled));
  setEnabled(enabled);

  window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', update);
})();
