(() => {
  const root = document.querySelector('.research-carousel');
  if (!root) return;
  const slides = [...root.querySelectorAll('.carousel-slide')];
  const thumbs = [...root.querySelectorAll('.carousel-thumb')];
  const dotsRoot = root.querySelector('.carousel-dots');
  const pauseButton = root.querySelector('.carousel-pause');
  const dots = slides.map((_, i) => {
    const button = document.createElement('button');
    button.type = 'button'; button.setAttribute('aria-label', `Show slide ${i + 1}`);
    button.addEventListener('click', () => { show(i); restart(); });
    dotsRoot.appendChild(button); return button;
  });
  let active = 0, timer = null, paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(index) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const selected = i === active;
      slide.classList.toggle('is-active', selected);
      slide.setAttribute('aria-hidden', String(!selected));
      slide.querySelectorAll('a').forEach(a => a.tabIndex = selected ? 0 : -1);
      dots[i].classList.toggle('is-active', selected);
      dots[i].setAttribute('aria-current', String(selected));
      thumbs[i].classList.toggle('is-active', selected);
      thumbs[i].setAttribute('aria-current', String(selected));
    });
  }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  function restart() { stop(); if (!paused && !document.hidden) timer = setInterval(() => show(active + 1), 5000); }
  root.querySelector('.carousel-prev').addEventListener('click', () => { show(active - 1); restart(); });
  root.querySelector('.carousel-next').addEventListener('click', () => { show(active + 1); restart(); });
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => { show(i); restart(); }));
  pauseButton.addEventListener('click', () => { paused = !paused; pauseButton.textContent = paused ? 'Play' : 'Pause'; pauseButton.setAttribute('aria-label', paused ? 'Resume automatic slideshow' : 'Pause automatic slideshow'); restart(); });
  if (paused) { pauseButton.textContent = 'Play'; pauseButton.setAttribute('aria-label', 'Resume automatic slideshow'); }
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', restart);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', e => { if (!root.contains(e.relatedTarget)) restart(); });
  document.addEventListener('visibilitychange', restart);
  show(0); restart();
})();
