const NAV_SCROLL_THRESHOLD = 60;

const siteHeader = document.getElementById('siteHeader');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

const setMenuOpen = (isOpen) => {
  navMenu.classList.toggle('is-open', isOpen);
  navToggle.classList.toggle('is-active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
};

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  setMenuOpen(isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', ({ key }) => {
  if (key === 'Escape' && navMenu.classList.contains('is-open')) {
    setMenuOpen(false);
    navToggle.focus();
  }
});

const updateHeaderStyle = () => {
  siteHeader.classList.toggle('is-scrolled', window.scrollY >= NAV_SCROLL_THRESHOLD);
};

window.addEventListener('scroll', updateHeaderStyle, { passive: true });
updateHeaderStyle();
