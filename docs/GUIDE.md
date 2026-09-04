# 미션 수행 가이드 — B1-1 나를 소개하는 웹페이지 처음부터 만들기

순수 HTML·CSS·JavaScript만으로 반응형 포트폴리오를 만들면서 "이벤트 → 상태 변경 → 화면 업데이트" 흐름을 몸에 익히는 미션의 실행 가이드. 이 저장소의 실제 코드를 기준으로 단계·개념·검증 방법을 정리했다.

---

## 1. 미션 한눈에 보기

### 목적

- HTML/CSS/JS는 브라우저가 이해하는 유일한 언어다. React·Vue도 결국 이 셋으로 변환된다.
- 이 미션의 진짜 목표는 화면을 예쁘게 그리는 것이 아니라 **사용자 이벤트 → 상태 변경 → DOM 업데이트**가 어떻게 연결되는지 결과물로 확인하는 것이다.
- 다음 미션(React)의 `useState` → 재렌더링 흐름은 여기서 손으로 짜는 `setState()` → `render()` 패턴을 추상화한 것이다.

### 최종 결과물 (5가지)

| # | 결과물 | 이 저장소의 구현 |
| --- | --- | --- |
| 1 | 반응형 웹사이트 — Hero·About·Skills·Projects·Contact·Footer 포함 | `index.html` (Experience 섹션 추가), `css/style.css` 768/1024 브레이크포인트 |
| 2 | 인터랙티브 UI — 다크 모드, 햄버거 메뉴, 부드러운 스크롤, 스크롤 애니메이션, 폼 검증 | `js/theme.js`, `js/nav.js`, `js/reveal.js`, `js/contactForm.js` |
| 3 | 외부 API 연동 — GitHub 저장소 목록, 로딩/에러/빈 상태 UI | `js/github.js` |
| 4 | 상태 유지 — 다크 모드 설정 localStorage 저장 | `js/theme.js` (`THEME_STORAGE_KEY`) |
| 5 | 배포 — GitHub Pages URL | README.md 배포 URL 항목 |

### 제약

| 항목 | 규칙 | 확인 방법 |
| --- | --- | --- |
| 외부 라이브러리 | React, Vue, jQuery, Bootstrap, Tailwind 금지. 아이콘(Font Awesome)·웹 폰트(Google Fonts)만 허용 | `index.html`의 `<link>`/`<script>`에 폰트 외 외부 리소스가 없는지 |
| 변수 선언 | `var` 금지, `const`/`let`만 | `grep -rn "var " js/` 결과 0건 |
| 이벤트 연결 | HTML `onclick` 속성 금지, `addEventListener`만 | `grep -n "onclick" index.html` 결과 0건 |
| 인라인 스타일 | HTML에 `style="..."` 금지 | `grep -n 'style="' index.html` 결과 0건 (JS 템플릿의 스켈레톤 높이·언어 색상 CSS 변수는 동적 값이라 예외로 둔다) |
| 스크립트 로딩 | `defer` 속성 | `index.html` 하단 `<script defer src="js/...">` |
| 브라우저 | 최신 Chrome에서 정상 동작 | Chrome 최신 버전에서 전체 기능 확인 |

### 제출물

- GitHub 저장소 URL
- 배포된 사이트 URL (GitHub Pages)
- 데스크톱 / 모바일 / 다크 모드 스크린샷 3종
- README: 프로젝트 설명, 사용 기술, 배포 URL, 스크린샷, 기준값(스크롤 60px / 300px, threshold 0.2)

---

## 2. 준비

### VS Code + Live Server

1. VS Code 확장 탭에서 **Live Server** 설치.
2. `index.html`을 연 뒤 우클릭 → **Open with Live Server** (기본 포트 5500).
3. 파일 저장 시 브라우저가 자동 새로고침된다. GitHub API를 계속 호출하므로 저장을 너무 자주 하면 레이트 리밋(시간당 60회)에 걸릴 수 있다 — 5장 참고.
4. Live Server가 없으면 프로젝트 루트에서 `python3 -m http.server 8080` 후 `http://localhost:8080` 접속. `file://`로 직접 열면 `fetch`가 CORS로 실패할 수 있으므로 반드시 서버로 연다.

### 폴더 구조

```
index.html            메인 페이지 (모든 섹션)
css/style.css         디자인 토큰 · 레이아웃 · 반응형 · 다크 테마
js/theme.js           다크 모드
js/nav.js             햄버거 메뉴 · 스크롤 시 nav 스타일
js/scrollTop.js       맨 위로 버튼
js/reveal.js          IntersectionObserver 스크롤 애니메이션
js/typing.js          Hero 타이핑 효과 (보너스)
js/github.js          GitHub API · 4상태 렌더링 · 언어 필터 (보너스)
js/contactForm.js     문의 폼 유효성 검사
images/profile.jpg    프로필 사진
images/screenshots/   README용 스크린샷 3종
docs/GUIDE.md         이 문서
docs/EVALUATION.md    평가 설명서
README.md
```

