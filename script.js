document.getElementById('year').textContent = new Date().getFullYear();

const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el) => observer.observe(el));

(function coffeeIntro() {
  const intro = document.getElementById('coffee-intro');
  const skip = document.getElementById('intro-skip');
  if (!intro) return;

  const timers = [];
  const later = (fn, ms) => timers.push(window.setTimeout(fn, ms));
  let finished = false;
  let drainFrame = 0;

  function endIntro() {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    if (drainFrame) cancelAnimationFrame(drainFrame);
    intro.classList.add('is-done');
    document.body.classList.remove('intro-lock');
    if (skip) skip.remove();
    window.setTimeout(() => intro.remove(), 500);
  }

  function drainCoffee(duration) {
    const level = document.getElementById('coffee-level-rect');
    const surface = document.getElementById('coffee-surface');
    if (!level || !surface) return;

    const startY = 152;
    const startH = 228;
    const endY = 378;
    const started = performance.now();

    function ease(t) {
      return t * t * (3 - 2 * t);
    }

    function frame(now) {
      if (finished) return;
      const t = Math.min(1, (now - started) / duration);
      const p = ease(t);
      const y = startY + (endY - startY) * p;
      const h = startH * (1 - p);
      level.setAttribute('y', y.toFixed(2));
      level.setAttribute('height', Math.max(0, h).toFixed(2));
      surface.setAttribute('cy', y.toFixed(2));
      surface.setAttribute('rx', (64 - 22 * p).toFixed(2));
      surface.setAttribute('opacity', p > 0.92 ? String((1 - p) / 0.08) : '1');
      if (t < 1) drainFrame = requestAnimationFrame(frame);
    }

    drainFrame = requestAnimationFrame(frame);
  }

  if (skip) {
    skip.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      endIntro();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') endIntro();
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    endIntro();
    return;
  }

  later(() => intro.classList.add('is-straw'), 1100);
  later(() => drainCoffee(1800), 2000);
  later(() => intro.classList.add('is-gone'), 4000);
  later(endIntro, 4700);
})();
