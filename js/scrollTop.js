const SCROLL_TOP_THRESHOLD = 300;

const scrollTopBtn = document.getElementById('scrollTopBtn');

const updateScrollTopVisibility = () => {
  scrollTopBtn.classList.toggle('is-visible', window.scrollY >= SCROLL_TOP_THRESHOLD);
};

window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });
updateScrollTopVisibility();

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
