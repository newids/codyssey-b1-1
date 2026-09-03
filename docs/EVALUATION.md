# 평가 설명서 — B1-1 나를 소개하는 웹페이지 처음부터 만들기

> 이 문서는 제출물이 Mission-B1-1.md의 요구사항을 어디서·어떻게 만족하는지 근거(파일·선택자·함수·행 번호)와 함께 정리하고, 평가자가 직접 재현할 수 있는 확인 절차와 학습자의 구술 답변 초안을 담는다. 행 번호는 작성 시점 기준이며 ±5행 오차가 있을 수 있다.

---

## 1. 제출물 개요

### 1.1 링크

| 항목 | 값 |
| --- | --- |
| GitHub 저장소 URL | https://github.com/newids/codyssey-b1-1 |
| 배포 URL (GitHub Pages) | https://newids.github.io/codyssey-b1-1/ |
| 디자인 캔버스 (Claude Design) | https://claude.ai/code/artifact/a96c9e55-c9b6-49f7-af60-e68cd0eea9ee |
| 스크린샷 (데스크톱 / 모바일 / 다크 / Projects) | `images/screenshots/desktop-light.jpg` · `mobile-light.jpg` · `desktop-dark.jpg` · `desktop-projects.jpg` — 배포 URL에서 촬영 (2026-09-04), README 표에 첨부됨 |

### 1.2 폴더 구조

```
index.html          메인 페이지 — header/nav/main/section×6/footer (339줄)
css/style.css       디자인 토큰(:root, [data-theme="dark"]), 레이아웃, 반응형, 애니메이션 (1437줄)
js/theme.js         다크 모드 토글 + localStorage + prefers-color-scheme 감지 (35줄)
js/nav.js           햄버거 메뉴, Esc 닫기, 스크롤 60px 내비게이션 스타일 (36줄)
js/scrollTop.js     스크롤 300px 맨 위로 버튼 (14줄)
js/reveal.js        IntersectionObserver threshold 0.2 스크롤 애니메이션 (16줄)
js/typing.js        Hero 타이핑 효과 — 보너스 (41줄)
js/github.js        GitHub API 호출, loading/success/error/empty 렌더링, 언어 필터 — 보너스 포함 (207줄)
js/contactForm.js   문의 폼 유효성 검사 (75줄)
images/profile.jpg  프로필 사진 (640px, 이력서 PDF에서 추출·축소)
images/screenshots/ README용 스크린샷 3종 (desktop-light / mobile-light / desktop-dark)
docs/GUIDE.md       미션 수행 가이드
docs/EVALUATION.md  이 문서
README.md           프로젝트 설명, 사용 기술, 기준값, 배포 URL, 스크린샷
```

### 1.3 사용 기술 요약

| 영역 | 내용 |
| --- | --- |
| HTML5 | 시맨틱 태그(`header/nav/main/section/article/footer`), `aria-*`, `label for-id`, 모든 `img`에 `alt`, skip link |
| CSS3 | `:root` 토큰 60여 개, `[data-theme='dark']` 토큰 재정의, Flexbox 내비게이션, Grid `repeat(auto-fit, minmax(min(100%, 280px), 1fr))`, 모바일 퍼스트 + `min-width: 768px / 1024px`, `clamp()`, `color-mix()`, `prefers-reduced-motion` |
| JavaScript (ES6+) | `const/let`만 사용, 화살표 함수, 템플릿 리터럴, 구조분해, 스프레드, `map/filter/forEach`, `Set`, `Object.fromEntries`, `fetch` + `async/await` + `try/catch`, `IntersectionObserver`, `localStorage`, `matchMedia`, `passive` 스크롤 리스너 |
| 외부 리소스 | Google Fonts 3종(Hahmlet, IBM Plex Sans KR, IBM Plex Mono)만 사용. 아이콘은 인라인 SVG. 프레임워크·CSS 라이브러리·jQuery 없음 |

### 1.4 기준값 (Mission이 README 명시를 요구한 값)

| 항목 | 값 | 정의 위치 |
| --- | --- | --- |
| 내비게이션 배경 변경 스크롤 위치 | **60px** | `js/nav.js:1` `NAV_SCROLL_THRESHOLD = 60` |
| 맨 위로 버튼 표시 스크롤 위치 | **300px** | `js/scrollTop.js:1` `SCROLL_TOP_THRESHOLD = 300` |
| IntersectionObserver threshold | **0.2** | `js/reveal.js:1` `REVEAL_THRESHOLD = 0.2` |
| Projects 최대 표시 개수 | **9개** (fork 제외, 최근 업데이트 순) | `js/github.js:3` `MAX_VISIBLE_REPOS = 9` |
| 로딩 스켈레톤 카드 수 | 3개 | `js/github.js:4` `SKELETON_COUNT = 3` |
| GitHub API 무인증 한도 | 시간당 60회 (403 시 에러 UI) | `js/github.js:178-182` `describeHttpError()` |
| 브레이크포인트 | 768px(태블릿), 1024px(데스크톱) | `css/style.css:1228`, `css/style.css:1348` |
| 다크 모드 저장 키 | `localStorage['portfolio-theme']` | `js/theme.js:1` |

---

## 2. 요구사항 ↔ 구현 매핑

상태 범례: ✅ 로컬에서 구현·검증 완료 · ⬜ 배포/제출 단계에서 확인 필요

### 2.1 프로젝트 기본 구성

| 요구사항 | 구현 위치 | 확인 방법 | 상태 |
| --- | --- | --- | --- |
| `index.html` / `css/` / `js/` / `images/` 역할 분리 | 루트 `index.html`, `css/style.css`, `js/*.js` 7개, `images/profile.jpg` | `ls -R`로 구조 확인 | ✅ |
| 외부 스타일시트·JS를 HTML에 올바르게 연결 | `index.html:14` `<link rel="stylesheet" href="css/style.css">`, `index.html:331-337` `<script defer src="js/...">` 7개 | DevTools Network 탭에서 css 1개, js 7개가 200으로 로드되는지 확인 | ✅ |
| VS Code + Live Server 개발 환경 | 정적 파일만 사용하므로 별도 빌드 없음 | Live Server로 `index.html` 열기 (또는 `python3 -m http.server`) | ✅ |

