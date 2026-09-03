const ROLES = ['앱 개발사 대표', '블록체인 CTO', '대학원 강사', '삼성SDS 운영파트장', 'AI/SW 기초를 다시 배우는 학생'];
const TYPE_DELAY = 90;
const ERASE_DELAY = 45;
const HOLD_DELAY = 1600;

const roleElement = document.getElementById('heroRole');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const typeText = async (text) => {
  for (let index = 1; index <= text.length; index += 1) {
    roleElement.textContent = text.slice(0, index);
    await wait(TYPE_DELAY);
  }
};

const eraseText = async () => {
  const current = roleElement.textContent;
  for (let index = current.length - 1; index >= 0; index -= 1) {
    roleElement.textContent = current.slice(0, index);
    await wait(ERASE_DELAY);
  }
};

const runTypingLoop = async () => {
  let roleIndex = 0;
  while (true) {
    await typeText(ROLES[roleIndex]);
    await wait(HOLD_DELAY);
    await eraseText();
    roleIndex = (roleIndex + 1) % ROLES.length;
  }
};

if (prefersReducedMotion) {
  roleElement.textContent = ROLES.join(' · ');
} else {
  roleElement.textContent = '';
  runTypingLoop();
}