역할이 분리된 이유: 미션 요구사항(css/, js/, images/ 분리)이기도 하지만, JS를 기능 단위 파일로 나누면 각 파일이 하나의 "이벤트 → 상태 → 렌더" 흐름을 담아 설명하기 쉽다.

### GitHub 계정과 저장소

- Projects 섹션이 호출하는 계정: `js/github.js`의 `GITHUB_USERNAME = 'newids'`. 다른 계정이면 이 값만 바꾼다.
- 배포용 저장소를 GitHub에 만들고 `main` 브랜치를 푸시한다. Pages는 6장.

### 디자인 캔버스 참고 방법

디자인은 Claude Design 캔버스로 먼저 확정했다: https://claude.ai/code/artifact/a96c9e55-c9b6-49f7-af60-e68cd0eea9ee

| 아트보드 | 용도 |
| --- | --- |
| Desktop 1440 | 전체 섹션 레이아웃, 타이포 크기, 간격의 기준 |
| Mobile 390 / Mobile — 메뉴 열림 | 모바일 스택 순서, 햄버거 메뉴 열림 상태 |
| Dark mode 1440 | `[data-theme="dark"]` 토큰 값, 스크롤 후 nav 스타일 |
| Projects — 4 states | 로딩·성공·에러·빈 상태의 마크업 형태 |
| Directions 페이지 | 선택하지 않은 대안 2개 (참고용) |

CSS 값(색·폰트·간격)은 캔버스의 인라인 스타일에서 그대로 옮겨 `:root` 토큰으로 정리했다. 캔버스는 정답이 아니라 기준이므로, 코드에서 더 나은 판단이 생기면 코드를 우선한다.

### 개인정보 원칙

이력서에는 전화번호·생년월일·병역 등이 있지만 **공개 웹페이지에는 익명화한 이름(JS Choi), 일반화한 경력·학력, GitHub 링크만** 싣는다. 이메일·회사명·제품명·특허번호도 싣지 않는다. 배포 후에는 누구나 볼 수 있고 검색 엔진에 색인된다는 점을 기억한다.

---

## 3. 단계별 실행 계획

### Phase 0 — 구조·시맨틱 마크업

**목표**: div 더미가 아니라 의미 있는 태그로 페이지 뼈대를 세운다.

- [ ] `<header>` 안에 `<nav aria-label>`, `<main>` 안에 섹션별 `<section id aria-labelledby>`, `<footer>`
- [ ] Hero(인사말 + CTA 2개), About(사진 + 소개), Skills, Projects(빈 컨테이너), Contact(폼), Footer(저작권 + 소셜)
- [ ] nav에 `#about`, `#skills` 같은 앵커 링크
- [ ] 모든 `<img>`에 의미 있는 `alt`, 폼 `<label for>` ↔ `<input id>` 매칭
- [ ] 반복되는 항목(Skills 카드, 경력)은 `<article>` / `<ol>`·`<dl>` 로

**왜**: 시맨틱 태그는 브라우저·스크린리더·검색엔진에 "이건 내비게이션, 이건 본문"을 알려준다. `aria-labelledby`로 섹션 제목을 연결하면 보조기기가 섹션을 이름으로 탐색한다. `<dl>`은 "라벨–값" 쌍(경력 30년, 학력 …)에 정확히 맞는 태그다.

**이 저장소**: `index.html` 전체. 경력은 `<ol class="timeline">`, 통계는 `<dl class="hero-facts">`, 스킬은 `<article class="skill-card">`.

**흔한 실수**
- `<section>`에 제목(`h2`)이 없음 → 접근성 트리에서 이름 없는 영역이 됨
- `<label>`을 input 옆에 두고 `for`/`id`를 안 맞춤 → 라벨 클릭 시 포커스 안 감
- 모든 걸 `<div class="section">`으로 감쌈

**완료 확인**: Chrome DevTools → Elements → Accessibility 탭에서 각 `section`이 제목으로 이름 붙어 있는지. 라벨을 클릭하면 입력창에 포커스가 가는지.

---

### Phase 1 — 디자인 토큰·베이스 CSS

**목표**: 색·폰트·간격을 `:root` 변수 한 곳에서 관리하고, 다크 모드용 변수 세트를 따로 둔다.

- [ ] `:root`에 색상(`--color-bg`, `--color-text`, `--color-accent` …), 폰트(`--font-serif/sans/mono`), 간격(`--space-1` ~ `--space-28`), 그림자, 반지름, 전환 시간
- [ ] `[data-theme='dark']`에서 **같은 이름**의 변수만 재정의
- [ ] 리셋(`box-sizing`, `margin: 0`), `html { scroll-behavior: smooth }`
- [ ] 외부 스타일시트 `css/style.css` 하나로 연결

**왜**: 변수 이름이 같으면 다크 모드는 "값만 바꾸기"다. 컴포넌트 CSS는 `var(--color-bg)`만 쓰고 테마를 몰라도 된다. 이것이 "상태(테마) → 렌더링(전체 색)"을 CSS만으로 완성하는 방법이다.

**이 저장소**: `css/style.css` 상단.