### 2.2 HTML 구조 (시맨틱 마크업)

| 요구사항 | 구현 위치 | 확인 방법 | 상태 |
| --- | --- | --- | --- |
| `header` | `index.html:19` `<header class="site-header" id="siteHeader">` | 요소 검사 | ✅ |
| `nav` | `index.html:20` `<nav class="navbar" aria-label="주요 내비게이션">` | 요소 검사 | ✅ |
| `main` | `index.html:49` `<main id="main">` | 요소 검사 | ✅ |
| `section` ×6 이상 | `#hero`(50), `#about`(94), `#experience`(132), `#skills`(184), `#projects`(239), `#contact`(256) — 각 `aria-labelledby` 연결 | `document.querySelectorAll('main > section').length` → 6 | ✅ |
| `article` | Skills 카드 4개 `index.html:190, 205, 214, 225` + Projects 카드 `js/github.js:81` `<article class="project-card">` | 요소 검사 | ✅ |
| `footer` | `index.html:306` `<footer class="site-footer">` | 요소 검사 | ✅ |
| Hero (인사말, CTA 버튼) | `index.html:50-92` — h1 + 타이핑 역할 + 소개 문장 + `프로젝트 보기` / `연락하기` 버튼 + 사실 3개(`dl.hero-facts`) | 첫 화면 확인 | ✅ |
| About (자기소개, 프로필 이미지) | `index.html:94-130` — `figure.about-photo > img` + 본문 2단락 + `dl.about-facts` | 스크롤 후 확인 | ✅ |
| Skills (기술 스택 목록) | `index.html:184-237` — `article.skill-card` 4개, `ul.tag-list` | 스크롤 후 확인 | ✅ |
| Projects (GitHub API 카드) | `index.html:239-254` 컨테이너 + `js/github.js` 렌더링 | 카드가 API 응답으로 채워지는지 확인 | ✅ |
| Contact (문의 폼) | `index.html:256-303` `form#contactForm` | 스크롤 후 확인 | ✅ |
| Footer (저작권, 소셜 링크) | `index.html:306-325` — `© 2026 최진석`, GitHub·이메일 링크 | 맨 아래 확인 | ✅ |
| 네비게이션 앵커 링크 | `index.html:39-46` `a.nav-link[href="#about"...]` 5개 + `index.html:22` 로고 `#hero` | 클릭 시 해당 섹션으로 이동 | ✅ |
| 모든 이미지에 의미 있는 `alt` | `index.html:97` `alt="최진석 프로필 사진"` (페이지 내 유일한 `img`) | `document.querySelectorAll('img:not([alt])').length` → 0 | ✅ |
| `label` ↔ `for-id` 매칭 | `index.html:279/280`, `285/286`, `291/292` — `contactName`, `contactEmail`, `contactMessage` | 라벨 클릭 시 해당 입력창 포커스 | ✅ |
| (추가) Experience 섹션 | `index.html:132-182` `ol.timeline` — 요구사항 외 추가 섹션 | — | ✅ |

### 2.3 CSS 스타일링 (레이아웃 & 반응형)

| 요구사항 | 구현 위치 | 확인 방법 | 상태 |
| --- | --- | --- | --- |
| 외부 스타일시트 `css/style.css` | `css/style.css` 단일 파일 | Network 탭 | ✅ |
| `:root` 변수로 색상·폰트·간격 정의 | `css/style.css:5-59` — `--color-*`, `--font-serif/sans/mono`, `--space-1…28`, `--radius-*`, `--shadow-*`, `--transition-*` | 파일 상단 확인 | ✅ |
| `[data-theme="dark"]` 변수 별도 정의 | `css/style.css:61-85` — 색상·그림자 토큰만 재정의 (레이아웃 토큰은 공유) | DevTools에서 `html[data-theme=dark]` 계산값 확인 | ✅ |
| 네비게이션 Flexbox (로고 왼쪽, 메뉴 오른쪽) | `css/style.css:319-327` `.navbar { display:flex; justify-content:space-between }` + 데스크톱 `.nav-menu { margin-left:auto }` (`:1248`) | 768px 이상에서 로고 좌·메뉴 우 | ✅ |
| Projects 카드 Grid (`auto-fit`, `minmax`) | `css/style.css:899-903` `.projects-grid { grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)) }` | 창 너비를 줄이면 3열→2열→1열로 자동 재배치 | ✅ |
| 모바일 퍼스트 | 기본 스타일이 모바일, `@media (min-width: 768px)`(`:1228`), `(min-width: 1024px)`(`:1348`)로 확장 | 미디어 쿼리에 `max-width`가 없음 | ✅ |
| 브레이크포인트 768px / 1024px | 위와 동일 | `grep -n "@media" css/style.css` | ✅ |
| 모바일에서 네비게이션 숨김 + 햄버거 버튼 | `.nav-menu`(`:423-437`) 기본 `visibility:hidden; opacity:0`, `.nav-toggle`(`:390`) 기본 표시 → 768px 이상에서 `.nav-toggle { display:none }`(`:1233`), `.nav-menu { position:static; visibility:visible }`(`:1240`) | 767px 이하에서 햄버거만 보임 | ✅ |
| 버튼·카드 hover + transition | `.btn:hover`(`:258`) `translateY(-2px)`, `.skill-card:hover`(`:727`), `.project-card:hover`(`:922`) `translateY(-4px)` + `box-shadow` 변경, 모두 `transition` 선언 | 마우스 오버 시 살짝 떠오름 | ✅ |
| 카드 `box-shadow` | `--shadow-card` 토큰을 `.skill-card`, `.project-card`, `.contact-form`에 적용 | 요소 검사 | ✅ |

### 2.4 JavaScript 기초 (DOM & 이벤트)

