
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

 
  const cards = [...document.querySelectorAll('.pkg')];
  const canHover = window.matchMedia('(hover: hover)').matches;
  if (!canHover) {
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const on = card.classList.contains('is-hot');
        cards.forEach(c => c.classList.remove('is-hot'));
        if (!on) card.classList.add('is-hot');
      });
    });
  }


  const slides = [...document.querySelectorAll('.review-slide')];
  const track = document.getElementById('reviewTrack');
  const dotsWrap = document.getElementById('dots');
  const sidePhoto = document.getElementById('sidePhoto');
  const live = document.getElementById('reviewLive');
  let index = 0;
  let timer = null;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot';
    b.setAttribute('aria-label', 'Show review ' + (i + 1));
    b.addEventListener('click', () => { go(i); restart(); });
    dotsWrap.appendChild(b);
  });
  const dots = [...dotsWrap.children];

  function setPhoto(slide) {
    if (!sidePhoto || sidePhoto.src === slide.dataset.photo) {
      if (sidePhoto) sidePhoto.alt = slide.dataset.alt || '';
      return;
    }
    sidePhoto.style.opacity = '0';
    setTimeout(() => {
      sidePhoto.src = slide.dataset.photo;
      sidePhoto.alt = slide.dataset.alt || '';
      sidePhoto.style.opacity = '1';
    }, reduce ? 0 : 180);
  }
  function go(n) {
    index = (n + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    dots.forEach((d, i) => d.setAttribute('aria-current', i === index ? 'true' : 'false'));
    setPhoto(slides[index]);
    live.textContent = 'Showing review by ' + (slides[index].dataset.name || '');
  }
  function next() { go(index + 1); }
  function prev() { go(index - 1); }
  function stop() { clearInterval(timer); timer = null; }
  function start() {
    if (reduce) return;
    stop();
    timer = setInterval(next, 6000);
  }
  function restart() { stop(); start(); }

  document.getElementById('prevDesk').addEventListener('click', () => { prev(); restart(); });
  document.getElementById('nextDesk').addEventListener('click', () => { next(); restart(); });
  document.getElementById('prevMob').addEventListener('click', () => { prev(); restart(); });
  document.getElementById('nextMob').addEventListener('click', () => { next(); restart(); });

  const reviewBox = document.getElementById('reviews');
  reviewBox.addEventListener('mouseenter', stop);
  reviewBox.addEventListener('mouseleave', start);

  let startX = 0;
  let startY = 0;
  reviewBox.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; stop(); }, { passive: true });
  reviewBox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next() : prev(); }
    start();
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select')) return;
    if (e.key === 'ArrowRight') { next(); restart(); }
    if (e.key === 'ArrowLeft') { prev(); restart(); }
  });
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });

  go(0);
  start();
});