```css
:root {
  --color-bg: #f8f5ef;
  --color-text: #1d222d;
  --color-accent: #b8602a;
  /* ... */
}

[data-theme='dark'] {
  --color-bg: #15181f;
  --color-text: #f0ece4;
  --color-accent: #e0925a;
  /* ... */
}
```

`--color-ink` / `--color-on-ink`는 라이트에서 어두운 카드, 다크에서 밝은 카드로 **반전**되도록 설계한 토큰이다. 단순 반전이 아니라 "강조 카드는 배경과 대비된다"는 의도를 토큰 이름에 담았다.

**흔한 실수**
- 다크 모드에서 변수 이름을 새로 만들어(`--dark-bg`) 컴포넌트마다 분기 작성
- 폰트를 `@import`로 CSS 안에서 불러와 렌더링 지연 → `<link rel="preconnect">` + `<link rel="stylesheet">`로 HTML `<head>`에서
- `scroll-behavior: smooth`만 두고 `scroll-padding-top`을 안 줘서 고정 헤더가 섹션 제목을 가림

**완료 확인**: DevTools Elements에서 `<html>`에 `data-theme="dark"`를 수동으로 붙였을 때 전체 색이 바뀌는지 (JS 없이).

---

### Phase 2 — 레이아웃·반응형

**목표**: nav는 Flexbox, Projects 카드는 Grid. 모바일 퍼스트로 작성하고 768 / 1024에서 확장한다.

- [ ] `.navbar { display: flex; justify-content: space-between }` — 로고 왼쪽, 메뉴 오른쪽
- [ ] `.projects-grid { grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)) }`
- [ ] 기본(모바일) 스타일 먼저, `@media (min-width: 768px)`, `@media (min-width: 1024px)` 순으로 추가
- [ ] 768 미만: `.nav-toggle` 표시, `.nav-menu`는 헤더 아래 패널로 (`position: fixed`)
- [ ] 768 이상: `.nav-toggle { display: none }`, `.nav-menu { position: static; flex-direction: row }`
- [ ] 버튼·카드 hover + `transition`, 카드 `box-shadow`

**왜 Flex vs Grid**: Flexbox는 **한 방향(행 또는 열)** 흐름에 항목을 정렬·분배할 때. nav처럼 "왼쪽 하나, 오른쪽 나머지"는 Flex의 `justify-content`가 정확하다. Grid는 **행·열 2차원**을 동시에 다룰 때. 카드가 몇 개든 열 폭을 최소 280px로 유지하면서 화면에 맞게 열 수를 바꾸는 건 `auto-fit + minmax`만으로 끝난다.

**왜 모바일 퍼스트**: 기본 스타일이 가장 단순한 1열 레이아웃이고, 화면이 커질수록 규칙을 "추가"한다. `max-width`로 큰 화면부터 짜면 작은 화면에서 스타일을 "취소"해야 해서 코드가 길어진다.