| 요구사항 | 구현 위치 | 확인 방법 | 상태 |
| --- | --- | --- | --- |
| JS를 `defer`로 연결 | `index.html:331-337` 7개 모두 `defer` | HTML 확인 | ✅ |
| `var` 대신 `const`, `let`만 사용 | 전 JS 파일. `let`은 `js/typing.js:27` (`roleIndex`) 1곳, 나머지는 `const` | `grep -rn "\bvar\b" js/` → 0건 | ✅ |
| HTML `onclick` 미사용, `addEventListener` 사용 | `theme.js:23,31`, `nav.js:15,21,24,35`, `scrollTop.js:9,12`, `github.js:129,170`, `contactForm.js:52,60` | `grep -rn "onclick" index.html js/` → 0건 | ✅ |
| `querySelector` / `querySelectorAll` | `nav.js:6` `querySelectorAll('.nav-link')`, `reveal.js:3` `querySelectorAll('[data-reveal]')`, `contactForm.js:39` `closest('.form-field')`; 단일 요소는 `getElementById` 병용 | — | ✅ |
| `textContent` / `innerHTML`로 내용 변경 | `github.js:105-157` (`innerHTML`), `contactForm.js:41,46` (`textContent`), `typing.js:13,21` (`textContent`) | — | ✅ |
| `classList.add / remove / toggle` | `reveal.js:9` `add('is-visible')`, `nav.js:9-10` `toggle('is-open', isOpen)`, `scrollTop.js:6`, `contactForm.js:39` `toggle('is-invalid', …)` | — | ✅ |
| `click` 이벤트 | `theme.js:23`, `nav.js:15,21`, `scrollTop.js:12`, `github.js:129,170` | — | ✅ |
| `submit` 이벤트 | `contactForm.js:60` | — | ✅ |
| `scroll` 이벤트 | `nav.js:35`, `scrollTop.js:9` (`{ passive: true }`) | — | ✅ |
| `input` 이벤트 | `contactForm.js:52` | — | ✅ |
| `event.preventDefault()` | `contactForm.js:61` | 제출 시 페이지가 새로고침되지 않음 | ✅ |

### 2.5 인터랙션 7종

| 요구사항 | 구현 위치 | 확인 방법 | 상태 |
| --- | --- | --- | --- |
| 햄버거 메뉴 토글 (`classList.toggle('active')` 활용) | `js/nav.js:15-18` — `navMenu.classList.toggle('is-open')` → `setMenuOpen(isOpen)`이 `.nav-toggle.is-active`·`aria-expanded`·`aria-label` 동기화. 클래스명은 `is-open`/`is-active`(BEM 상태 접두어) | 767px 이하에서 버튼 클릭 → 메뉴 펼침, 재클릭 → 접힘 | ✅ |
| 부드러운 스크롤 | `css/style.css:97-100` `html { scroll-behavior: smooth; scroll-padding-top: calc(var(--nav-height) + var(--space-4)) }` (고정 헤더에 가려지지 않도록 오프셋) | nav 링크 클릭 시 애니메이션 스크롤 | ✅ |
| 스크롤 탑 버튼 (300px) | `js/scrollTop.js` — `is-visible` 토글, 클릭 시 `window.scrollTo({ top: 0, behavior: 'smooth' })` | 300px 이상 스크롤 시 우하단 버튼 표시 | ✅ |
| 네비게이션 스타일 변경 (60px) | `js/nav.js:31-36` `updateHeaderStyle()` → `.site-header.is-scrolled` (`css:313`) 배경·테두리·그림자 | 60px 이상 스크롤 시 헤더가 surface 색으로 변경 | ✅ |
| 다크 모드 토글 + localStorage 유지 | `js/theme.js:9-13` `applyTheme()`, `:23-29` 클릭 시 저장, `:15-19` 초기 로드 시 복원 | 토글 → 새로고침 → 유지 | ✅ |
| 스크롤 애니메이션 (threshold ≥ 0.2) | `js/reveal.js` — `threshold: 0.2`, `[data-reveal]` 요소 39개에 `is-visible` 추가 후 `unobserve` | 스크롤 시 섹션이 아래에서 떠오름 | ✅ |
| 폼 UX | 2.6 참조 | — | ✅ |

### 2.6 폼 UX

| 요구사항 | 구현 위치 | 확인 방법 | 상태 |
| --- | --- | --- | --- |
| 이름·이메일·메시지 폼 | `index.html:277-302` | — | ✅ |
| 필수값 검증 (빈 필드 제출 불가) | `js/contactForm.js:7-16` `validators.name/email/message` — `value.trim() === ''` 검사 | 빈 채로 보내기 → 3개 에러 메시지 | ✅ |
| 이메일 형식 검증 | `js/contactForm.js:1` `EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/`, `:9-13` | `abc` 입력 → "올바른 이메일 형식이 아닙니다." | ✅ |
| 에러 메시지가 필드 근처에 표시 | 각 `input` 바로 아래 `p.error-message#contact*Error` (`index.html:281,287,293`) + `.form-field.is-invalid` 테두리 강조 (`css:1096`) | 시각 확인 | ✅ |
| `preventDefault()` + 성공 메시지 | `js/contactForm.js:60-75` — 검증 통과 시 `contactForm.reset()` 후 `isSubmitted: true` → `#formSuccess`에 메시지 | 유효 입력 후 보내기 → 초록 성공 문구, 필드 초기화 | ✅ |
| (추가) `novalidate`로 브라우저 기본 검증 대신 직접 검증 | `index.html:277` | 브라우저 툴팁이 뜨지 않음 | ✅ |
| (추가) 첫 오류 필드로 포커스 이동, `aria-invalid` | `js/contactForm.js:40, 68-70` | 키보드 사용자 확인 | ✅ |

### 2.7 ES6+ 문법 & 배열 메서드

| 요구사항 | 구현 위치 (대표 예) | 상태 |
| --- | --- | --- |
| 화살표 함수 | 전 파일. 예: `js/theme.js:9` `const applyTheme = (theme) => {…}` | ✅ |
| 템플릿 리터럴로 HTML 생성 | `js/github.js:60-98` `createFilterButton`, `createSkeletonCard`, `createRepoCard`; `:119-125` 에러 패널 | ✅ |
| 구조분해 할당 | 객체: `js/github.js:75` `({ name, description, html_url: url, language, stargazers_count: stars, updated_at: updatedAt })`; `js/contactForm.js:37` `({ name, input, error })`; 이벤트: `js/nav.js:24` `({ key })`, `js/theme.js:31` `({ matches })` | ✅ |
| `map` — GitHub 데이터 → 카드 | `js/github.js:156` `shownRepos.map(createRepoCard).join('')` | ✅ |
| `filter` — 조건부 표시 (선택) | `js/github.js:195` fork 제외, `:56` 언어 필터, `:51` `filter(Boolean)` | ✅ |
| `forEach` — 배열 순회 | `js/nav.js:20`, `js/reveal.js:7,16`, `js/contactForm.js:45,51` | ✅ |
| (추가) 스프레드·`Set`·`Object.fromEntries`·`Array.from` | `js/github.js:52,109,114`, `js/contactForm.js:54,63` | ✅ |

