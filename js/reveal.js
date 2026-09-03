const REVEAL_THRESHOLD = 0.2;

const revealTargets = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },
  { threshold: REVEAL_THRESHOLD }
);

revealTargets.forEach((target) => revealObserver.observe(target));