**이 저장소**: `css/style.css` "Header / Navigation", "Projects", "Breakpoints" 절.

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--space-5);
}
```

`min(100%, 280px)`는 320px 폭에서 카드가 컨테이너를 넘치지 않게 하는 안전장치다.

**흔한 실수**
- 모바일에서 `.nav-menu`를 `display: none`으로 숨기고 JS로 `display: block` 토글 → 전환 애니메이션 불가. 이 저장소는 `opacity + visibility + transform`으로 처리
- 768 이상에서 `.nav-toggle`을 안 숨겨 햄버거가 데스크톱에도 보임
- `minmax(280px, 1fr)`만 쓰면 280px보다 좁은 화면에서 가로 스크롤 발생

**완료 확인**: DevTools 디바이스 모드에서 320 / 375 / 768 / 1024 / 1440 폭으로 바꿔가며 가로 스크롤이 없는지, 768에서 햄버거가 사라지고 가로 메뉴가 나오는지.

---

### Phase 3 — 인터랙션 JS

**목표**: 각 기능을 "요소 선택 → 이벤트 연결 → 클래스/속성 변경" 패턴으로 구현한다.

- [ ] 모든 `<script>`에 `defer`
- [ ] `querySelector` / `getElementById`로 선택, `addEventListener`로 연결
- [ ] 다크 모드: 토글 → `data-theme` → `localStorage` 저장 → 로드 시 복원
- [ ] 햄버거: `classList.toggle('is-open')` + `aria-expanded`
- [ ] nav 스타일: 스크롤 60px 이상에서 `.is-scrolled`
- [ ] 스크롤탑: 300px 이상에서 `.is-visible`, 클릭 시 `scrollTo({ top: 0, behavior: 'smooth' })`
- [ ] 스크롤 애니메이션: `IntersectionObserver` threshold 0.2
- [ ] (보너스) 타이핑 효과

**왜 defer**: `defer`는 HTML 파싱이 끝난 뒤, 작성 순서대로 스크립트를 실행한다. 그래서 각 파일 최상단에서 `document.getElementById(...)`를 바로 호출해도 요소가 존재한다. `DOMContentLoaded` 래핑이 필요 없다.

**왜 classList**: 스타일 값을 JS에서 직접 만지지 않고(`el.style.background = ...`) 클래스만 붙였다 뗀다. "어떻게 보일지"는 CSS가, "어떤 상태인지"는 JS가 담당한다.

**이 저장소**

| 기능 | 파일 | 핵심 |
| --- | --- | --- |
| 다크 모드 | `js/theme.js` | `applyTheme(theme)` → `rootElement.setAttribute('data-theme', theme)`; `THEME_STORAGE_KEY = 'portfolio-theme'`; 저장값 없으면 `matchMedia('(prefers-color-scheme: dark)')` |
| 햄버거 | `js/nav.js` | `setMenuOpen(isOpen)` — `.is-open`, `.is-active`, `aria-expanded`, `aria-label`을 한 번에; Esc 키로 닫기 |
| nav 배경 | `js/nav.js` | `NAV_SCROLL_THRESHOLD = 60`; `siteHeader.classList.toggle('is-scrolled', window.scrollY >= NAV_SCROLL_THRESHOLD)` |
| 스크롤탑 | `js/scrollTop.js` | `SCROLL_TOP_THRESHOLD = 300`; `.is-visible` 토글 |
| 스크롤 애니메이션 | `js/reveal.js` | `REVEAL_THRESHOLD = 0.2`; `[data-reveal]` 요소에 `.is-visible` 추가 후 `unobserve` |
| 타이핑 | `js/typing.js` | `ROLES` 배열을 `typeText` / `eraseText`로 순환; `prefers-reduced-motion`이면 정적 표시 |

```js
// js/nav.js
const setMenuOpen = (isOpen) => {
  navMenu.classList.toggle('is-open', isOpen);
  navToggle.classList.toggle('is-active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
};
```

부드러운 스크롤은 JS가 아니라 CSS `html { scroll-behavior: smooth }`로 처리했다. 앵커 링크의 기본 동작을 그대로 쓰므로 `preventDefault()`가 필요 없고, 코드가 줄어든다. `scroll-padding-top`으로 고정 헤더 높이만큼 여백을 준다.

**흔한 실수**
- `scroll` 이벤트에서 무거운 계산 → `classList.toggle`만 하고 `{ passive: true }` 옵션
- 다크 모드 초기 적용을 `click` 리스너 안에만 두어 새로고침 시 복원 안 됨 → 파일 로드 즉시 `applyTheme(readInitialTheme())`
- `IntersectionObserver` 콜백에서 `unobserve`를 안 해 스크롤할 때마다 애니메이션이 반복됨
- `aria-expanded`를 안 바꿔 스크린리더가 메뉴 열림/닫힘을 모름

**완료 확인**
- 토글 클릭 → 새로고침 → 테마 유지. DevTools Application → Local Storage에 `portfolio-theme` 확인
- 375px 폭에서 햄버거 클릭 → 메뉴 표시 → 메뉴 항목 클릭 → 닫힘 + 해당 섹션 이동
- 스크롤 60px 지점에서 헤더 배경·그림자 생김, 300px에서 버튼 등장
- 아래로 스크롤하면 섹션이 순서대로 페이드인

---

### Phase 4 — GitHub API 4상태

**목표**: `fetch` + `async/await`로 저장소 목록을 받고, `status` 하나의 값에 따라 로딩·성공·에러·빈 상태를 그린다.

- [ ] 엔드포인트 `https://api.github.com/users/{아이디}/repos`
- [ ] `state = { status, repos, filter, errorMessage }` 객체와 `setState(patch)` → `render()`
- [ ] 로딩: 스피너 + 스켈레톤 카드
- [ ] 성공: `repos.map(createRepoCard).join('')`
- [ ] 에러: "프로젝트를 불러올 수 없습니다" + 재시도 버튼 (403은 레이트 리밋 안내)
- [ ] 빈 상태: "표시할 프로젝트가 없습니다"
- [ ] `try/catch`, `!response.ok`면 `throw`
- [ ] (보너스) 언어별 필터 버튼 — `Set`으로 언어 추출, `array.filter()`

**왜 상태 객체**: 화면을 직접 조작하는 코드(`grid.innerHTML = ...`)가 fetch 성공 분기, 실패 분기, 필터 클릭 분기에 흩어지면 어느 시점에 무엇이 보이는지 추적할 수 없다. `state`를 유일한 진실로 두고, 어디서든 `setState()`만 호출하면 `render()`가 현재 상태를 그대로 그린다. 이것이 React `useState`의 원형이다.

**왜 구조분해·map**: API 응답 객체에서 필요한 필드만 꺼내 이름을 바꿔 쓰고(`html_url: url`), 데이터 배열을 HTML 문자열 배열로 1:1 변환하는 데 `map`이 정확히 맞는다.

**이 저장소**: `js/github.js`

```js
const state = {
  status: 'idle',
  repos: [],
  filter: FILTER_ALL,
  errorMessage: '',
};

const setState = (patch) => {
  Object.assign(state, patch);
  render();
};

function render() {
  renderFilters();

  if (state.status === 'loading') renderLoading();
  else if (state.status === 'error') renderError();
  else if (state.status === 'success') renderSuccess();
}
```

```js
const createRepoCard = ({ name, description, html_url: url, language, stargazers_count: stars, updated_at: updatedAt }) => {
  const languageLabel = language ?? '—';
  const languageColor = LANGUAGE_COLORS[language] ?? '';
  const hasDescription = Boolean(description);

  return `
    <article class="project-card">
      ...
      <h3 class="project-card-title">${escapeHtml(name)}</h3>
      ...
    </article>
  `;
};
```

`escapeHtml()`을 거치는 이유: 저장소 설명은 외부 데이터다. `<script>` 같은 문자열이 그대로 `innerHTML`에 들어가면 XSS다. 템플릿 리터럴에 외부 값을 넣을 때는 항상 이스케이프한다.

**흔한 실수**
- `fetch`는 404·403에서도 reject되지 않는다 → `if (!response.ok) throw new Error(...)`가 없으면 에러가 성공 분기로 흘러감
- 재시도 버튼을 `innerHTML`로 만든 뒤 리스너를 안 붙임 → `renderError()` 안에서 `document.getElementById('retryBtn').addEventListener('click', loadRepos)`
- 빈 배열을 성공으로 처리해 빈 grid만 보임 → `visibleRepos.length === 0`이면 `renderEmpty()`
- 로딩 상태를 안 그려 API가 느릴 때 화면이 비어 보임

**완료 확인**: 5장의 "4상태 강제 재현" 절차로 네 화면을 모두 눈으로 확인하고 스크린샷.

---

### Phase 5 — 폼 유효성

**목표**: 이름·이메일·메시지 필수값과 이메일 형식을 검사하고, 에러를 필드 바로 아래에 표시한다.

- [ ] `<form novalidate>` — 브라우저 기본 검증 대신 직접 처리
- [ ] `submit`에서 `event.preventDefault()`
- [ ] `input` 이벤트로 실시간 검증
- [ ] 에러 메시지는 각 필드의 `<p class="error-message">`에, 필드 래퍼에 `.is-invalid`
- [ ] 정규식 `EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- [ ] 성공 시 `form.reset()` + 성공 메시지

**왜 novalidate**: `type="email"`은 브라우저가 먼저 툴팁을 띄우고 `submit` 이벤트 자체를 막는다. 우리가 직접 "상태 → 렌더링"을 보여주려면 브라우저 검증을 끄고 JS가 판단해야 한다.

**왜 validators 객체**: 필드마다 `if`를 늘어놓는 대신 `validators[name](value)`로 규칙을 조회한다. 필드가 늘어나도 `fields` 배열과 `validators`에 한 줄씩만 추가하면 된다.

**이 저장소**: `js/contactForm.js`

```js
const formState = {
  errors: { name: '', email: '', message: '' },
  isSubmitted: false,
};

const setFormState = (patch) => {
  Object.assign(formState, patch);
  renderForm();
};

function renderForm() {
  fields.forEach(renderField);
  formSuccess.textContent = formState.isSubmitted ? SUCCESS_MESSAGE : '';
}
```

**흔한 실수**
- `input` 이벤트 없이 `submit`에서만 검증 → 에러가 떴는데 고쳐도 사라지지 않음
- 성공 메시지를 지우지 않아 다시 입력할 때도 남아 있음 → `input` 시 `isSubmitted: false`
- 첫 에러 필드로 포커스를 안 옮김 → `firstInvalid.input.focus()`

**완료 확인**: 빈 폼 제출 → 3개 에러. 이메일에 `abc` 입력 → 형식 에러. 모두 채우고 제출 → 성공 메시지 + 폼 비워짐.

---

### Phase 6 — 배포 (GitHub Pages)

**목표**: 외부에서 접속 가능한 URL을 만든다.

- [ ] GitHub에 저장소 생성, `main` 푸시
- [ ] Settings → Pages → Source: Deploy from a branch, Branch: `main` / `/ (root)`
- [ ] 1~2분 후 `https://<계정>.github.io/<저장소>/` 접속
- [ ] 배포 URL에서 모든 기능 재확인 (6장 체크리스트)

**왜 root**: `index.html`이 저장소 루트에 있으므로 별도 빌드 없이 그대로 서빙된다. 경로는 모두 상대 경로(`css/style.css`, `images/profile.jpg`)라 하위 경로 배포에서도 깨지지 않는다.

**흔한 실수**
- 경로를 `/css/style.css`처럼 절대 경로로 써서 `github.io/<저장소>/`에서 404
- Pages 설정 후 바로 접속해 404 → Actions 탭에서 배포 완료 확인 후 재시도
- 이미지 파일명 대소문자 불일치 (`Profile.jpg` vs `profile.jpg`) — macOS는 통과, GitHub Pages(리눅스)는 404

**완료 확인**: 시크릿 창에서 배포 URL 접속 → 다크 모드·햄버거·API·폼 모두 동작.

---

### Phase 7 — README·스크린샷·제출

- [ ] README: 프로젝트 설명, 사용 기술, 배포 URL, 저장소 URL, 스크린샷 3종, 기준값(60 / 300 / 0.2) 명시
- [ ] 스크린샷: 데스크톱(1440), 모바일(390), 다크 모드
- [ ] 제출 전 1장 "제약" 표의 grep 검사

**이 저장소**: `README.md` — "주요 기능과 기준값" 표에 세 임계값이 파일·상수 이름과 함께 적혀 있다.

---

## 4. "이벤트 → 상태 변경 → 화면 업데이트" 패턴

미션이 요구하는 3가지 이상의 흐름. 이 저장소에는 4개가 있다.

### 4.1 다크 모드

| 이벤트 | 상태 | 렌더 |
| --- | --- | --- |
| `themeToggleBtn` `click` | `data-theme` 속성 값 (`'light'` / `'dark'`) + `localStorage['portfolio-theme']` | CSS `[data-theme='dark']` 변수 세트가 적용되어 전체 색 변경, 토글 아이콘 교체 |

```js
// js/theme.js
const applyTheme = (theme) => {
  rootElement.setAttribute('data-theme', theme);
  themeToggleBtn.setAttribute('aria-pressed', String(theme === DARK));
  themeToggleBtn.setAttribute('aria-label', theme === DARK ? '라이트 모드로 전환' : '다크 모드로 전환');
};

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = rootElement.getAttribute('data-theme');
  const nextTheme = currentTheme === DARK ? LIGHT : DARK;

  applyTheme(nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
});
```

여기서 "상태"는 JS 변수가 아니라 DOM 속성 `data-theme`이다. 렌더링은 CSS가 전담한다 — JS는 상태만 바꾼다.

### 4.2 GitHub API

| 이벤트 | 상태 | 렌더 |
| --- | --- | --- |
| 페이지 로드 `loadRepos()`, 재시도 버튼 `click` | `state.status` (`loading` → `success` \| `error`), `state.repos`, `state.errorMessage` | `render()` → `renderLoading()` / `renderSuccess()` / `renderError()` / `renderEmpty()` |

```js
// js/github.js
async function loadRepos() {
  setState({ status: 'loading', errorMessage: '' });

  try {
    const response = await fetch(GITHUB_API_URL);

    if (!response.ok) {
      throw new Error(describeHttpError(response.status));
    }

    const data = await response.json();
    const ownRepos = data.filter(({ fork }) => !fork);

    setState({ status: 'success', repos: ownRepos });
  } catch (error) {
    const isNetworkError = error instanceof TypeError;
    const errorMessage = isNetworkError ? '네트워크에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.' : error.message;

    console.error('GitHub API 호출 실패:', error);
    setState({ status: 'error', errorMessage });
  }
}
```

`loadRepos` 안에는 DOM 조작이 한 줄도 없다. 상태만 바꾸고, 그리기는 `render()`가 한다.

### 4.3 폼 유효성

| 이벤트 | 상태 | 렌더 |
| --- | --- | --- |
| 각 필드 `input`, 폼 `submit` | `formState.errors` (필드별 메시지), `formState.isSubmitted` | `renderForm()` → 필드별 `.is-invalid` 토글, `aria-invalid`, 에러 텍스트, 성공 메시지 |

```js
// js/contactForm.js
fields.forEach(({ name, input }) => {
  input.addEventListener('input', () => {
    setFormState({
      errors: { ...formState.errors, [name]: validators[name](input.value) },
      isSubmitted: false,
    });
  });
});
```

`{ ...formState.errors, [name]: ... }`는 기존 에러 객체를 복사하면서 한 필드만 바꾼다(불변 업데이트). React에서 `setErrors(prev => ({ ...prev, [name]: msg }))`와 같은 모양이다.

### 4.4 언어 필터 (보너스)

| 이벤트 | 상태 | 렌더 |
| --- | --- | --- |
| `filterBar` 위 `[data-filter]` 버튼 `click` | `state.filter` (`'all'` 또는 언어명) | `renderFilters()`가 활성 버튼 갱신, `renderSuccess()`가 `getVisibleRepos()`로 카드 재생성, 0건이면 `renderEmpty()` |

```js
// js/github.js
const getVisibleRepos = () =>
  state.repos.filter(({ language }) => state.filter === FILTER_ALL || language === state.filter);

filterBar.addEventListener('click', ({ target }) => {
  const button = target.closest('[data-filter]');
  if (!button) return;
  setState({ filter: button.dataset.filter });
});
```

버튼이 몇 개든 리스너는 `filterBar` 하나에만 붙인다(이벤트 위임). `render()`가 버튼을 다시 그려도 리스너는 살아 있다.

### React와의 대응

React의 `const [status, setStatus] = useState('idle')`는 이 코드의 `state.status` + `setState()`다. 차이는 하나 — React는 `setStatus()`가 호출되면 컴포넌트 함수를 **자동으로** 다시 실행해 화면을 갱신하지만, 여기서는 `setState()` 마지막 줄에서 `render()`를 **직접** 부른다. 이 한 줄이 React가 대신 해주는 전부다. 이 미션에서 `setState → render`를 손으로 짜 보면, React에서 "왜 상태를 직접 바꾸면 안 되고 setter를 써야 하는지"가 자연스럽게 이해된다.

---

## 5. GitHub API 다루기

### 엔드포인트

```
https://api.github.com/users/newids/repos?per_page=100&sort=updated
```

- `per_page=100`: 기본 30개 제한을 넘어 전부 받는다(계정 저장소가 100개 이하일 때).
- `sort=updated`: 최근 작업한 저장소가 앞에 온다.
- 응답은 배열. 각 항목에서 쓰는 필드: `name`, `description`, `html_url`, `language`, `stargazers_count`, `updated_at`, `fork`.

### 레이트 리밋

- 인증 없는 호출은 **IP당 시간당 60회**. 초과 시 HTTP **403**과 `X-RateLimit-Remaining: 0` 헤더.
- Live Server 자동 새로고침 + 여러 탭이면 금방 소진된다. 개발 중에는 저장 빈도를 의식하거나, 탭을 하나만 연다.
- `describeHttpError(403)`이 "요청 한도(시간당 60회)를 넘었습니다"를 반환해 에러 패널에 표시된다. 재시도 버튼은 남겨 두되, 한도가 풀리는 데 최대 1시간 걸린다는 안내를 함께 보여준다.
- 확인: DevTools Network에서 요청 헤더 `X-RateLimit-Remaining` 값.

### fork 제외

```js
const ownRepos = data.filter(({ fork }) => !fork);
```

포크한 저장소(go-ethereum 등)는 본인 작업이 아니므로 제외. 이것도 `array.filter()` 요구사항의 예시다.

### 에러 분류

| 원인 | 감지 | 사용자 메시지 |
| --- | --- | --- |
| HTTP 403 | `!response.ok`, `status === 403` | 요청 한도 초과 안내 |
| HTTP 404 | `status === 404` | 사용자를 찾을 수 없음 |
| 기타 HTTP 오류 | `!response.ok` | `HTTP {status}` |
| 네트워크 단절·CORS·DNS | `fetch`가 reject → `error instanceof TypeError` | 인터넷 연결 확인 |

`fetch`는 HTTP 오류에서 reject되지 않는다. `!response.ok`일 때 직접 `throw`해야 `catch`로 간다. 반대로 네트워크 자체가 안 되면 `TypeError`로 reject된다 — 이 둘을 구분해야 메시지가 정확하다.

### 4상태 강제 재현

| 상태 | 방법 |
| --- | --- |
| 로딩 | DevTools → Network → Throttling을 **Slow 3G**로 → 새로고침. 스피너와 스켈레톤 3장이 몇 초간 보인다 |
| 성공 | 정상 새로고침 |
| 에러 (404) | `js/github.js`의 `GITHUB_USERNAME`을 `'no-such-user-xyz-123'`으로 바꾸고 저장 → 에러 패널 + 재시도 버튼. 확인 후 원복 |
| 에러 (네트워크) | DevTools → Network → **Offline** 체크 → 재시도 버튼 클릭 → "네트워크에 연결할 수 없습니다" |
| 에러 (403) | 짧은 시간에 60회 이상 새로고침. 권장하지 않음 — 404·오프라인으로 에러 UI를 검증하고, 403 분기는 `describeHttpError` 코드로 확인 |
| 빈 상태 | 저장소가 없는 계정으로 `GITHUB_USERNAME` 변경, 또는 성공 상태에서 저장소가 1개뿐인 언어 필터를 눌러 본 뒤 코드에서 그 언어를 임시로 제외. 실제로는 필터 결과 0건 경로(`getVisibleRepos().length === 0` → `renderEmpty()`)가 같은 UI를 쓴다 |

각 상태를 재현할 때마다 스크린샷을 남기면 평가 설명서에 그대로 쓸 수 있다.

---

## 6. 배포와 제출 체크리스트

### GitHub Pages 절차

1. 저장소 루트에 `index.html`이 있는지 확인.
2. `git add -A && git commit -m "feat: portfolio site" && git push -u origin main`
3. GitHub → 저장소 → **Settings → Pages**
4. Build and deployment → Source: **Deploy from a branch** → Branch: **main**, 폴더: **/ (root)** → Save
5. 상단에 "Your site is live at …" 나올 때까지 1~2분 대기. Actions 탭에서 `pages build and deployment` 완료 확인.
6. README의 배포 URL 항목을 채우고 다시 커밋.

### 배포 URL에서 확인할 항목

- [ ] 320 / 375 / 768 / 1024 / 1440 폭에서 가로 스크롤 없음
- [ ] 768 미만에서 햄버거 표시·동작, 768 이상에서 가로 메뉴
- [ ] 다크 모드 토글 → 새로고침 후 유지
- [ ] nav 링크 클릭 시 부드럽게 이동, 헤더가 제목을 가리지 않음
- [ ] 60px 스크롤 시 헤더 배경, 300px 시 맨 위로 버튼
- [ ] 섹션 스크롤 애니메이션
- [ ] Projects: 카드 로드, 언어 필터 동작, 카드 링크가 GitHub로 열림
- [ ] 폼: 빈 제출 에러, 이메일 형식 에러, 정상 제출 성공 메시지
- [ ] 콘솔에 에러 없음 (DevTools Console)
- [ ] 이미지 로드됨 (`images/profile.jpg`)

### README 필수 항목

- 프로젝트 설명, 사용 기술, 폴더 구조
- 배포 URL, 저장소 URL
- 스크린샷 3종
- 기준값: nav 60px, 스크롤탑 300px, IntersectionObserver threshold 0.2
- 로컬 실행 방법, GitHub API 레이트 리밋 안내

### 스크린샷 찍는 법

Chrome DevTools → 디바이스 모드(Cmd/Ctrl+Shift+M) → 해상도 지정 → 우측 상단 `⋮` → **Capture full size screenshot**.

| 종류 | 해상도 | 상태 |
| --- | --- | --- |
| 데스크톱 | 1440 × 900 | 라이트 모드, Projects 성공 상태 |
| 모바일 | 390 × 844 | 라이트 모드. 햄버거 열린 화면을 한 장 더 찍으면 좋다 |
| 다크 모드 | 1440 × 900 | 토글 후 |

파일은 `images/screenshots/` 에 두고 README에서 상대 경로로 참조한다.

---

## 7. 자주 막히는 지점 FAQ

**Q1. 스크립트에서 `document.getElementById(...)`가 `null`이다.**
`<script>`에 `defer`가 없거나 `<head>`에 있다. HTML 파싱 전에 실행되어 요소가 없다. 이 저장소처럼 `</body>` 직전에 `<script defer src="js/...">`로 두면 파싱 완료 후 순서대로 실행된다.

**Q2. 햄버거 버튼이 데스크톱에서도 보인다.**
`@media (min-width: 768px) { .nav-toggle { display: none; } }`이 없거나, 미디어 쿼리가 기본 스타일보다 위에 있어 덮어써진다. 모바일 퍼스트에서는 미디어 쿼리가 항상 **아래**에 온다.

**Q3. 다크 모드가 새로고침하면 풀린다.**
초기화 코드가 없다. `js/theme.js`는 파일 로드 즉시 `applyTheme(readInitialTheme())`를 호출한다. `localStorage.getItem()`은 항상 **문자열**(또는 `null`)을 돌려주므로 `=== true` 같은 비교는 실패한다 — `=== 'dark'`로 비교한다.

**Q4. 첫 화면(Hero)이 스크롤하기 전엔 안 보인다.**
`[data-reveal] { opacity: 0 }`이 적용됐는데 `IntersectionObserver`가 아직 콜백을 안 부른 것. `observe()` 직후 첫 콜백은 비동기로 오므로 한 프레임 뒤에 나타난다. 정상이다. 그래도 안 보이면 `threshold: 0.2`인데 요소가 뷰포트보다 커서 20%가 동시에 안 보이는 경우 — Hero 같은 큰 블록은 통째로 관찰하지 말고 자식 요소(`p`, `h1`, `div`)에 `data-reveal`을 붙인다. 이 저장소가 그렇게 되어 있다.

**Q5. 폼 제출 시 브라우저 툴팁("이메일 주소를 입력하세요")이 먼저 뜬다.**
`<form novalidate>`가 빠졌다. 브라우저 검증이 `submit` 이벤트를 막아 우리 코드가 실행되지 않는다.

**Q6. 재시도 버튼이 안 눌린다.**
`innerHTML`로 버튼을 새로 만들면 이전에 붙인 리스너는 사라진다. `renderError()` 안에서 버튼을 만든 **직후** `addEventListener`를 다시 붙인다. 또는 필터 바처럼 부모에 위임한다.

**Q7. "프로젝트를 불러올 수 없습니다"가 뜨는데 네트워크는 멀쩡하다.**
403 레이트 리밋일 가능성이 높다. DevTools Network에서 요청을 클릭 → Response 탭에 `API rate limit exceeded`. 1시간 기다리거나 다른 네트워크(핫스팟)로 확인. `describeHttpError(403)` 메시지가 이 상황을 사용자에게 알려준다.

**Q8. GitHub Pages에서 CSS·이미지가 404.**
`/css/style.css`처럼 `/`로 시작하는 절대 경로를 썼다. `github.io/<저장소>/` 아래에서는 `<계정>.github.io/css/style.css`를 찾게 된다. `css/style.css`(상대 경로)로 쓴다. 파일명 대소문자도 확인.

**Q9. 320px에서 프로젝트 카드가 옆으로 삐져나온다.**
`minmax(280px, 1fr)`의 최솟값이 컨테이너 폭보다 크다. `minmax(min(100%, 280px), 1fr)`로 바꾼다.

**Q10. `map`으로 만든 카드 사이에 쉼표가 보인다.**
배열을 문자열에 넣으면 `toString()`이 쉼표로 이어 붙인다. `repos.map(createRepoCard).join('')`처럼 반드시 `.join('')`.

---

관련 문서: [README.md](../README.md) · [평가 설명서 (docs/EVALUATION.md)](EVALUATION.md) · [디자인 캔버스](https://claude.ai/code/artifact/a96c9e55-c9b6-49f7-af60-e68cd0eea9ee)