### 2.8 비동기 처리 & API 연동

| 요구사항 | 구현 위치 | 확인 방법 | 상태 |
| --- | --- | --- | --- |
| `fetch` + `async/await` | `js/github.js:184-205` `async function loadRepos()` — `await fetch(GITHUB_API_URL)`, `await response.json()` | Network 탭에서 `api.github.com` 요청 확인 | ✅ |
| 엔드포인트 `users/{본인아이디}/repos` | `js/github.js:1-2` `https://api.github.com/users/newids/repos?per_page=100&sort=updated` | — | ✅ |
| 로딩 상태 UI | `renderLoading()` (`:112-116`) — 스피너 + "GitHub 저장소를 불러오는 중…" + 스켈레톤 카드 3개 | DevTools Network → Slow 3G 후 새로고침 | ✅ |
| 성공 상태 UI | `renderSuccess()` (`:145-158`) — 카드 grid + "N개 중 M개 표시" | 기본 로드 | ✅ |
| 에러 상태 UI ("불러올 수 없습니다" + 재시도) | `renderError()` (`:118-130`) — 대시 테두리 패널, 원인 문구, `#retryBtn` → `loadRepos` 재호출 | `GITHUB_USERNAME`을 존재하지 않는 값으로 바꾸거나 오프라인 | ✅ |
| 빈 상태 UI ("표시할 프로젝트가 없습니다") | `renderEmpty()` (`:132-143`) — 필터 결과 0건/저장소 없음 문구 분기 | 언어 필터로 결과 0건 만들기 (§6 QA-19) | ✅ |
| `try/catch` | `js/github.js:187-204` | — | ✅ |
| 403 레이트 리밋 → 에러 UI | `:189-191` `if (!response.ok) throw new Error(describeHttpError(response.status))`, `:179` 403 전용 문구 | 1시간 내 60회 이상 호출 후 확인 (또는 DevTools로 403 응답 오버라이드) | ✅ |
| (추가) 네트워크 오류와 HTTP 오류 구분 | `:199-200` `error instanceof TypeError` → 네트워크 안내 문구 | 오프라인 모드 | ✅ |

### 2.9 상태 관리 패턴 (3가지 이상 "상태 → 렌더링")

| 흐름 | 상태 | 렌더 함수 | 상태 |
| --- | --- | --- | --- |
| 1. 다크 모드 | `html[data-theme]` + `localStorage['portfolio-theme']` | `applyTheme()` → CSS 변수 세트 교체 | ✅ |
| 2. GitHub API | `state.status` (`idle/loading/success/error`), `state.repos`, `state.errorMessage` | `render()` → `renderFilters()` + 상태별 `renderLoading/Error/Success/Empty` | ✅ |
| 3. 폼 유효성 | `formState.errors{name,email,message}`, `formState.isSubmitted` | `renderForm()` → `renderField()` ×3 + 성공 메시지 | ✅ |
| 4. 언어 필터 (선택) | `state.filter` | `render()` → `getVisibleRepos()` 재계산 → 카드 재출력 | ✅ |

상세 증빙은 §4.

### 2.10 배포

| 요구사항 | 구현 위치 | 확인 방법 | 상태 |
| --- | --- | --- | --- |
| GitHub Pages 배포 | 정적 파일만 있어 `main` 브랜치 루트 배포로 충분 (README §GitHub Pages 배포) | 배포 URL 접속 | ⬜ |
| 배포 URL에서 반응형 동작 | — | §6 QA-01~05를 배포 URL에서 재실행 | ⬜ |
| 배포 URL에서 인터랙션 동작 | — | §6 QA-06~14 | ⬜ |
| 배포 URL에서 GitHub API 연동 | — | §6 QA-15~19 (HTTPS 페이지에서 HTTPS API 호출이므로 mixed content 문제 없음) | ⬜ |
| 배포 URL에서 폼 유효성 검사 | — | §6 QA-20~23 | ⬜ |
| README: 설명·사용 기술·배포 URL·스크린샷 | `README.md` — 설명·기술·기준값·구조·배포 절차·스크린샷 3종(로컬 촬영) 작성 완료, **배포 URL·저장소 URL은 플레이스홀더** | README 확인 | ⬜ |

### 2.11 보너스 과제

| 보너스 | 구현 여부 | 구현 위치 / 비고 |
| --- | --- | --- |
| 프로젝트 언어별 필터링 (`array.filter()`) | ✅ 구현 | `js/github.js:50-57` `getLanguages()`·`getVisibleRepos()`, `:103-110` 필터 버튼 생성, `:170-174` 클릭 → `setState({ filter })`. 언어 목록은 응답 데이터에서 `Set`으로 자동 추출 |
| 타이핑 효과 | ✅ 구현 | `js/typing.js` — `ROLES` 5개를 타이핑/홀드/삭제 반복. `prefers-reduced-motion` 시 정적 문자열로 대체 (`:36-40`) |
| 시스템 다크 모드 감지 (`prefers-color-scheme`) | ✅ 구현 | `js/theme.js:7` `matchMedia('(prefers-color-scheme: dark)')`, `:15-19` 저장값 없을 때 시스템 설정 사용, `:31-35` 시스템 변경 실시간 반영 (사용자가 직접 고른 값이 있으면 무시) |
| 폼 실제 전송 (Formspree / EmailJS) | ❌ 미구현 | 현재는 검증 통과 시 화면 메시지만 표시. 외부 서비스 키를 공개 저장소에 두는 문제와 미션 핵심 범위 밖이라 의도적으로 제외 (§7) |

---

## 3. 제약 사항 준수 확인

아래 명령은 저장소 루트에서 실행한다. 기대 결과가 "0건"인 항목은 출력이 없어야 한다.

| 제약 | 검증 명령 | 기대 결과 | 상태 |
| --- | --- | --- | --- |
| React/Vue/jQuery/Bootstrap/Tailwind 등 외부 라이브러리 미사용 | `grep -rniE "react|vue|jquery|bootstrap|tailwind|cdn\.jsdelivr|unpkg|cdnjs" index.html css/ js/` | 0건 | ✅ |
| 외부 리소스는 Google Fonts만 | `grep -n "https://" index.html` | `fonts.googleapis.com`, `fonts.gstatic.com`, `github.com/newids` 링크만 | ✅ |
| `var` 미사용 | `grep -rnw "var" js/` | 0건 (CSS의 `var(--…)`는 함수이므로 무관) | ✅ |
| HTML `onclick` 등 인라인 이벤트 미사용 | `grep -rniE "on(click|submit|input|scroll|change|load)=" index.html js/` | 0건 | ✅ |
| 인라인 `style="…"` 미사용 — HTML | `grep -n 'style="' index.html` | 0건 | ✅ |
| 인라인 `style="…"` — JS 생성 마크업 (예외 명시) | `grep -n 'style="' js/*.js` | **5건** — `js/github.js:68-71` 스켈레톤 막대의 `height/width`, `:93` 언어 점의 `--lang-color` 커스텀 속성 | ⚠️ 아래 설명 |
| 모든 `img`에 `alt` | `grep -n "<img" index.html \| grep -v "alt="` | 0건 | ✅ |
| `label for` ↔ `input id` 매칭 | `grep -n 'for="\|id="contact' index.html` | `for` 3개가 각각 `id` 3개와 1:1 대응 | ✅ |
| 최신 Chrome 정상 동작 | 로컬 Chrome에서 §6 QA 수행 | 콘솔 에러 0건 | ✅ |

**인라인 style 예외에 대한 설명.** 미션의 "인라인 스타일 금지"는 HTML 마크업에 프레젠테이션을 섞지 말라는 취지로, `index.html`에는 인라인 style이 전혀 없다. JS가 동적으로 생성하는 마크업 두 곳은 데이터에 따라 값이 달라지는 경우다.

- 스켈레톤 막대 폭(`width: 40%` 등)은 순전히 시각적 변형이므로 엄격하게 보면 클래스로 바꿀 수 있다. 예: `.skeleton-w40 { width: 40% }` 4개 클래스를 `css/style.css`에 추가하고 `js/github.js:68-71`의 `style` 속성을 `class="skeleton skeleton-w40"`으로 교체하면 0건이 된다.
- 언어 점 색상(`--lang-color`)은 API 응답의 언어에 따라 달라지는 **데이터 기반 값**이라 CSS 커스텀 속성으로 넘기는 것이 표준적인 방식이다(색 자체는 `css/style.css:964` `.lang-dot { background-color: var(--lang-color, …) }`에 있다). 평가자가 엄격 기준을 적용한다면 `data-lang="TypeScript"` 속성 + `.lang-dot[data-lang="TypeScript"]` 선택자로 바꿀 수 있다.

---

## 4. "이벤트 → 상태 변경 → 화면 업데이트" 흐름 증빙

### 4.1 다크 모드

```
click(#themeToggle) → data-theme 속성 + localStorage['portfolio-theme'] → applyTheme() → [data-theme='dark'] 토큰이 전체 화면 색 교체
```

`js/theme.js:9-29`

```js
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

- **상태**는 `html[data-theme]` 속성 하나. JS는 색을 직접 바꾸지 않고 상태만 바꾼다.
- **렌더링**은 CSS가 담당: `css/style.css:61-85` `[data-theme='dark'] { --color-bg: #15181f; … }`가 토큰을 재정의하면 토큰을 참조하는 모든 규칙이 한 번에 바뀐다. 아이콘 전환도 `css:382-388`에서 같은 속성을 기준으로 한다.
- **지속성**: `readInitialTheme()`(`:15-19`)가 저장값 → 시스템 설정 순으로 초기 상태를 결정한다.

### 4.2 GitHub API (로딩 / 성공 / 에러 / 빈)

```
loadRepos() 또는 click(#retryBtn) → state.status/repos/errorMessage → render() → #projectsStatus·#projectsGrid·#filterBar·#projectsCount 교체
```

`js/github.js:27-38, 160-166, 184-205`

```js
const state = { status: 'idle', repos: [], filter: FILTER_ALL, errorMessage: '' };

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

async function loadRepos() {
  setState({ status: 'loading', errorMessage: '' });
  try {
    const response = await fetch(GITHUB_API_URL);
    if (!response.ok) throw new Error(describeHttpError(response.status));
    const data = await response.json();
    setState({ status: 'success', repos: data.filter(({ fork }) => !fork) });
  } catch (error) {
    setState({ status: 'error', errorMessage: /* 네트워크/HTTP 구분 문구 */ });
  }
}
```

- 모든 화면 변경은 `setState()` 한 경로로만 일어나며, `render()`는 현재 `state`만 보고 전체를 다시 그린다 (React의 `setState → re-render`와 동일한 구조).
- `empty`는 별도 status가 아니라 `renderSuccess()` 안에서 `getVisibleRepos().length === 0`일 때 `renderEmpty()`로 분기한다 (`:145-149`). 필터 결과 0건과 저장소 0건을 같은 화면으로 처리하기 위한 설계다.
- 재시도 버튼은 `renderError()`가 마크업을 생성한 직후 `addEventListener('click', loadRepos)`를 연결한다 (`:129`).

### 4.3 폼 유효성

```
input(각 필드) / submit(#contactForm) → formState.errors{…}, formState.isSubmitted → renderForm() → .is-invalid 클래스 + #contact*Error 텍스트 + #formSuccess
```

`js/contactForm.js:25-47, 51-58`

```js
const formState = { errors: { name: '', email: '', message: '' }, isSubmitted: false };

const setFormState = (patch) => { Object.assign(formState, patch); renderForm(); };

const renderField = ({ name, input, error }) => {
  const message = formState.errors[name];
  input.closest('.form-field').classList.toggle('is-invalid', message !== '');
  input.setAttribute('aria-invalid', String(message !== ''));
  error.textContent = message;
};

fields.forEach(({ name, input }) => {
  input.addEventListener('input', () => {
    setFormState({ errors: { ...formState.errors, [name]: validators[name](input.value) }, isSubmitted: false });
  });
});
```

- `input` 이벤트는 해당 필드 하나만 재검증하고(스프레드로 나머지 유지), `submit`은 세 필드를 모두 검증해 `errors` 객체를 통째로 교체한다 (`:63`).
- 에러 표시/숨김은 `renderField()`가 `errors[name]`이 빈 문자열인지로만 판단한다 — 메시지가 곧 상태다.

### 4.4 언어 필터 (보너스)

```
click(.filter-btn) → state.filter → render() → renderFilters()(활성 버튼) + renderSuccess()(getVisibleRepos() 재계산)
```

`js/github.js:55-57, 170-174, 145-157`

```js
const getVisibleRepos = () =>
  state.repos.filter(({ language }) => state.filter === FILTER_ALL || language === state.filter);

filterBar.addEventListener('click', ({ target }) => {
  const button = target.closest('[data-filter]');
  if (!button) return;
  setState({ filter: button.dataset.filter });
});

const renderSuccess = () => {
  const visibleRepos = getVisibleRepos();
  if (visibleRepos.length === 0) { renderEmpty(); return; }
  const shownRepos = visibleRepos.slice(0, MAX_VISIBLE_REPOS);
  projectsGrid.innerHTML = shownRepos.map(createRepoCard).join('');
  projectsCount.textContent = `${filterLabel} 저장소 ${visibleRepos.length}개 중 ${shownRepos.length}개 표시`;
};
```

- 필터 버튼은 `#filterBar`에 **이벤트 위임** 하나로 처리한다 — 버튼이 API 응답 이후 동적으로 생기기 때문이다.
- 원본 `state.repos`는 절대 변경하지 않고, 파생 값(`getVisibleRepos()`)을 렌더 시점마다 다시 계산한다 (상태에 계산 결과를 저장하지 않는 원칙).

---

## 5. 과제 목표 6개 — 구술 답변 초안

**Q1. HTML에서 시맨틱 태그를 왜 사용하는지, 어떤 기준으로 구조를 설계했는지.**
시맨틱 태그는 브라우저·검색엔진·보조기기에 "이 영역이 무엇인지"를 알려준다. `div`만 쓰면 시각적으로는 같아도 스크린리더는 랜드마크를 찾지 못하고, 검색엔진은 본문과 내비게이션을 구분하지 못한다. 이 페이지는 페이지 전체를 `header`(내비게이션) / `main`(콘텐츠) / `footer`(저작권·링크) 세 랜드마크로 나누고, `main` 안에서 독립적으로 이동 가능한 주제 단위마다 `section`을 두었으며 각 `section`은 `aria-labelledby`로 자기 제목(`h2`)과 연결했다. 카드처럼 그 자체로 완결된 콘텐츠(기술 카드, 저장소 카드)는 `article`을 썼다. 경력은 시간 순서가 의미 있으므로 `ul`이 아니라 `ol`로, 사실/값 쌍(경력 30년 등)은 `dl/dt/dd`로 마크업했다. 폼은 `label for`로 입력과 연결하고 에러 문구에 `aria-live`를 주어 상태 변화가 낭독되도록 했다.

**Q2. Flexbox와 Grid의 차이, 언제 각각을 선택하는지.**
Flexbox는 1차원(한 줄 또는 한 열) 정렬 도구이고 Grid는 2차원(행과 열을 동시에) 배치 도구다. 내비게이션은 "로고를 왼쪽, 메뉴를 오른쪽에 한 줄로" 놓는 1차원 문제라 `.navbar { display:flex; justify-content:space-between }`을 썼다. 프로젝트 카드는 개수가 API 응답에 따라 달라지고 화면 너비에 따라 열 수가 바뀌어야 하는 2차원 문제라 `grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr))`로 미디어 쿼리 없이 자동 줄바꿈되게 했다. `min(100%, 280px)`은 280px보다 좁은 화면에서 가로 스크롤이 생기는 것을 막는다. Skills 섹션처럼 특정 카드가 2열을 차지해야 하는 비정형 레이아웃도 `grid-column: span 2`로 Grid가 적합하다. 반대로 태그 목록이나 버튼 묶음처럼 "흐르면서 줄바꿈"되면 되는 것은 `flex-wrap`으로 충분하다.

**Q3. querySelector로 DOM을 선택하고 addEventListener로 이벤트를 연결하는 흐름.**
스크립트는 `defer`로 연결되어 HTML 파싱이 끝난 뒤 실행되므로 최상단에서 바로 요소를 찾을 수 있다. 하나인 요소는 `getElementById`, 여러 개는 `querySelectorAll`(`.nav-link`, `[data-reveal]`)로 잡고, `forEach`로 각각에 리스너를 단다. HTML에는 `onclick` 같은 속성이 하나도 없어 구조와 동작이 분리되어 있다. API 응답 이후에 생기는 필터 버튼처럼 "아직 없는 요소"는 부모(`#filterBar`)에 리스너를 하나 달고 `event.target.closest('[data-filter]')`로 실제 클릭된 버튼을 찾는 이벤트 위임을 썼다. 스크롤 리스너는 `{ passive: true }`로 등록해 스크롤 성능을 해치지 않게 했다.

**Q4. 화살표 함수, 구조분해 할당, 배열 메서드(map/filter)가 왜 필요하고 어떻게 썼는지.**
화살표 함수는 짧은 콜백을 간결하게 쓰고 자신만의 `this`를 만들지 않아 리스너·`map` 콜백에 적합하다. 구조분해는 GitHub 응답 객체에서 필요한 필드만 뽑고 이름을 바꿔 쓰는 데 유용하다 — `createRepoCard({ name, description, html_url: url, stargazers_count: stars })`처럼 API의 snake_case를 camelCase로 받으면서 함수 본문이 깨끗해진다. `map`은 "저장소 배열 → HTML 문자열 배열" 변환에, `filter`는 fork 제외와 언어 필터에, `forEach`는 부수효과(리스너 등록, 관찰 등록)에 썼다. 원본 배열을 바꾸는 대신 새 배열을 만드는 방식이라 상태(`state.repos`)가 오염되지 않는다.

**Q5. fetch와 async/await로 데이터를 가져오고 로딩/성공/실패를 UI로 표현한 방법.**
`loadRepos()`는 먼저 `status:'loading'`으로 상태를 바꿔 스피너와 스켈레톤을 그린 뒤 `await fetch()`로 응답을 기다린다. `fetch`는 404·403 같은 HTTP 오류에서도 reject하지 않으므로 `response.ok`를 검사해 직접 `throw`한다. `catch`에서는 `TypeError`(네트워크 단절)와 그 외(HTTP 오류)를 구분해 사용자에게 다른 문구를 보여주고, 403은 GitHub 무인증 한도(시간당 60회)라는 점을 안내한다. 성공하면 `status:'success'`와 데이터를 상태에 넣고, 렌더 함수가 결과가 0건이면 빈 상태 화면으로 분기한다. 네 상태 모두 `render()` 한 함수가 `state.status`를 보고 그리기 때문에 화면이 상태와 어긋날 수 없다.

**Q6. 하나의 기능에서 이벤트 → 상태 변경 → DOM 업데이트가 어떻게 연결되는지 (React의 기초).**
이 프로젝트의 모든 동적 기능은 같은 뼈대를 따른다: 이벤트 리스너는 DOM을 직접 만지지 않고 `setState(patch)`(또는 `setFormState`, `applyTheme`)만 호출하고, `setState`는 상태를 갱신한 뒤 `render()`를 부르며, `render()`는 현재 상태만 보고 필요한 DOM을 다시 만든다. 예를 들어 언어 필터를 누르면 `state.filter`만 바뀌고, 카드 목록은 `getVisibleRepos()`가 렌더 시점에 다시 계산한다. React는 이 패턴을 `useState`(상태 + setter)와 컴포넌트 함수(= `render()`)로 추상화하고, 우리가 `innerHTML`로 통째로 다시 그리는 부분을 가상 DOM 비교로 최소 변경만 반영해 준다. 즉 React를 쓰면 `render()`를 직접 호출하거나 어느 요소를 갱신할지 고민할 필요가 없어지지만, "이벤트는 상태만 바꾸고 화면은 상태에서 파생된다"는 원칙은 그대로다.

---

## 6. 수동 QA 시나리오

로컬(Live Server 또는 `python3 -m http.server 8765`)과 배포 URL 양쪽에서 수행한다. 브라우저는 최신 Chrome, DevTools 디바이스 모드 사용.

| ID | 시나리오 | 절차 | 기대 결과 |
| --- | --- | --- | --- |
| QA-01 | 320px 반응형 | 디바이스 모드 너비 320 | 가로 스크롤 없음, 햄버거 버튼 표시, 카드 1열, Hero 제목 줄바꿈 정상 |
| QA-02 | 375px 반응형 | 너비 375 | 위와 동일, Hero 사실 3개가 3열 유지 |
| QA-03 | 768px 반응형 | 너비 768 | 햄버거 사라지고 가로 메뉴 표시, About 사진·본문 가로 배치, Skills 2열, 폼 좌우 2단 |
| QA-04 | 1024px 반응형 | 너비 1024 | Hero 좌 8/우 4 그리드, 사실이 세로 리스트로, Skills 4열(Blockchain 2칸·Leadership 4칸), 프로젝트 3열 |
| QA-05 | 1440px 반응형 | 너비 1440 | 콘텐츠 최대 1120px 중앙 정렬, 여백 균형 |
| QA-06 | 햄버거 열기 | ≤767px에서 `#navToggle` 클릭 | 메뉴 패널 펼침, 버튼 X 모양, `aria-expanded="true"` |
| QA-07 | 햄버거 닫기 | 다시 클릭 | 패널 접힘, `aria-expanded="false"` |
| QA-08 | 링크 클릭 시 닫힘 | 메뉴에서 About 클릭 | 부드럽게 About으로 이동하며 메뉴 자동 닫힘 |
| QA-09 | Esc로 닫기 | 메뉴 연 상태에서 Esc | 메뉴 닫히고 포커스가 햄버거 버튼으로 복귀 |
| QA-10 | 다크 모드 토글 | `#themeToggle` 클릭 | 전체 배경·텍스트·카드 색 전환, 아이콘이 달→해, `html[data-theme="dark"]` |
| QA-11 | 다크 모드 유지 | 다크 상태에서 새로고침 | 다크 유지. DevTools → Application → Local Storage에 `portfolio-theme: dark` |
| QA-12 | 시스템 다크 감지 | Local Storage 키 삭제 → DevTools Rendering → `prefers-color-scheme: dark` 에뮬레이션 → 새로고침 | 시스템 설정을 따라 다크로 시작. 이후 토글하면 저장값이 우선 |
| QA-13 | 내비게이션 배경 변경 | 60px 이상 스크롤 | 헤더가 투명 → surface 색 + 하단 테두리 + 그림자 (`.is-scrolled`) |
| QA-14 | 맨 위로 버튼 | 300px 이상 스크롤 → 버튼 클릭 | 우하단 버튼 나타남 → 부드럽게 최상단, 버튼 사라짐 |
| QA-15 | 부드러운 스크롤 + 헤더 오프셋 | nav 링크 클릭 | 애니메이션 이동, 섹션 제목이 고정 헤더에 가려지지 않음 |
| QA-16 | 스크롤 애니메이션 | 새로고침 후 천천히 스크롤 | 각 섹션 요소가 20% 보일 때 아래에서 페이드인, 한 번만 실행 |
| QA-17 | API 로딩 상태 | Network → Slow 3G 또는 Offline→Online 직후 새로고침 | 스피너 + "불러오는 중…" + 스켈레톤 카드 3개 |
| QA-18 | API 성공 상태 | 기본 로드 | 카드 최대 9개, 필터 버튼(전체 + 언어들), "전체 저장소 N개 중 9개 표시" |
| QA-19 | API 빈 상태 | 저장소가 1개뿐인 언어 필터를 고른 뒤 `js/github.js`의 `MAX_VISIBLE_REPOS`와 무관하게, 응답에 없는 언어를 `state.filter`로 강제(`콘솔: setState({filter:'COBOL'})`) — 또는 `GITHUB_USERNAME`을 공개 저장소가 없는 계정으로 변경 | "표시할 프로젝트가 없습니다." + 안내 문구, 카드 없음 |
| QA-20 | API 에러 상태 (404) | `GITHUB_USERNAME`을 `newids-does-not-exist`로 변경 후 새로고침 | 대시 테두리 패널 + "프로젝트를 불러올 수 없습니다." + 사용자 없음 문구 + 다시 시도 버튼 |
| QA-21 | API 에러 상태 (네트워크) | Network → Offline → 새로고침 | 같은 패널, "네트워크에 연결할 수 없습니다" 문구 |
| QA-22 | API 에러 상태 (403) | DevTools Network → 요청 우클릭 → Override content로 상태 403 지정 (또는 1시간 내 60회 초과) | "요청 한도(시간당 60회)" 문구 + 재시도 버튼 |
| QA-23 | 재시도 | 에러 상태에서 Online 복구 → 다시 시도 클릭 | 로딩 → 성공으로 복구 |
| QA-24 | 언어 필터 | TypeScript 버튼 클릭 | 해당 언어 카드만, 버튼 활성(검정 배경, `aria-pressed="true"`), 카운트 문구 갱신 |
| QA-25 | 폼 빈값 제출 | 아무것도 입력하지 않고 보내기 | 3개 필드 아래 에러 문구, 테두리 빨강, 첫 필드로 포커스, 페이지 새로고침 없음 |
| QA-26 | 이메일 형식 | 이메일에 `abc` 입력 | 입력 중 즉시 "올바른 이메일 형식이 아닙니다." |
| QA-27 | 실시간 에러 해제 | 에러 상태 필드에 올바른 값 입력 | 에러 문구·빨간 테두리 즉시 사라짐 |
| QA-28 | 폼 성공 | 세 필드 유효 입력 후 보내기 | 초록 성공 문구, 필드 모두 초기화 |
| QA-29 | 키보드 접근성 | Tab으로 순회 | 첫 Tab에 "본문으로 건너뛰기" skip link 노출, 모든 버튼·링크·입력에 주황 `focus-visible` 링 |
| QA-30 | prefers-reduced-motion | DevTools Rendering → `prefers-reduced-motion: reduce` | 스크롤 애니메이션·타이핑·스피너 애니메이션 없이 즉시 표시, 역할 문구는 `·`로 연결된 정적 텍스트 |
| QA-31 | 타이핑 효과 | 기본 로드 | Hero의 역할 문구가 5개 순환 타이핑, 커서 깜빡임 |
| QA-32 | 콘솔 에러 | 전 시나리오 수행 중 Console 탭 | 에러 0건 (API 실패 시 `console.error` 1건은 의도된 로그) |

---

## 7. 알려진 제한과 개선 여지

| 항목 | 현재 상태 | 개선 방향 |
| --- | --- | --- |
| 폼 실제 전송 | 검증 후 화면 메시지만 표시, 어디에도 전송되지 않음 | Formspree 엔드포인트로 `fetch(POST)` 추가. 공개 저장소에 키가 노출되므로 Formspree처럼 공개 가능한 form ID 방식만 고려 |
| GitHub API 레이트 리밋 | 무인증 호출, 시간당 60회. 같은 네트워크(공유 IP)에서 여러 사람이 열면 더 빨리 소진 | 응답을 `sessionStorage`에 캐시해 새로고침 시 재요청 줄이기, 또는 빌드 시점에 JSON 스냅샷을 생성해 정적 배포 |
| 표시 개수 제한 | 필터당 최대 9개, 나머지는 카운트 문구로만 안내 | "더 보기" 버튼으로 `MAX_VISIBLE_REPOS`를 늘리는 상태 추가 |
| 스크린샷 해상도 | 배포 URL에서 1064px 창 / 390px 프레임으로 촬영 | 제출 규격이 1440·375를 요구하면 DevTools 디바이스 모드로 재촬영 |
| LinkedIn 등 추가 소셜 링크 | 이력서에 없어 GitHub·이메일만 | 필요 시 `index.html` footer `ul.footer-links`에 항목 추가 |
| JS 생성 마크업의 인라인 style 5건 | §3 참조 | 클래스/`data-*` 속성으로 치환 가능 |
| 이미지 최적화 | `profile.jpg` 640px JPEG 단일 소스 | AVIF/WebP + `picture` 폴백 |
| 자동화 테스트 | 수동 QA만 존재 | Playwright로 QA-01~32 자동화, 스크린샷 회귀 |

---

## 8. 제출 전 최종 체크리스트

- [x] GitHub 저장소 생성 후 `main` 브랜치 푸시 — `.gitignore`로 `.serena/`·이력서 PDF 제외 (2026-09-04)
- [x] Settings → Pages → `main` / `/ (root)` 배포 — https://newids.github.io/codyssey-b1-1/
- [x] 배포 URL에서 핵심 확인 완료 (2026-09-04): Google Fonts 로딩, GitHub API 성공(저장소 31개, 필터 생성), 다크 모드 토글, 모바일 레이아웃, 콘솔 에러 0건
- [ ] 배포 URL에서 §6 QA-01~32 전체 재실행 (나머지 항목)
- [x] README.md에 배포 URL·저장소 URL 기입
- [x] 스크린샷 4종(데스크톱 / 모바일 / 다크 모드 / Projects) — 배포 URL에서 촬영해 README 표에 첨부
- [ ] 이 문서 §1.1 링크 표의 `[입력]` 채우기
- [ ] `grep` 검증 명령(§3) 전부 재실행해 0건 확인
- [ ] 공개 페이지에 전화번호·생년월일 등 개인정보가 없는지 최종 확인 (`grep -n "010-\|1966" index.html`)
- [ ] `js/github.js` `GITHUB_USERNAME`이 본인 계정(`newids`)인지 확인
- [ ] 제출: 저장소 URL, 배포 URL, 스크린샷

---

관련 문서: [README.md](../README.md) · [docs/GUIDE.md](GUIDE.md) · [Mission-B1-1.md](../Mission-B1-1.md)
