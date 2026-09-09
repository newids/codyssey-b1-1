# 과제 목표 6개 — 상세 답변과 소스 근거

Mission-B1-1.md §3 "과제 목표"의 여섯 항목을, 이 저장소의 실제 코드를 인용하며 원리부터 설명하는 학습·구술 대비 문서. 모든 인용은 `파일:행` 형식이며 코드 발췌는 원문 그대로다(작성 시점 기준 행 번호).

## 목차

1. [Q1. 시맨틱 태그를 왜 쓰는지, 구조를 어떤 기준으로 설계했는지](#q1-시맨틱-태그를-왜-쓰는지-구조를-어떤-기준으로-설계했는지)
2. [Q2. Flexbox와 Grid의 차이, 언제 무엇을 선택하는지](#q2-flexbox와-grid의-차이-언제-무엇을-선택하는지)
3. [Q3. querySelector로 DOM을 선택하고 addEventListener로 이벤트를 연결하는 흐름](#q3-queryselector로-dom을-선택하고-addeventlistener로-이벤트를-연결하는-흐름)
4. [Q4. 화살표 함수·구조분해·배열 메서드가 왜 필요하고 어떻게 썼는지](#q4-화살표-함수구조분해배열-메서드가-왜-필요하고-어떻게-썼는지)
5. [Q5. fetch와 async/await로 데이터를 가져오고 로딩/성공/실패를 UI로 표현한 방법](#q5-fetch와-asyncawait로-데이터를-가져오고-로딩성공실패를-ui로-표현한-방법)
6. [Q6. 이벤트 → 상태 변경 → DOM 업데이트가 어떻게 연결되는지 (React의 기초)](#q6-이벤트--상태-변경--dom-업데이트가-어떻게-연결되는지-react의-기초)
7. [부록: 여섯 답변을 관통하는 원칙](#부록-여섯-답변을-관통하는-원칙)

---

## Q1. 시맨틱 태그를 왜 쓰는지, 구조를 어떤 기준으로 설계했는지

### 한 줄 답변

시맨틱 태그는 "이 영역이 무엇인지"를 브라우저·보조기기·검색엔진에 기계가 읽을 수 있는 형태로 알려준다. 이 페이지는 `header / main / footer` 세 랜드마크 아래에 "독립적으로 이동할 수 있는 주제"마다 `section`을 두고 각 섹션을 자기 제목과 `aria-labelledby`로 연결했으며, 자체 완결 콘텐츠는 `article`, 순서가 의미 있는 목록은 `ol`, 이름–값 쌍은 `dl`, 폼은 `label for`로 입력과 묶었다.

### 개념 설명

**접근성 트리(accessibility tree).** 브라우저는 DOM과 별개로 보조기기에 넘겨줄 접근성 트리를 만든다. `header`, `nav`, `main`, `footer`, `section[aria-labelledby]`, `form`은 이 트리에서 *랜드마크(landmark)* 역할을 얻는다. 스크린리더 사용자는 랜드마크 목록을 열어 "내비게이션 → 본문 → 문의하기"처럼 페이지 구조를 건너뛰며 탐색한다. `div`는 역할이 없어서 이 목록에 나타나지 않는다. 시각적으로는 같은 화면이라도 접근성 트리에서는 "구조 없는 텍스트 덩어리"와 "이름 붙은 영역 여섯 개"만큼 차이가 난다.

**이름 없는 랜드마크 문제.** `section`은 접근 가능한 이름이 있을 때만 `region` 랜드마크로 취급된다. 그래서 `section`마다 `aria-labelledby`로 자기 `h2`를 가리키게 하면 "About — 문제를 코드로 풀어온 사람" 같은 이름으로 목록에 오른다. `nav`처럼 페이지에 하나뿐인 랜드마크에도 `aria-label`을 주면 여러 내비게이션이 있는 사이트로 확장될 때 구분이 된다.

**검색엔진과 기계 가독성.** 크롤러는 `main` 안의 내용을 본문으로, `nav`를 내비게이션으로, `header/footer`를 보일러플레이트로 가중치를 달리 본다. 제목 계층(`h1` 하나, 섹션마다 `h2`, 카드 안에 `h3`)은 문서의 개요(outline)를 만든다.

**기본 동작과 기본 스타일.** 시맨틱 요소는 동작을 공짜로 준다. `button`은 Enter/Space로 눌리고 탭 순서에 들어가며, `a[href]`는 키보드 포커스와 새 탭 열기를 지원하고, `label[for]`를 클릭하면 연결된 입력에 포커스가 간다. `div`에 `onclick`을 달아 버튼을 흉내 내면 이 모든 걸 다시 구현해야 한다. 반대로 `ul/ol/dl`의 기본 마진·불릿은 CSS로 지우면 그만이다.

**설계 기준.** 이 페이지의 태그 선택 기준은 다음 네 가지였다.

| 판단 질문 | 예 → 선택 | 이 페이지에서의 예 |
| --- | --- | --- |
| 페이지 전체에서 하나뿐인 큰 영역인가 | `header` / `main` / `footer` | 상단 내비게이션 / 콘텐츠 전체 / 저작권 |
| 독립된 주제라 목차에 오를 만한가 | `section` + `aria-labelledby` | Hero, About, Experience, Skills, Projects, Contact |
| 떼어내도 그 자체로 완결되는가 | `article` | Skills 카드, GitHub 저장소 카드 |
| 항목 사이 순서가 의미 있는가 | `ol` (아니면 `ul`) | 경력 타임라인은 `ol`, 태그 목록은 `ul` |
| 이름–값 쌍인가 | `dl / dt / dd` | 경력 30년, 학력, 현재 |
| 이미지에 설명이 붙는가 | `figure / figcaption` | 프로필 일러스트 |

### 이 프로젝트에서의 적용 — 소스 인용

**세 개의 최상위 랜드마크와 skip link.** `index.html:17-20`

```html
  <a href="#main" class="skip-link">본문으로 건너뛰기</a>

  <header class="site-header" id="siteHeader">
    <nav class="navbar" aria-label="주요 내비게이션">
```

`index.html:49`, `index.html:302`

```html
  <main id="main">
```

```html
  <footer class="site-footer">
```

키보드 사용자는 페이지에 들어와 첫 Tab을 누르면 "본문으로 건너뛰기" 링크가 나타나고, 이를 누르면 `#main`으로 바로 이동한다. 내비게이션 링크 다섯 개와 버튼 두 개를 매번 지나칠 필요가 없다. `nav`에 `aria-label="주요 내비게이션"`을 준 것은 랜드마크 목록에서 "navigation"이 아니라 "주요 내비게이션 navigation"으로 읽히게 하기 위해서다. skip link는 평소 화면 밖에 있다가 포커스될 때만 내려온다(`css/style.css:177-190`).

**섹션과 제목의 연결.** `index.html:94`, `index.html:102`

```html
    <section id="about" class="section about" aria-labelledby="aboutTitle">
```

```html
          <h2 class="section-title" id="aboutTitle" data-reveal>문제를 코드로 풀어온 사람</h2>
```

여섯 섹션(`#hero`:50, `#about`:94, `#experience`:132, `#skills`:184, `#projects`:239, `#contact`:256)이 모두 같은 패턴이다. `section`의 `id`는 앵커 링크(`href="#about"`)의 목적지이고, `aria-labelledby`는 접근성 트리의 이름이다. 두 역할을 한 요소가 맡는다. 제목 요소에 붙은 `data-reveal`은 스크롤 애니메이션용 표식으로, 시맨틱과 무관한 프레젠테이션 훅을 `data-*` 속성으로 분리한 예다.

**본문 안의 제목 계층.** `index.html:54-56`

```html
          <h1 class="hero-title" id="heroTitle" data-reveal>
            대기업 인트라넷에서 <br />블록체인 지갑까지, <br />30년째 만들고 있습니다.
          </h1>
```

`h1`은 페이지에 하나(Hero), 섹션 제목은 `h2`, 카드 제목과 타임라인 항목은 `h3`다(`index.html:141`, `192`, `js/github.js:89`). 제목 크기를 위해 레벨을 고르지 않고, 문서 개요를 위해 레벨을 고른 뒤 크기는 CSS(`.section-title`, `.timeline-role`)로 맞췄다.

**이름–값 쌍은 `dl`.** `index.html:74-79`

```html
        <dl class="hero-facts" data-reveal>
          <div class="fact">
            <dt>경력</dt>
            <dd><strong>30</strong><span class="fact-unit">년</span></dd>
            <dd class="fact-note">1996년 대기업 입사 이후</dd>
          </div>
```

"경력 → 30년, 1996년 이후"는 용어와 정의의 관계다. `dl` 안에서 `dt` 하나에 `dd`가 여럿 붙을 수 있고, HTML 표준은 `dt/dd` 묶음을 `div`로 감싸는 것을 허용한다(스타일링 단위가 필요해서 감쌌다). 화면에서는 숫자가 위, 라벨이 아래로 보이지만 마크업 순서는 `dt → dd`이며 시각 순서는 CSS `order`로 바꿨다(`css/style.css:563-569`, 1024px 이상에서는 `:1388-1390`에서 원래 순서로 복귀). 즉 읽는 순서(DOM)는 항상 "경력, 30년"이다.

**순서가 의미 있는 목록은 `ol`.** `index.html:137-144`

```html
        <ol class="timeline">
          <li class="timeline-item" data-reveal>
            <span class="timeline-period">2021 — 2023</span>
            <div class="timeline-body">
              <h3 class="timeline-role">블록체인 스타트업 <span class="timeline-title">CTO</span></h3>
              <p>암호화폐 지갑 · 리워드 플랫폼 · NFT 갤러리 시스템 구축</p>
            </div>
          </li>
```

경력은 최신순으로 정렬된 시간 축이다. `ul`로 마크업하면 "순서 없는 여섯 항목"이 되고, `ol`이면 스크린리더가 "6개 항목 중 1번째"처럼 위치를 읽어준다. 번호 자체는 CSS `list-style: none`(`css/style.css:151-154`)으로 숨겼다 — 의미는 남기고 표현만 뺀 것이다.

**자체 완결 콘텐츠는 `article`.** `index.html:190-194`

```html
          <article class="skill-card skill-card-featured" data-reveal>
            <header class="skill-card-header">
              <h3>Blockchain</h3>
              <span class="skill-card-since">2018 —</span>
            </header>
```

카드 하나를 떼어 다른 페이지에 붙여도 "Blockchain — Ethereum, Solidity…"라는 완결된 정보다. `article` 안에는 자기만의 `header`를 둘 수 있다(문서 헤더와 다른 요소). JS가 만드는 저장소 카드도 같은 이유로 `article`이다(`js/github.js:81`).

**이미지와 캡션.** `index.html:96-99`

```html
        <figure class="about-photo" data-reveal>
          <img src="images/profile.jpg" alt="JS Choi 캐릭터 일러스트 — 도시 전망을 배경으로 파란 후드를 입고 웃는 모습" width="320" height="400" loading="lazy" />
          <figcaption class="about-photo-caption">JS CHOI</figcaption>
        </figure>
```

`alt`는 "프로필 사진"이라는 분류가 아니라 장면을 설명한다 — 이미지를 볼 수 없는 사용자가 같은 정보를 얻게 하는 것이 목적이다. `width/height`를 명시하면 브라우저가 이미지 로드 전에 자리를 확보해 레이아웃 이동(CLS)이 없고, `loading="lazy"`는 첫 화면 밖 이미지를 늦게 받는다. `figcaption`은 시각적 장식 문구("JS CHOI")를 이미지와 묶어 준다.

**폼: `label for`, `novalidate`, `aria-live`.** `index.html:273-278`

```html
        <form id="contactForm" class="contact-form" novalidate data-reveal>
          <div class="form-field">
            <label for="contactName">이름</label>
            <input type="text" id="contactName" name="name" autocomplete="name" placeholder="홍길동" />
            <p class="error-message" id="contactNameError" aria-live="polite"></p>
          </div>
```

`label[for]`와 `input[id]`가 같은 값이면 라벨 클릭 시 입력창에 포커스가 가고, 스크린리더는 입력창에 진입할 때 "이름, 편집창"이라고 읽는다. `placeholder`는 라벨을 대신할 수 없다 — 입력을 시작하면 사라지기 때문이다. `novalidate`는 브라우저 기본 검증 UI를 끄고 JS가 검증을 맡게 하는 선언이다(Q5·Q6에서 상태 흐름으로 설명). 에러 문구 `p`에 `aria-live="polite"`를 주면 문구가 바뀔 때 스크린리더가 현재 낭독을 끝낸 뒤 알려준다. 성공 메시지(`index.html:296`)와 API 상태 영역(`index.html:250`)도 같은 방식이다.

```html
        <div class="projects-status" id="projectsStatus" role="status" aria-live="polite"></div>
```

**버튼의 상태를 속성으로.** `index.html:32`

```html
        <button class="nav-toggle" id="navToggle" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="navMenu">
```

햄버거 버튼은 아이콘뿐이라 `aria-label`로 이름을 주고, `aria-expanded`로 열림/닫힘을, `aria-controls`로 어느 요소를 제어하는지 알린다. 이 속성들은 JS가 상태에 맞춰 갱신한다(`js/nav.js:8-13`). `type="button"`이 없으면 폼 안의 버튼은 기본이 submit이라는 점도 기억할 것.

### 흔한 오해와 대안 비교

| 대안 | 무엇이 문제인가 |
| --- | --- |
| 모든 영역을 `div.section`으로 | 랜드마크 0개. 스크린리더는 처음부터 끝까지 순서대로만 읽어야 하고, 검색엔진은 본문과 내비게이션을 구분 못 함 |
| `div`에 `onclick`으로 버튼 흉내 | 탭 순서에 안 들어가고 Enter/Space가 안 먹음. `role="button"`, `tabindex="0"`, 키 핸들러를 전부 추가해야 원래 `button`과 같아짐 |
| 제목을 크기 기준으로 선택(`h4`가 `h2`보다 커 보이니까) | 문서 개요가 뒤섞임. 크기는 CSS의 일, 레벨은 구조의 일 |
| `placeholder`만 있고 `label` 없음 | 입력 시작 후 필드 이름이 사라짐. 스크린리더는 이름 없는 편집창으로 읽음 |
| `section`에 제목 없음 | 이름 없는 `section`은 랜드마크가 아님. 사실상 `div`와 같음 |
| 경력 목록을 `ul`로 | "순서 있음"이라는 정보가 사라짐. 시각적으로 번호를 감출 거면 `ol` + `list-style: none` |

### 예상 추가 질문과 답

- **Q. `section`과 `article`의 차이는?** — `article`은 독립 배포 가능한 단위(카드, 글 한 편), `section`은 문서 안의 주제 묶음. 카드 안에 다시 `section`이 올 수도 있고, 반대도 가능하다. 판단은 "떼어내도 의미가 남는가"다.
- **Q. `aria-*`를 많이 쓰면 접근성이 좋아지나?** — 아니다. 첫 번째 규칙은 "가능하면 네이티브 요소를 쓰고 ARIA는 쓰지 말 것"이다. 이 페이지의 ARIA는 네이티브로 표현할 수 없는 것(섹션 이름, 확장 상태, 라이브 영역)에만 쓰였다.
- **Q. `data-reveal` 같은 `data-*` 속성은 시맨틱을 해치지 않나?** — `data-*`는 스크립트용 사설 데이터로 표준이 정한 자리다. 접근성 트리나 검색에 영향이 없다. 클래스에 `js-` 접두어를 쓰는 관습과 목적이 같다.
- **Q. 왜 `hero`는 `h1`을 쓰고 나머지는 `h2`인가?** — 페이지 주제("30년째 만들고 있습니다")가 하나이고 나머지는 그 하위 주제이기 때문. `h1`이 여럿이면 어느 것이 페이지 제목인지 모호해진다.

---

## Q2. Flexbox와 Grid의 차이, 언제 무엇을 선택하는지

### 한 줄 답변

Flexbox는 한 축(행 또는 열)을 따라 항목을 흘리고 정렬하는 1차원 도구, Grid는 행과 열을 동시에 정의해 항목을 셀에 놓는 2차원 도구다. 이 페이지는 "한 줄에 좌우 배치"(내비게이션, 카드 헤더, 태그 목록)에 Flex를, "개수와 화면 폭에 따라 열 수가 바뀌는 격자"(프로젝트 카드, 스킬 카드, Hero 8:4 분할)에 Grid를 썼다.

### 개념 설명

**1차원 vs 2차원.** Flex 컨테이너는 주축(main axis) 하나를 정하고 항목을 그 축을 따라 배치한다. `flex-wrap`으로 줄바꿈이 되어도 각 줄은 독립적이다 — 둘째 줄의 항목이 첫째 줄의 항목과 열을 맞추지 않는다. Grid는 먼저 트랙(행·열)을 정의하고 항목을 셀에 배치하므로 모든 행의 열이 정렬된다. "마지막 줄에 항목이 하나 남았을 때" Flex는 그 항목이 늘어나거나(`flex-grow`) 왼쪽에 붙고, Grid는 정확히 한 칸을 차지한다.

**콘텐츠 주도 vs 레이아웃 주도.** Flex는 항목의 크기가 배치를 결정한다(콘텐츠가 주도). 버튼 두 개, 태그 다섯 개처럼 "내용물의 크기가 각각 다르고 그냥 흘러가면 되는" 것에 맞는다. Grid는 컨테이너가 먼저 격자를 정하고 내용물이 거기 맞춘다(레이아웃이 주도). 카드처럼 "모든 항목이 같은 폭이어야 하는" 것에 맞는다.

**`repeat(auto-fit, minmax(A, 1fr))`.** "폭 A 이상인 열을 들어갈 수 있는 만큼 만들고, 남는 공간은 1fr로 균등 분배"라는 뜻이다. 컨테이너가 900px이고 A가 280px이면 3열, 600px이면 2열, 300px이면 1열 — 미디어 쿼리 없이 반응한다. `auto-fill`은 항목이 부족해도 빈 트랙을 남기고, `auto-fit`은 빈 트랙을 0으로 접어 있는 항목이 공간을 채운다. 카드 2개만 있을 때 `auto-fit`이면 두 카드가 절반씩, `auto-fill`이면 3열 자리에 두 개만 놓이고 셋째 자리는 빈다.

**`min(100%, 280px)`.** `minmax(280px, 1fr)`는 컨테이너가 280px보다 좁아지면 트랙 최소 폭이 컨테이너를 넘어 가로 스크롤이 생긴다. `min(100%, 280px)`는 "280px 또는 컨테이너 폭 중 작은 값"이므로 320px 화면(패딩 빼면 약 280px 이하)에서도 넘치지 않는다.

**`grid-column: span N`.** Grid에서만 가능한 "이 항목은 두 칸을 차지"라는 선언. Flex로 같은 효과를 내려면 `flex-basis`를 계산해 넣어야 하고 열 정렬이 보장되지 않는다.

**모바일 퍼스트.** 기본 규칙은 가장 좁은 화면(1열, 세로 스택)을 위한 것이고, `@media (min-width: 768px)`, `(min-width: 1024px)`에서 규칙을 *추가*한다. 큰 화면부터 짜고 `max-width`로 취소하는 방식보다 규칙 수가 적고, 기본 상태가 가장 단순해서 디버깅이 쉽다.

### 이 프로젝트에서의 적용 — 소스 인용

**내비게이션 — Flex, 로고 왼쪽·메뉴 오른쪽.** `css/style.css:320-328`

```css
.navbar {
  height: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--container-pad);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

`.navbar`의 자식은 로고(`a.logo`), 컨트롤 묶음(`div.nav-controls`), 메뉴(`ul.nav-menu`) 셋이다. 모바일에서는 메뉴가 `position: fixed`로 흐름에서 빠지므로 남는 두 자식이 `space-between`으로 양 끝에 붙는다. 한 줄에 좌우로 놓는 문제 — 전형적인 1차원 문제라 Flex가 정확하다.

**같은 메뉴가 768px에서 Flex 행으로 바뀐다.** 모바일 기본값 `css/style.css:424-438`

```css
.nav-menu {
  position: fixed;
  top: var(--nav-height);
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: var(--space-2) var(--container-pad) var(--space-6);
  background-color: var(--color-bg);
  border-bottom: 1.5px solid var(--color-text);
  transform: translateY(-8px);
  opacity: 0;
  visibility: hidden;
  transition: transform var(--transition-base), opacity var(--transition-base), visibility 0s linear var(--transition-base);
}
```

768px 이상 `css/style.css:1238-1260`

```css
  .nav-toggle {
    display: none;
  }

  .nav-controls {
    order: 3;
  }

  .nav-menu {
    position: static;
    flex-direction: row;
    align-items: center;
    gap: var(--space-8);
    padding: 0;
    margin-left: auto;
    margin-right: var(--space-6);
    background: transparent;
    border: none;
    transform: none;
    opacity: 1;
    visibility: visible;
    transition: none;
  }
```

같은 `ul`이 모바일에서는 세로 패널(`flex-direction: column`), 데스크톱에서는 가로 메뉴(`row`)다. 데스크톱에서 `margin-left: auto`는 Flex 항목의 auto 마진이 남는 공간을 모두 흡수하는 성질을 이용해 메뉴를 오른쪽으로 밀어내고, `.nav-controls { order: 3 }`은 DOM 순서(로고 → 컨트롤 → 메뉴)를 바꾸지 않은 채 시각 순서만 로고 → 메뉴 → 컨트롤로 바꾼다. 모바일에서 메뉴를 `display: none`이 아니라 `opacity + visibility + transform`으로 숨긴 이유는 열림/닫힘에 전환 애니메이션을 주기 위해서다(`display`는 애니메이션이 안 된다). `visibility 0s linear var(--transition-base)`는 사라질 때 페이드가 끝난 뒤 `hidden`이 되게 하는 지연이다.

**프로젝트 카드 — Grid `auto-fit` + `minmax`.** `css/style.css:904-908`

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--space-5);
}
```

카드 수는 API 응답과 필터에 따라 0~9개로 변하고, 열 수는 화면 폭에 따라 1~3열로 변한다. 이 한 줄이 두 변수를 모두 처리한다. 미디어 쿼리에 `.projects-grid` 규칙이 하나도 없는 것을 확인할 수 있다 — `css/style.css:1233-1425`의 두 브레이크포인트 블록 어디에도 없다. 마지막 행에 카드가 하나만 남아도 다른 행과 열이 맞는다.

**스킬 카드 — 고정 열 수 + `span`으로 비정형 배치.** 모바일 `css/style.css:715-719`

```css
.skills-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}
```

768px `css/style.css:1314-1321`

```css
  .skills-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .skill-card-featured,
  .skill-card-wide {
    grid-column: span 2;
  }
```

1024px `css/style.css:1396-1409`

```css
  .skills-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .skill-card-featured {
    grid-column: span 2;
  }

  .skill-card-wide {
    grid-column: span 4;
    flex-direction: row;
    align-items: center;
    gap: var(--space-8);
  }
```

여기서는 `auto-fit`이 아니라 열 수를 명시했다. "Blockchain 카드는 두 칸, Leadership 카드는 한 줄 전체"라는 편집 의도가 있어서 열 수를 알고 있어야 `span`이 의미를 갖기 때문이다. `minmax(0, 1fr)`은 `1fr`만 쓸 때 긴 단어가 트랙을 늘려버리는 것을 막는 관용구다(`1fr`의 최소값은 `auto`, 즉 콘텐츠 최소 폭). 흥미로운 점: `.skill-card-wide`는 Grid 셀 안에서 자기 내부는 Flex(`flex-direction: row`)로 헤더와 태그를 가로 배치한다. 바깥은 Grid, 안쪽은 Flex — 두 도구는 경쟁이 아니라 중첩해서 쓴다.

**Hero — 1024px에서 8:4 분할.** 모바일 `css/style.css:486-490`

```css
.hero-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
}
```

1024px `css/style.css:1358-1372`

```css
  .hero-inner {
    display: grid;
    grid-template-columns: 8fr 4fr;
    gap: var(--space-10);
    align-items: end;
  }

  .hero-facts {
    grid-template-columns: 1fr;
    gap: 0;
    padding-top: 0;
    border-top: none;
    border-left: 1.5px solid var(--color-text);
    padding-left: var(--space-8);
  }
```

모바일에서는 세로로 쌓기만 하면 되니 Flex column이 가장 단순하다. 데스크톱에서는 "왼쪽 8, 오른쪽 4"라는 비율 분할이 필요해 Grid로 바꿨다. `align-items: end`는 두 칸의 아래선을 맞춘다. 같은 요소가 브레이크포인트에 따라 `display` 자체를 바꾸는 것은 흔한 패턴이다. 안쪽 `.hero-facts`는 모바일에서 3열 Grid(`css/style.css:549-555`)였다가 데스크톱에서 1열(세로 리스트)이 되고, 구분선이 위쪽(`border-top`)에서 왼쪽(`border-left`)으로 옮겨진다.

**흘러가면 되는 것들은 `flex-wrap`.** `css/style.css:776-780`

```css
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
```

태그 알약은 글자 수에 따라 폭이 제각각이고, 줄이 바뀌어도 열을 맞출 필요가 없다. 이런 것에 Grid를 쓰면 오히려 모든 태그가 같은 폭으로 늘어나 어색해진다. 필터 버튼(`css/style.css:799-805`)과 Hero의 CTA 버튼(`css/style.css:542-547`)도 같은 이유로 `flex-wrap`이다.

**Contact — 768px에서 5:7 Grid.** `css/style.css:1329-1334`

```css
  .contact-inner {
    display: grid;
    grid-template-columns: 5fr 7fr;
    gap: var(--space-10);
    align-items: start;
  }
```

모바일 기본은 Flex column(`css/style.css:1017-1021`). 소개 글과 폼을 나란히 놓되 폼이 조금 더 넓어야 해서 `5fr 7fr`이다. `align-items: start`는 왼쪽 소개 글이 짧아도 위쪽에 붙어 있게 한다(기본값 `stretch`면 늘어남).

**타임라인 항목 — 768px에서 2열 Grid.** `css/style.css:1303-1308`

```css
  .timeline-item {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: var(--space-8);
    padding-block: var(--space-6);
  }
```

기간(고정 180px)과 내용(나머지)의 2열. 항목마다 같은 폭으로 기간 칸이 정렬되어야 세로 정렬선이 생긴다 — Flex였다면 기간 텍스트 길이에 따라 내용 칸 시작점이 흔들렸을 것이다(`flex-basis: 180px`로 흉내 낼 수는 있지만 Grid가 의도를 더 직접 표현한다).

### 흔한 오해와 대안 비교

| 대안 | 무엇이 문제인가 |
| --- | --- |
| 카드 그리드를 `display: flex; flex-wrap: wrap`으로 | 마지막 행에 카드 1~2개가 남으면 `flex-grow`로 늘어나 거대해지거나, 늘어나지 않으면 왼쪽에 몰림. 행 간 열 정렬이 보장되지 않음. `width: calc(33.333% - gap)` 같은 계산이 필요 |
| 내비게이션을 Grid로 | 가능은 하지만 "양 끝 정렬"을 위해 `grid-template-columns: auto 1fr auto` 같은 선언이 필요. Flex `space-between` 한 줄이 의도를 더 잘 드러냄 |
| `minmax(280px, 1fr)` (min() 없이) | 320px 화면에서 트랙이 컨테이너보다 넓어져 가로 스크롤 발생 |
| `repeat(auto-fill, …)` | 카드가 적을 때 빈 트랙이 남아 카드가 왼쪽에 작게 몰림. 이 페이지처럼 "있는 만큼 채우기"엔 `auto-fit` |
| 데스크톱 퍼스트(`max-width` 미디어 쿼리) | 모바일에서 데스크톱 규칙을 하나하나 취소해야 함. 규칙이 늘고 기본 상태가 복잡해짐 |
| `float`로 열 배치 | clearfix, 높이 붕괴, 순서 제약. Flex/Grid 이전 시대의 우회책 |

### 예상 추가 질문과 답

- **Q. Grid만 쓰면 안 되나?** — 태그처럼 크기가 제각각이고 정렬이 필요 없는 것은 Flex가 더 적은 선언으로 끝난다. Grid는 트랙을 정의해야 하므로 "어차피 흘러가면 되는" 경우엔 과하다.
- **Q. `gap`은 Flex에서도 되나?** — 된다. 이 페이지의 모든 Flex/Grid 컨테이너는 마진 대신 `gap`을 쓴다. 마지막 항목의 마진을 지우는 `:last-child` 규칙이 필요 없어진다.
- **Q. `fr`과 `%`의 차이는?** — `%`는 컨테이너 폭에 대한 비율이라 `gap`을 빼고 계산해야 한다. `fr`은 gap을 뺀 *남는 공간*을 나누므로 `8fr 4fr`에 `gap`을 더해도 넘치지 않는다.
- **Q. 브레이크포인트를 768/1024로 정한 근거는?** — 미션이 지정한 값이다. 실무에서는 콘텐츠가 깨지는 지점에 브레이크포인트를 두는 것이 원칙이며, 이 페이지는 `clamp()`와 `auto-fit`으로 브레이크포인트 사이에서도 유동적으로 변한다.
- **Q. `order`를 쓰면 접근성 문제가 있지 않나?** — 시각 순서와 DOM(탭) 순서가 어긋나면 키보드 사용자가 혼란스러울 수 있다. 여기서는 `.nav-controls`(테마 버튼)를 맨 끝으로 보내는 정도라 탭 순서(로고 → 테마 버튼 → 메뉴)와 시각 순서(로고 → 메뉴 → 테마 버튼)의 차이가 작다고 판단했다. 큰 재배치에는 쓰지 않는 것이 맞다.

---

## Q3. querySelector로 DOM을 선택하고 addEventListener로 이벤트를 연결하는 흐름

### 한 줄 답변

스크립트를 `defer`로 연결하면 HTML 파싱이 끝난 뒤 순서대로 실행되므로 파일 최상단에서 요소를 바로 찾을 수 있다. 하나뿐인 요소는 `getElementById`, 여러 개는 `querySelectorAll` + `forEach`로 잡아 `addEventListener`로 리스너를 붙였고, 나중에 생기는 요소(필터 버튼)는 부모에 리스너 하나를 달아 `closest()`로 찾는 이벤트 위임을 썼다. HTML에는 `onclick` 속성이 없다.

### 개념 설명

**파싱과 실행 타이밍.** 브라우저는 HTML을 위에서 아래로 파싱하다가 `<script>`를 만나면 기본적으로 파싱을 멈추고 스크립트를 내려받아 실행한다. `<head>`에 둔 스크립트가 `document.getElementById('navToggle')`를 호출하면 아직 그 요소가 파싱되지 않아 `null`이다. 해결책은 셋이다.

| 방식 | 다운로드 | 실행 시점 | 순서 보장 |
| --- | --- | --- | --- |
| 기본 (`<script src>`) | 파싱 중단 | 즉시 | 문서 순서 |
| `async` | 파싱과 병렬 | 다운로드 끝나는 즉시(파싱 중단) | 보장 안 됨 |
| `defer` | 파싱과 병렬 | 파싱 완료 후, `DOMContentLoaded` 직전 | 문서 순서 |

`defer`는 "DOM이 완성된 뒤, 적힌 순서대로"를 보장한다. 그래서 `DOMContentLoaded` 리스너로 감쌀 필요가 없고, 파일 간 의존(예: `github.js`가 `render`를 정의한 뒤 `loadRepos()` 호출)도 순서대로 풀린다.

**선택 API.** `getElementById`는 `id`로 요소 하나를 O(1)에 가깝게 찾고, `querySelector`는 CSS 선택자로 첫 요소를, `querySelectorAll`은 모든 요소를 *정적 NodeList*로 돌려준다. 정적이므로 나중에 DOM이 바뀌어도 목록이 변하지 않고, `forEach`를 바로 쓸 수 있다. 반면 `getElementsByClassName`은 *살아 있는 HTMLCollection*을 돌려줘서 순회 중 DOM을 바꾸면 결과가 흔들리고 `forEach`가 없다.

**이벤트 버블링과 위임.** 클릭은 실제 클릭된 요소(`event.target`)에서 시작해 부모로 올라가며(버블링) 각 조상에 붙은 리스너를 실행한다. 이를 이용하면 부모 하나에 리스너를 달고 `target.closest(selector)`로 "어느 자식이 눌렸는지" 알아낼 수 있다. 자식이 나중에 생기거나 `innerHTML`로 통째로 교체되어도 부모의 리스너는 살아 있다.

**`{ passive: true }`.** `scroll`이나 `touchmove` 리스너는 `preventDefault()`로 스크롤을 막을 수 있으므로 브라우저는 리스너 실행이 끝날 때까지 스크롤을 지연시킨다. `passive: true`는 "이 리스너는 preventDefault를 부르지 않는다"는 약속이라 브라우저가 스크롤을 먼저 처리한다.

**구조와 동작의 분리.** `onclick="…"` 속성은 HTML에 JS를 섞는다. 함수 이름이 전역에 있어야 하고, 리스너를 하나만 달 수 있으며, CSP(Content-Security-Policy)에서 인라인 스크립트로 취급되어 차단될 수 있다. `addEventListener`는 여러 리스너, `once`/`passive` 옵션, `removeEventListener`를 지원한다.

### 이 프로젝트에서의 적용 — 소스 인용

**모든 스크립트가 `defer`, 문서 끝에 순서대로.** `index.html:322-328`

```html
  <script defer src="js/theme.js"></script>
  <script defer src="js/nav.js"></script>
  <script defer src="js/scrollTop.js"></script>
  <script defer src="js/reveal.js"></script>
  <script defer src="js/typing.js"></script>
  <script defer src="js/github.js"></script>
  <script defer src="js/contactForm.js"></script>
```

일곱 파일 모두 `defer`라 파싱을 막지 않고, 실행은 이 순서다. `theme.js`가 가장 먼저 실행되어 저장된 테마를 적용하므로 라이트→다크로 깜빡이는 시간이 최소화된다. 각 파일은 최상단에서 요소를 즉시 찾는다.

**단일 요소는 `getElementById`, 복수는 `querySelectorAll`.** `js/nav.js:3-6`

```js
const siteHeader = document.getElementById('siteHeader');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
```

`id`가 있고 하나뿐인 요소는 `getElementById`가 의도를 가장 명확히 드러낸다. `.nav-link`는 다섯 개라 `querySelectorAll`로 NodeList를 받는다. 이 상수들은 파일 최상단에 한 번만 조회해 두고 리스너 안에서 재사용한다 — 리스너마다 다시 `querySelector`를 부르지 않는다.

**리스너 등록과 상태 동기화 함수 분리.** `js/nav.js:8-22`

```js
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
```

클릭 리스너는 `classList.toggle('is-open')`의 반환값(토글 후 클래스가 있으면 `true`)으로 새 상태를 알아낸 뒤 `setMenuOpen`에 넘긴다. `setMenuOpen`은 메뉴 클래스, 버튼 클래스, `aria-expanded`, `aria-label` 네 가지를 항상 함께 바꾼다. 여는 곳(버튼)과 닫는 곳(링크 클릭, Esc)이 여럿이어도 한 함수를 거치므로 네 속성이 어긋날 수 없다. `navLinks.forEach`는 NodeList가 `forEach`를 지원하기 때문에 가능하다.

**키보드 이벤트와 구조분해.** `js/nav.js:24-29`

```js
document.addEventListener('keydown', ({ key }) => {
  if (key === 'Escape' && navMenu.classList.contains('is-open')) {
    setMenuOpen(false);
    navToggle.focus();
  }
});
```

`keydown`은 `document`에 달았다 — 포커스가 어디에 있든 Esc를 잡기 위해서다. 이벤트 객체에서 `key`만 구조분해로 꺼냈다(Q4). 메뉴를 닫은 뒤 `navToggle.focus()`로 포커스를 버튼에 되돌리는 것은 키보드 사용자가 "지금 어디에 있는지"를 잃지 않게 하는 관례다.

**스크롤 리스너는 passive, 초기 상태도 즉시 계산.** `js/nav.js:31-36`

```js
const updateHeaderStyle = () => {
  siteHeader.classList.toggle('is-scrolled', window.scrollY >= NAV_SCROLL_THRESHOLD);
};

window.addEventListener('scroll', updateHeaderStyle, { passive: true });
updateHeaderStyle();
```

리스너 본문은 `classList.toggle` 한 줄이다 — 스크롤마다 실행되므로 가볍게 유지한다. 두 번째 인수 `force`(`window.scrollY >= 60`)를 넘기면 조건에 따라 추가/제거가 결정되어 `if/else`가 필요 없다. 마지막 줄 `updateHeaderStyle()`은 페이지가 스크롤된 상태로 새로고침될 때(브라우저가 스크롤 위치를 복원함)도 헤더가 올바른 모습으로 시작하게 한다. `js/scrollTop.js:5-10`도 같은 구조다.

```js
const updateScrollTopVisibility = () => {
  scrollTopBtn.classList.toggle('is-visible', window.scrollY >= SCROLL_TOP_THRESHOLD);
};

window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });
updateScrollTopVisibility();
```

**IntersectionObserver — 스크롤 리스너 없이 "보이는가"를 관찰.** `js/reveal.js:1-16`

```js
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
```

"요소가 20% 이상 보이면 클래스를 붙인다"를 스크롤 리스너로 짜면 매 스크롤마다 39개 요소의 `getBoundingClientRect()`를 계산해야 한다. `IntersectionObserver`는 브라우저가 레이아웃 계산 시점에 교차 여부를 알려주므로 비용이 거의 없다. 한 번 보인 요소는 `unobserve`로 관찰을 끝내 다시 사라져도 애니메이션이 반복되지 않는다. `data-reveal` 속성 선택자(`[data-reveal]`)로 "애니메이션 대상"을 HTML에서 선언적으로 표시했다.

**이벤트 위임 — 아직 없는 버튼에 리스너 달기.** `js/github.js:170-174`

```js
filterBar.addEventListener('click', ({ target }) => {
  const button = target.closest('[data-filter]');
  if (!button) return;
  setState({ filter: button.dataset.filter });
});
```

필터 버튼은 API 응답이 온 뒤 `renderFilters()`가 `innerHTML`로 만든다(`js/github.js:103-110`). 그리고 상태가 바뀔 때마다 통째로 다시 만들어진다. 버튼마다 리스너를 달면 렌더링할 때마다 다시 달아야 한다. 대신 항상 존재하는 부모 `#filterBar`에 리스너 하나를 두고, 클릭된 요소에서 `closest('[data-filter]')`로 가장 가까운 필터 버튼을 찾는다. 버튼 밖(빈 공간)을 클릭하면 `null`이라 그냥 반환한다. 어느 필터인지는 `data-filter` 속성(`button.dataset.filter`)에서 읽는다 — HTML 속성이 데이터를 나른다.

**동적으로 만든 요소에 리스너를 다시 붙이는 경우.** `js/github.js:118-130`

```js
const renderError = () => {
  projectsStatus.innerHTML = `
    <div class="status-panel status-error">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
      <h3>프로젝트를 불러올 수 없습니다.</h3>
      <p>${escapeHtml(state.errorMessage)}</p>
      <button type="button" class="btn btn-outline retry-btn" id="retryBtn">다시 시도</button>
    </div>
  `;
  projectsGrid.innerHTML = '';
  projectsCount.textContent = '';
  document.getElementById('retryBtn').addEventListener('click', loadRepos);
};
```

재시도 버튼은 위임 대신 직접 등록했다. 에러 상태에서만 존재하는 요소 하나라 위임의 이점이 작고, 마크업을 만든 직후 같은 함수 안에서 등록하면 "버튼은 있는데 리스너가 없는" 순간이 없다. `innerHTML`로 교체된 이전 버튼의 리스너는 요소와 함께 사라지므로 누수도 없다. `loadRepos`는 이 시점(파일 184행)보다 뒤에 선언된 `function`이지만 함수 선언은 호이스팅되므로 참조할 수 있다.

**폼 이벤트: `input`과 `submit`.** `js/contactForm.js:51-52`, `:60-61`

```js
fields.forEach(({ name, input }) => {
  input.addEventListener('input', () => {
```

```js
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
```

`input` 이벤트는 키 입력마다(붙여넣기 포함) 발생해 실시간 검증에 맞고, `change`는 포커스가 나갈 때만 발생한다. `submit`은 버튼 클릭이 아니라 `form`에서 잡는다 — Enter 키로 제출해도 같은 경로를 타기 때문이다. `event.preventDefault()`는 브라우저의 기본 동작(페이지 새로고침·GET 요청)을 막는다. 미션이 요구한 네 이벤트(`click`, `submit`, `scroll`, `input`)가 각각 어디에 있는지는 이 절과 §2.4가 보여준다.

**HTML에 `onclick`이 없다는 증거.** `index.html`의 모든 버튼은 `id` 또는 클래스만 갖는다(`:27`, `:32`, `:294`, `:318`). 동작은 전부 JS 파일에서 `addEventListener`로 연결된다.

### 흔한 오해와 대안 비교

| 대안 | 무엇이 문제인가 |
| --- | --- |
| `<head>`에 `defer` 없는 스크립트 | 요소를 찾으면 `null` → `Cannot read properties of null`. `DOMContentLoaded`로 감싸면 되지만 `defer`가 더 단순 |
| `async` | 일곱 파일의 실행 순서가 보장되지 않아 `theme.js`보다 `github.js`가 먼저 돌 수 있음 |
| `onclick="toggleMenu()"` | 전역 함수 필요, 리스너 1개 제한, CSP 위반 가능, 구조와 동작 결합 |
| 필터 버튼마다 `addEventListener` | 렌더링할 때마다 재등록 필요. 빠뜨리면 버튼이 안 눌림 |
| 스크롤 리스너에서 `getBoundingClientRect()`로 노출 판정 | 스크롤마다 레이아웃 계산 유발. `IntersectionObserver`가 정답 |
| `getElementsByClassName` + `for` 루프 | 살아 있는 컬렉션이라 순회 중 DOM 변경 시 결과가 흔들림. `forEach` 없음 |
| 스크롤 리스너에 `passive` 없음 | 브라우저가 리스너 완료까지 스크롤을 지연 |

### 예상 추가 질문과 답

- **Q. `querySelector`와 `getElementById` 중 무엇을 써야 하나?** — `id`가 있으면 `getElementById`가 빠르고 의도가 분명하다. 선택자가 필요하거나(속성, 자식 관계) 여러 개를 잡을 땐 `querySelector(All)`.
- **Q. 리스너 안에서 `this`를 안 쓰는 이유는?** — 화살표 함수를 쓰기 때문에 `this`가 요소를 가리키지 않는다. 대신 클로저로 잡은 상수(`navMenu`)나 `event.target`을 쓴다(Q4).
- **Q. `removeEventListener`는 왜 없나?** — 이 페이지의 요소들은 페이지 수명 내내 존재하므로 해제할 필요가 없다. 동적 요소(재시도 버튼)는 `innerHTML` 교체와 함께 GC된다.
- **Q. `keydown`을 `document`에 달면 입력창에서 Esc를 눌러도 메뉴가 닫히나?** — 그렇다. 조건이 "메뉴가 열려 있을 때"뿐이라 입력 중 Esc는 메뉴가 닫혀 있으면 아무 일도 하지 않는다.
- **Q. `classList.toggle`의 두 번째 인수는 무엇인가?** — `force`. `true`면 무조건 추가, `false`면 무조건 제거. 조건식을 넘기면 `if/else` 없이 상태를 반영할 수 있다.

---

## Q4. 화살표 함수·구조분해·배열 메서드가 왜 필요하고 어떻게 썼는지

### 한 줄 답변

화살표 함수는 짧은 콜백을 간결하게 쓰고 자기만의 `this`를 만들지 않아 리스너와 `map` 콜백에 맞다. 구조분해는 GitHub 응답처럼 큰 객체에서 필요한 필드만 꺼내고 이름까지 바꿔 받게 해 준다. `map`은 "배열 → 새 배열" 변환(저장소 → HTML 카드), `filter`는 조건 선별(fork 제외, 언어 필터), `forEach`는 반환값 없는 부수효과(리스너 등록)에 썼고, 셋 다 원본 배열을 바꾸지 않는다.

### 개념 설명

**화살표 함수.** `function` 키워드 함수는 호출 방식에 따라 `this`가 정해진다(메서드 호출이면 객체, 리스너면 요소, 그냥 호출이면 `undefined`/`window`). 화살표 함수는 `this`, `arguments`, `new.target`을 갖지 않고 바깥 스코프의 것을 그대로 쓴다. 콜백 안에서 "바깥의 `this`가 뭐였지?"를 고민할 필요가 없어진다. 본문이 표현식 하나면 `{}`와 `return`을 생략할 수 있어 `(x) => x * 2` 같은 한 줄 콜백이 자연스럽다. 단, 생성자로 쓸 수 없고 프로토타입 메서드에는 적합하지 않다.

**구조분해 할당.** 객체나 배열의 일부를 변수로 바로 꺼내는 문법이다.

| 형태 | 예 | 의미 |
| --- | --- | --- |
| 객체 | `const { name } = repo` | `repo.name`을 `name`에 |
| 이름 변경 | `const { html_url: url } = repo` | `repo.html_url`을 `url`에 |
| 기본값 | `const { language = '—' } = repo` | 없으면 `'—'` |
| 매개변수 | `({ key }) => …` | 인수 객체에서 `key`만 |
| 배열 | `const [first, second] = list` | 위치로 꺼냄 |

함수 매개변수 자리에서 구조분해하면 "이 함수가 인수의 어떤 필드를 쓰는지"가 시그니처에 드러난다.

**배열 메서드의 반환값과 불변성.**

| 메서드 | 반환 | 원본 변경 | 용도 |
| --- | --- | --- | --- |
| `map` | 같은 길이의 새 배열 | 없음 | 변환 |
| `filter` | 조건을 만족하는 새 배열 | 없음 | 선별 |
| `forEach` | `undefined` | 없음(콜백이 바꾸지 않는 한) | 부수효과 |
| `reduce` | 누적값 하나 | 없음 | 집계 |
| `some` / `find` | boolean / 첫 요소 | 없음 | 조건 검사·검색 |

핵심은 "원본을 바꾸지 않고 새 값을 만든다"는 것이다. 상태 객체가 들고 있는 배열을 `map`/`filter`로 가공해도 상태는 그대로이고, 렌더링 때마다 같은 입력에서 같은 결과가 나온다. `push`, `splice`, `sort`(원본 정렬) 같은 변경 메서드와 구분해야 한다.

### 이 프로젝트에서의 적용 — 소스 인용

**매개변수 구조분해 + 이름 변경 — API 응답을 카드로.** `js/github.js:75-78`

```js
const createRepoCard = ({ name, description, html_url: url, language, stargazers_count: stars, updated_at: updatedAt }) => {
  const languageLabel = language ?? '—';
  const languageColor = LANGUAGE_COLORS[language] ?? '';
  const hasDescription = Boolean(description);
```

GitHub 응답 객체는 필드가 90개가 넘는다. 시그니처에서 여섯 개만 꺼내니 이 함수가 무엇에 의존하는지 한눈에 보이고, 본문에서 `repo.stargazers_count`를 반복하지 않아도 된다. API의 snake_case(`html_url`)를 이 코드의 camelCase(`url`)로 바꾸는 것도 구조분해 한 줄로 끝난다. `??`(nullish 병합)는 `language`가 `null`일 때(GitHub는 언어 미감지 저장소에 `null`을 준다) 대체 문자열을 넣는다 — `||`와 달리 빈 문자열이나 `0`은 그대로 둔다.

**`map`으로 변환, `join`으로 합치기.** `js/github.js:152-156`

```js
  const shownRepos = visibleRepos.slice(0, MAX_VISIBLE_REPOS);
  const filterLabel = state.filter === FILTER_ALL ? '전체' : state.filter;

  projectsStatus.innerHTML = '';
  projectsGrid.innerHTML = shownRepos.map(createRepoCard).join('');
```

"저장소 객체 배열 → HTML 문자열 배열 → 하나의 문자열"이 `map(createRepoCard).join('')`이다. `createRepoCard`가 인수 하나(저장소 객체)를 받아 문자열을 돌려주므로 `map`에 함수 참조를 그대로 넘겼다. `.join('')`이 없으면 배열이 문자열로 바뀔 때 쉼표가 끼어든다. `slice`는 원본을 자르지 않고 앞 9개를 복사한다.

**`filter`로 선별 — fork 제외와 언어 필터.** `js/github.js:194-197`

```js
    const data = await response.json();
    const ownRepos = data.filter(({ fork }) => !fork);

    setState({ status: 'success', repos: ownRepos });
```

`js/github.js:55-56`

```js
const getVisibleRepos = () =>
  state.repos.filter(({ language }) => state.filter === FILTER_ALL || language === state.filter);
```

첫 번째는 데이터가 들어올 때 한 번 — 포크한 저장소는 본인 작업이 아니므로 상태에 넣기 전에 걸러낸다. 두 번째는 렌더링할 때마다 — `state.repos`(전체)는 그대로 두고 현재 필터에 맞는 부분집합을 새로 만든다. 필터를 바꿔도 원본이 남아 있으므로 '전체'로 돌아갈 수 있다. 콜백의 `({ fork })`, `({ language })`는 매개변수 구조분해다.

**`map` + `filter(Boolean)` + `Set` + 스프레드 — 언어 목록 추출.** `js/github.js:50-53`

```js
const getLanguages = (repos) => {
  const languages = repos.map(({ language }) => language).filter(Boolean);
  return [...new Set(languages)].sort();
};
```

네 단계 파이프라인이다. `map`으로 언어 이름만 뽑고(`['HTML', null, 'TypeScript', 'HTML', …]`), `filter(Boolean)`으로 `null`을 버리고, `new Set()`으로 중복을 없앤 뒤, 스프레드 `[...]`로 다시 배열로 만들어 `sort()`한다. `Boolean`을 콜백으로 넘기면 각 값을 진릿값으로 변환하므로 `x => x != null`과 같은 효과다. `sort()`는 원본을 정렬하지만 여기서 원본은 방금 만든 임시 배열이라 문제없다.

**`Array.from`으로 개수만큼 생성.** `js/github.js:114`

```js
  projectsGrid.innerHTML = Array.from({ length: SKELETON_COUNT }, createSkeletonCard).join('');
```

"스켈레톤 카드 3개"를 `for` 루프 없이 만든다. `Array.from`의 두 번째 인수는 매핑 함수라 `[undefined, undefined, undefined].map(createSkeletonCard)`와 같다.

**스프레드로 기존 객체를 복사하며 한 필드만 교체.** `js/contactForm.js:51-58`

```js
fields.forEach(({ name, input }) => {
  input.addEventListener('input', () => {
    setFormState({
      errors: { ...formState.errors, [name]: validators[name](input.value) },
      isSubmitted: false,
    });
  });
});
```

`{ ...formState.errors, [name]: … }`는 기존 에러 객체를 얕게 복사한 뒤 현재 필드(`[name]` 계산된 속성명)만 새 값으로 덮는다. `formState.errors.name = …`처럼 직접 대입하지 않는 이유는 "상태는 교체하지, 수정하지 않는다"는 원칙 때문이다(Q6). `fields.forEach`는 세 필드 각각에 리스너를 다는 부수효과라 반환값이 필요 없어 `forEach`다. `validators[name]`은 객체를 함수 테이블로 써서 `if (name === 'email') …` 분기를 없앤 것이다.

**`Object.fromEntries` + `some` + `find` — 제출 시 일괄 검증.** `js/contactForm.js:63-69`

```js
  const errors = Object.fromEntries(fields.map(({ name, input }) => [name, validators[name](input.value)]));
  const hasError = Object.values(errors).some((message) => message !== '');

  if (hasError) {
    setFormState({ errors, isSubmitted: false });
    const firstInvalid = fields.find(({ name }) => errors[name] !== '');
    firstInvalid.input.focus();
```

`fields.map(…)`으로 `[['name', ''], ['email', '올바른…'], ['message', '']]` 같은 쌍 배열을 만들고 `Object.fromEntries`로 `{ name: '', email: '…', message: '' }` 객체로 바꾼다. `Object.values(errors).some(…)`은 하나라도 비어 있지 않은 메시지가 있으면 `true`. `fields.find(…)`는 첫 번째 오류 필드를 찾아 포커스를 준다. `some`은 조건을 만족하는 요소를 만나면 즉시 멈추고, `find`는 요소 자체를 돌려준다.

**이벤트 객체 구조분해.** `js/nav.js:24`, `js/theme.js:31-35`

```js
document.addEventListener('keydown', ({ key }) => {
```

```js
systemDarkQuery.addEventListener('change', ({ matches }) => {
  const hasSavedPreference = localStorage.getItem(THEME_STORAGE_KEY) !== null;
  if (hasSavedPreference) return;
  applyTheme(matches ? DARK : LIGHT);
});
```

`KeyboardEvent`에서는 `key`만, `MediaQueryListEvent`에서는 `matches`만 필요하다. 매개변수에서 바로 꺼내면 본문에서 `event.key`를 반복하지 않고, 함수가 이벤트의 어떤 정보를 쓰는지 시그니처에 드러난다.

**화살표 함수와 `function` 선언을 구분해 쓴 곳.** `js/github.js:34-37`, `:160-166`, `:184`

```js
const setState = (patch) => {
  Object.assign(state, patch);
  render();
};
```

```js
function render() {
  renderFilters();
```

```js
async function loadRepos() {
```

`setState`(34행)는 `render`(160행)를 호출하는데 `render`는 뒤에 있다. `render`와 `loadRepos`를 `const` 화살표 함수로 쓰면 TDZ(temporal dead zone) 때문에 정의 전 참조가 오류가 나지만, `function` 선언은 호이스팅되어 파일 어디서든 참조할 수 있다. 그래서 "여러 곳에서 호출되는 진입점"은 `function`, 나머지는 `const` 화살표로 통일했다. 이는 `this`가 아니라 호이스팅 때문에 내린 선택이다.

**`textContent`와 `innerHTML`의 구분, 그리고 이스케이프.** `js/github.js:41-46`

```js
const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
```

템플릿 리터럴로 HTML을 만들어 `innerHTML`에 넣을 때 외부 데이터(저장소 이름·설명)는 반드시 이스케이프한다. 설명에 `<img onerror=…>`가 들어 있으면 그대로 실행되기 때문이다(XSS). `replaceAll` 체인은 문자열을 바꾸지 않고 새 문자열을 돌려주는 메서드 체이닝의 예다. 반면 순수 텍스트만 넣는 곳(`projectsCount`, 에러 메시지 `p`)은 `textContent`를 써서 이스케이프가 필요 없다(`js/github.js:157`, `js/contactForm.js:41`).

### 흔한 오해와 대안 비교

| 대안 | 무엇이 문제인가 |
| --- | --- |
| `forEach` 안에서 `result.push(...)`로 새 배열 만들기 | `map`이 정확히 그 일을 한다. `forEach`+`push`는 의도가 흐려지고 외부 배열을 변경함 |
| `for` 루프로 필터링 | 동작은 같지만 "무엇을 남기는가"가 조건문 안에 묻힘. `filter(pred)`는 조건이 곧 이름 |
| `function` 콜백 안에서 `this` 사용 | 리스너에서는 요소, `map` 콜백에서는 `undefined`. 화살표는 이 문제를 없앰 |
| `repo.html_url`, `repo.stargazers_count`를 본문에서 반복 | 읽기 어렵고 오타 위험. 구조분해로 한 번에 이름 붙이기 |
| `arr.sort()`를 상태 배열에 직접 | 원본이 정렬되어 다른 곳의 순서 가정이 깨짐. 복사본(`[...arr].sort()`)에 |
| 언어 목록 중복 제거를 `indexOf`로 | O(n²). `Set`이 O(n)이고 의도가 명확 |
| `innerHTML`에 API 문자열을 그대로 | XSS. `escapeHtml` 또는 `textContent` |
| `var` | 함수 스코프·호이스팅으로 루프 변수가 공유됨. `const` 기본, 재할당 필요할 때만 `let`(`js/typing.js:27`의 `roleIndex`가 유일) |

### 예상 추가 질문과 답

- **Q. 화살표 함수를 쓰면 안 되는 경우는?** — 객체 메서드에서 `this`로 자기 객체를 참조해야 할 때, 생성자, `arguments`가 필요할 때. 이 프로젝트는 그런 경우가 없어 이벤트 핸들러·콜백·유틸리티 전부 화살표다.
- **Q. `??`와 `||`의 차이는?** — `||`는 falsy(`0`, `''`, `false`) 전부 대체하고, `??`는 `null`/`undefined`만 대체한다. `stars`가 `0`일 때 `stars || '—'`는 잘못된 결과를 낸다.
- **Q. `map`을 부수효과용으로 쓰면 안 되나?** — 동작은 하지만 반환 배열을 버리게 되어 의도가 왜곡된다. 반환값이 필요 없으면 `forEach`.
- **Q. 구조분해에서 없는 키를 꺼내면?** — `undefined`가 된다. 오류가 아니므로 기본값(`= '—'`)이나 `??`로 처리한다. 이 코드는 `language ?? '—'`로 처리했다.
- **Q. `Object.assign(state, patch)`는 불변성 원칙에 어긋나지 않나?** — 맞다, 상태 객체 자체는 변경한다. 대신 상태 안의 *배열*은 절대 변경하지 않고(`filter`/`slice`로 파생), 변경 경로는 `setState` 하나로 제한했다. React처럼 상태 객체를 통째로 교체하는 방식이 더 엄격하며, 이 규모에서는 "변경 경로를 한 곳으로"가 실용적 타협이다.

---

## Q5. fetch와 async/await로 데이터를 가져오고 로딩/성공/실패를 UI로 표현한 방법

### 한 줄 답변

`loadRepos()`는 먼저 `status: 'loading'`으로 상태를 바꿔 스피너와 스켈레톤을 그리고, `await fetch()`로 응답을 기다린 뒤 `response.ok`가 아니면 직접 `throw`한다. `catch`에서 `TypeError`(네트워크 단절)와 그 외(HTTP 오류)를 구분해 다른 문구를 만들고 `status: 'error'`로 바꾼다. 성공하면 `status: 'success'`와 데이터를 넣고, 렌더 함수가 결과 0건이면 빈 상태로 분기한다. 네 화면 모두 `render()` 하나가 `state.status`를 보고 그린다.

### 개념 설명

**Promise와 async/await.** `fetch()`는 즉시 Promise를 돌려주고 네트워크 작업은 뒤에서 진행된다. `await`는 그 Promise가 settle될 때까지 *이 함수의 실행만* 멈추고 제어를 이벤트 루프에 돌려준다 — 페이지는 멈추지 않는다. Promise가 fulfilled면 값을 돌려주고, rejected면 그 자리에서 예외를 던져 `catch`로 간다. `.then().catch()` 체인과 동등하지만 순차 코드처럼 읽힌다.

**`fetch`는 HTTP 오류에 reject하지 않는다.** 서버가 404나 403을 돌려줘도 "응답을 받았다"는 점에서 성공이므로 Promise는 fulfilled되고 `response.ok`가 `false`일 뿐이다. `fetch`가 reject하는 경우는 요청 자체가 실패했을 때 — DNS 실패, 오프라인, CORS 차단 — 이고 이때 `TypeError`가 던져진다. 따라서 "HTTP 오류를 `catch`로 보내려면 `!response.ok`일 때 직접 `throw`"해야 한다.

**오류 분류.** `catch`에 들어온 `error`가 `TypeError`면 네트워크 계층 문제, 우리가 `throw new Error(...)`한 것이면 HTTP 계층 문제다. `instanceof`로 구분하면 사용자에게 "인터넷 연결을 확인하세요"와 "요청 한도를 넘었습니다"를 다르게 안내할 수 있다.

**상태 머신 4상태.** UI가 가질 수 있는 상태를 `idle → loading → success | error`로 명시하면 "로딩 중인데 이전 카드가 남아 있음", "에러인데 스피너가 돎" 같은 불일치가 구조적으로 불가능해진다. 빈 상태(`empty`)는 `success`의 부분집합(데이터는 왔지만 0건)이라 별도 status 대신 렌더링에서 분기한다.

**재시도.** 에러 화면의 버튼이 `loadRepos`를 다시 부르면 `loading`부터 같은 경로를 반복한다. 상태 머신이 있으면 재시도가 "처음부터 다시"와 같은 코드다.

**레이트 리밋.** GitHub REST API는 인증 없이 IP당 시간당 60회다. 초과 시 403이 오므로 403을 "권한 없음"이 아니라 "한도 초과"로 안내해야 사용자가 원인을 이해한다.

### 이 프로젝트에서의 적용 — 소스 인용

**상태 정의와 유일한 변경 경로.** `js/github.js:27-37`

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
```

`status`가 `'idle' | 'loading' | 'success' | 'error'` 네 값 중 하나다. `repos`는 성공 시 데이터, `errorMessage`는 실패 시 문구, `filter`는 사용자가 고른 언어. 이 넷이 Projects 섹션이 그릴 수 있는 모든 화면을 결정한다. `setState`는 패치를 병합하고 즉시 `render()`를 부른다 — 상태를 바꾸고 렌더링을 잊는 일이 없다.

**비동기 호출 전체.** `js/github.js:184-207`

```js
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

loadRepos();
```

줄 단위로 읽으면:

1. `setState({ status: 'loading', errorMessage: '' })` — `fetch`를 부르기 *전에* 로딩 화면을 그린다. 이전 에러 메시지도 비운다(재시도 시).
2. `await fetch(GITHUB_API_URL)` — 응답 헤더가 도착할 때까지 이 함수만 대기. 스피너 애니메이션(CSS)은 계속 돈다.
3. `if (!response.ok) throw …` — 403/404/500을 `catch`로 보낸다. 문구는 `describeHttpError`가 상태 코드별로 만든다.
4. `await response.json()` — 본문 파싱도 비동기(스트림). 이것도 실패할 수 있어 `try` 안에 있다.
5. `data.filter(({ fork }) => !fork)` — 상태에 넣기 전 정제.
6. `setState({ status: 'success', repos: ownRepos })` — 성공 화면.
7. `catch` — `TypeError`면 네트워크 문구, 아니면 우리가 던진 `Error`의 `message`. `console.error`로 개발자용 원인을 남기고 사용자용 문구만 상태에 넣는다.
8. 마지막 `loadRepos()` — 파일이 실행되는 즉시(= `defer`로 DOM 준비 후) 첫 호출.

**상태 코드별 문구.** `js/github.js:178-182`

```js
const describeHttpError = (status) => {
  if (status === 403) return 'GitHub API 요청 한도(시간당 60회)를 넘었습니다. 잠시 후 다시 시도해주세요.';
  if (status === 404) return `GitHub 사용자 '${GITHUB_USERNAME}'를 찾을 수 없습니다.`;
  return `서버가 오류를 반환했습니다. (HTTP ${status})`;
};
```

미션이 명시한 403 레이트 리밋 시나리오가 첫 분기다. 404는 `GITHUB_USERNAME`을 잘못 쓴 경우로, 개발 중 가장 흔한 실수를 화면에서 바로 알 수 있게 했다.

**렌더 분기.** `js/github.js:160-166`

```js
function render() {
  renderFilters();

  if (state.status === 'loading') renderLoading();
  else if (state.status === 'error') renderError();
  else if (state.status === 'success') renderSuccess();
}
```

`render`는 인수를 받지 않는다 — 오직 `state`만 본다. 어떤 이벤트가 호출했든 결과가 같다는 뜻이다. `idle`은 아무것도 그리지 않는데, 실제로는 파일 실행 즉시 `loadRepos()`가 `loading`으로 바꾸므로 사용자가 `idle`을 볼 일은 없다.

**로딩 화면 — 스피너 + 스켈레톤.** `js/github.js:112-116`

```js
const renderLoading = () => {
  projectsStatus.innerHTML = '<div class="status-loading"><span class="spinner" aria-hidden="true"></span>GitHub 저장소를 불러오는 중…</div>';
  projectsGrid.innerHTML = Array.from({ length: SKELETON_COUNT }, createSkeletonCard).join('');
  projectsCount.textContent = '';
};
```

`css/style.css:841-854`

```css
.spinner {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-pill);
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  animation: spin 900ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

`css/style.css:988-1003`

```css
.skeleton {
  border-radius: 3px;
  background: linear-gradient(90deg, var(--color-skeleton-a) 0%, var(--color-skeleton-b) 50%, var(--color-skeleton-a) 100%);
  background-size: 800px 100%;
  animation: shimmer 1.4s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }

  100% {
    background-position: 400px 0;
  }
}
```

스피너는 상단 테두리만 강조색인 원을 회전시킨 것이고, 스켈레톤은 카드 모양 자리에 반짝이는 막대를 놓아 "곧 이 자리에 카드가 온다"를 예고한다. 둘 다 JS 타이머가 아니라 CSS `animation`이라 `await` 중에도 메인 스레드와 무관하게 돈다. `aria-hidden="true"`로 스피너 자체는 스크린리더에서 숨기고, 텍스트 "불러오는 중…"이 `#projectsStatus`의 `aria-live="polite"`(`index.html:250`)를 통해 낭독된다. 스켈레톤 카드도 `aria-hidden`이다(`js/github.js:67`).

**에러 화면 — 원인 + 재시도.** (`js/github.js:118-130`, Q3에서 인용) 대시 테두리 패널(`css/style.css:882-884`)에 아이콘, 제목 "프로젝트를 불러올 수 없습니다.", `state.errorMessage`, 재시도 버튼. 메시지는 `escapeHtml`을 거쳐 삽입된다 — `error.message`에 사용자명 같은 외부 문자열이 섞일 수 있어서다.

**빈 화면 — 두 가지 원인.** `js/github.js:132-143`

```js
const renderEmpty = () => {
  const isFiltered = state.filter !== FILTER_ALL;
  projectsStatus.innerHTML = `
    <div class="status-panel status-empty">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M4 7l2-3h12l2 3"/><path d="M10 12h4"/></svg>
      <h3>표시할 프로젝트가 없습니다.</h3>
      <p>${isFiltered ? "다른 언어 필터를 선택하거나 '전체'로 돌아가세요." : '공개 저장소가 아직 없습니다.'}</p>
    </div>
  `;
  projectsGrid.innerHTML = '';
  projectsCount.textContent = '';
};
```

"필터 결과가 0건"과 "저장소가 아예 없음"은 화면은 같지만 다음 행동이 다르다. `state.filter`를 보고 안내 문구를 바꾼다.

**성공 화면과 빈 상태 분기.** `js/github.js:145-158`

```js
const renderSuccess = () => {
  const visibleRepos = getVisibleRepos();
  if (visibleRepos.length === 0) {
    renderEmpty();
    return;
  }

  const shownRepos = visibleRepos.slice(0, MAX_VISIBLE_REPOS);
  const filterLabel = state.filter === FILTER_ALL ? '전체' : state.filter;

  projectsStatus.innerHTML = '';
  projectsGrid.innerHTML = shownRepos.map(createRepoCard).join('');
  projectsCount.textContent = `${filterLabel} 저장소 ${visibleRepos.length}개 중 ${shownRepos.length}개 표시`;
};
```

`empty`가 `status` 값이 아닌 이유가 여기 있다. 데이터는 성공적으로 왔고(`success`), 다만 *현재 필터에서* 보여줄 게 없는 것이다. 필터를 바꾸면 다시 카드가 나타나야 하므로 `repos`는 그대로 두고 렌더링만 분기한다. 세 영역(`projectsStatus`, `projectsGrid`, `projectsCount`)을 매번 모두 설정하는 것도 중요하다 — 이전 상태의 잔재(예: 에러 패널)가 남지 않는다.

**필터 버튼도 상태에서 파생.** `js/github.js:103-110`

```js
const renderFilters = () => {
  if (state.status !== 'success') {
    filterBar.innerHTML = '';
    return;
  }
  const languageButtons = getLanguages(state.repos).map((language) => createFilterButton(language, language));
  filterBar.innerHTML = [createFilterButton('전체', FILTER_ALL), ...languageButtons].join('');
};
```

로딩·에러 중에는 필터 바가 비어 있고, 성공 시에만 응답에 실제로 있는 언어로 버튼이 생긴다. 하드코딩된 언어 목록이 없다.

**첫 페인트 직후 사용자가 보는 순서.** `index.html:249-252`

```html
        <div class="filter-bar" id="filterBar" role="group" aria-label="언어별 필터"></div>
        <div class="projects-status" id="projectsStatus" role="status" aria-live="polite"></div>
        <div class="projects-grid" id="projectsGrid"></div>
        <p class="projects-count" id="projectsCount"></p>
```

HTML에는 빈 컨테이너 네 개만 있다. 파싱 완료 → `github.js` 실행 → `loadRepos()` → `loading` 렌더(스피너·스켈레톤) → 수백 ms 후 응답 → `success` 렌더(필터·카드·카운트). 사용자는 "빈 화면"을 거의 보지 못한다.

### 흔한 오해와 대안 비교

| 대안 | 무엇이 문제인가 |
| --- | --- |
| `!response.ok` 검사 없이 `response.json()` | 403/404 응답 본문(`{"message": "Not Found"}`)이 배열이 아니라 `data.filter`에서 다른 오류로 터짐. 원인 파악이 어려움 |
| `fetch().then(r => r.json()).then(render).catch(...)` 체인 | 동작은 같지만 중간 검사(`ok`)와 로딩 상태 설정이 체인 사이에 끼어 읽기 어려움. `await`는 위에서 아래로 읽힘 |
| 로딩 상태 없이 `fetch` 후 바로 카드 삽입 | 느린 네트워크에서 빈 화면. 사용자는 고장으로 인식 |
| 에러 시 `alert()` | 모달로 흐름 차단, 재시도 경로 없음, 스타일링 불가 |
| 모든 오류를 "오류가 발생했습니다"로 | 403(기다리면 됨)과 오프라인(연결 확인)과 404(설정 오류)의 대처가 다름 |
| `empty`를 별도 status로 | 필터 변경 시 `success`로 되돌리는 로직이 필요해짐. "데이터 있음 + 필터 결과 0"을 렌더 분기로 처리하는 게 단순 |
| `try` 밖에서 `response.json()` | JSON 파싱 실패(잘린 응답)가 잡히지 않음 |
| 재시도 버튼이 `location.reload()` | 페이지 전체 재로드. 스크롤 위치·필터 상태 손실 |

### 예상 추가 질문과 답

- **Q. `await`가 페이지를 멈추지 않는다는 걸 어떻게 아나?** — `await` 중에도 스피너 CSS 애니메이션이 돌고 다크 모드 버튼이 눌린다. `await`는 이 `async` 함수의 나머지를 마이크로태스크로 미룰 뿐이다.
- **Q. 사용자가 재시도를 연타하면?** — 요청이 여러 개 날아가고 마지막 응답이 이긴다. 이 규모에선 문제가 없지만, 실무에서는 `AbortController`로 이전 요청을 취소하거나 `loading` 중엔 버튼을 비활성화한다.
- **Q. 응답을 캐시하지 않는 이유는?** — 미션 범위 밖이고 데이터가 작다. 레이트 리밋이 걱정되면 `sessionStorage`에 응답과 시각을 저장해 재사용할 수 있다(§7 개선 여지).
- **Q. `console.error`는 프로덕션에서 지워야 하나?** — 사용자에게는 보이지 않고 개발자 도구에서만 보이며, 실패 원인(상태 코드, 스택)을 남기는 유일한 곳이다. 로깅 서비스가 있다면 그쪽으로 보내는 것이 정석이다.
- **Q. `per_page=100`인데 저장소가 100개를 넘으면?** — 첫 페이지만 온다. `Link` 헤더의 `rel="next"`를 따라가는 페이지네이션이 필요하다. 현재 계정은 33개라 해당 없다.

---

## Q6. 이벤트 → 상태 변경 → DOM 업데이트가 어떻게 연결되는지 (React의 기초)

### 한 줄 답변

이 프로젝트의 모든 동적 기능은 같은 뼈대다: 이벤트 리스너는 DOM을 직접 만지지 않고 상태만 바꾼다(`setState`, `setFormState`, `applyTheme`). 상태를 바꾸는 함수가 곧바로 렌더 함수를 부르고, 렌더 함수는 현재 상태만 보고 화면을 다시 만든다. React의 `useState`는 이 "setter가 렌더를 유발한다"를 자동화한 것이고, 컴포넌트 함수가 곧 `render()`다.

### 개념 설명

**단방향 데이터 흐름.** 이벤트 → 상태 → 화면, 한 방향으로만 흐른다. 화면이 상태를 바꾸지 않고(사용자 행동은 이벤트로 들어옴), 상태를 우회해 화면을 바꾸는 코드가 없다. 그러면 "지금 화면이 왜 이렇게 보이는가"의 답이 항상 "상태가 이렇기 때문"이 되어 디버깅이 상태 확인으로 끝난다.

**상태는 유일한 진실(single source of truth).** 같은 정보를 두 곳(예: 변수와 DOM 속성)에 두면 언젠가 어긋난다. 이 프로젝트에서 "메뉴가 열렸는가"는 `navMenu`의 `is-open` 클래스 하나로, "테마"는 `html[data-theme]` 하나로, "저장소 목록"은 `state.repos` 하나로 정해진다. DOM 자체를 상태 저장소로 쓰는 경우(테마, 메뉴)와 JS 객체를 쓰는 경우(API, 폼)가 섞여 있지만, 어느 쪽이든 *한 곳*이다.

**파생 값은 저장하지 않고 계산한다.** "현재 필터에 맞는 저장소 목록"을 상태에 저장하면 필터나 원본이 바뀔 때마다 갱신해야 한다. 대신 렌더링 시점에 `getVisibleRepos()`로 계산하면 항상 최신이다. 계산 비용이 문제 될 규모가 아니면 이것이 정답이다.

**전체 재렌더링 vs 최소 갱신.** 이 코드는 `innerHTML`로 영역을 통째로 다시 그린다. 단순하고 상태와 화면이 어긋날 수 없지만, 큰 DOM에서는 비용이 크고 입력 포커스·스크롤 같은 DOM 내부 상태가 날아간다. React는 "통째로 다시 그리는 것처럼 코드를 쓰되, 실제로는 이전 결과와 비교해 바뀐 부분만 DOM에 반영"한다(재조정, reconciliation). 즉 React가 해주는 것은 *최소 갱신*이지, 패턴 자체는 이 코드와 같다.

**React와의 대응.**

| 이 프로젝트 | React | 비고 |
| --- | --- | --- |
| `const state = { status, repos, filter }` | `const [status, setStatus] = useState('idle')` 등 | 상태 선언 |
| `setState(patch)` → `render()` | `setStatus(next)` → 자동 리렌더 | React는 렌더 호출을 숨김 |
| `function render() { … innerHTML = … }` | `function Projects() { return <…/> }` | 컴포넌트 = 렌더 함수 |
| `getVisibleRepos()` | 렌더 중 `repos.filter(...)` 또는 `useMemo` | 파생 값 |
| `filterBar.addEventListener('click', …)` | `<button onClick={() => setFilter(lang)}>` | 이벤트 → setter |
| `innerHTML` 통째 교체 | 가상 DOM diff → 최소 패치 | React의 부가가치 |
| `Object.assign(state, patch)` | 새 객체로 교체(`setX(prev => ({...prev, ...}))`) | React는 불변 교체 강제 |

### 이 프로젝트에서의 적용 — 소스 인용

**흐름 1 — 다크 모드: 상태가 DOM 속성이고 렌더는 CSS.** `js/theme.js:9-13`, `:23-29`

```js
const applyTheme = (theme) => {
  rootElement.setAttribute('data-theme', theme);
  themeToggleBtn.setAttribute('aria-pressed', String(theme === DARK));
  themeToggleBtn.setAttribute('aria-label', theme === DARK ? '라이트 모드로 전환' : '다크 모드로 전환');
};
```

```js
themeToggleBtn.addEventListener('click', () => {
  const currentTheme = rootElement.getAttribute('data-theme');
  const nextTheme = currentTheme === DARK ? LIGHT : DARK;

  applyTheme(nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
});
```

리스너는 현재 상태(`data-theme`)를 읽고 다음 상태를 계산해 `applyTheme`에 넘길 뿐, 배경색이나 글자색을 한 줄도 건드리지 않는다. 렌더링은 CSS가 한다 — `css/style.css:61-85`

```css
[data-theme='dark'] {
  --color-bg: #15181f;
  --color-surface: #1d212b;
  --color-text: #f0ece4;
```

토큰을 참조하는 수백 개 규칙이 속성 하나로 한꺼번에 바뀐다. 아이콘 전환도 같은 속성 기준이다(`css/style.css:379-389`). "상태 → 렌더링"에서 렌더러가 JS가 아니라 CSS 캐스케이드인 예다. 초기 상태는 `readInitialTheme()`(`js/theme.js:15-19`)가 저장값 → 시스템 설정 순으로 결정하고, 파일 실행 즉시 `applyTheme(readInitialTheme())`(`:21`)로 적용한다.

**흐름 2 — GitHub API: `setState` → `render`.** (`js/github.js:27-37`, `:160-166`, Q5에서 인용) 상태 객체 하나, 변경 함수 하나, 렌더 함수 하나. `loadRepos`는 `setState`를 세 번 부를 뿐(`loading`, `success` 또는 `error`) DOM을 만지지 않는다. `render`는 인수 없이 `state`만 읽는다. 재시도 버튼도 `loadRepos`를 다시 부를 뿐이다.

**흐름 3 — 언어 필터: 파생 값 재계산.** `js/github.js:55-56`, `:170-174`

```js
const getVisibleRepos = () =>
  state.repos.filter(({ language }) => state.filter === FILTER_ALL || language === state.filter);
```

```js
filterBar.addEventListener('click', ({ target }) => {
  const button = target.closest('[data-filter]');
  if (!button) return;
  setState({ filter: button.dataset.filter });
});
```

클릭 → `state.filter`만 바뀜 → `render()` → `renderFilters()`가 활성 버튼을 다시 그리고(`is-active`, `aria-pressed`가 `state.filter === value`에서 파생, `js/github.js:60-64`) `renderSuccess()`가 `getVisibleRepos()`로 카드를 다시 계산한다. "보이는 목록"은 어디에도 저장되지 않는다. 필터 버튼 자체가 상태에서 파생되므로, 클릭한 버튼을 직접 찾아 클래스를 붙이는 코드가 없다.

**흐름 4 — 폼 유효성: 상태는 에러 메시지 객체.** `js/contactForm.js:25-47`

```js
const formState = {
  errors: { name: '', email: '', message: '' },
  isSubmitted: false,
};

const setFormState = (patch) => {
  Object.assign(formState, patch);
  renderForm();
};

/* ---- render (validity state → error messages) ------------------------- */

const renderField = ({ name, input, error }) => {
  const message = formState.errors[name];
  input.closest('.form-field').classList.toggle('is-invalid', message !== '');
  input.setAttribute('aria-invalid', String(message !== ''));
  error.textContent = message;
};

function renderForm() {
  fields.forEach(renderField);
  formSuccess.textContent = formState.isSubmitted ? SUCCESS_MESSAGE : '';
}
```

"에러가 있는가"는 `errors[name] !== ''` 하나로 결정된다 — 메시지가 곧 상태다. `renderField`는 그 한 조건에서 테두리 클래스, `aria-invalid`, 문구 세 가지를 파생시킨다. `input` 리스너(`:51-58`)와 `submit` 리스너(`:60-75`)는 검증 결과를 `errors` 객체로 만들어 `setFormState`에 넘길 뿐, 클래스나 텍스트를 직접 바꾸지 않는다. 그래서 "입력 중 에러 해제"와 "제출 시 일괄 표시"가 같은 렌더 함수를 공유한다. `contactForm.reset()`(`:73`) 뒤에 `setFormState({ errors, isSubmitted: true })`를 부르는 순서도 중요하다 — DOM 초기화 후 상태 렌더링.

**흐름 5 — 메뉴 열림: 동기화 함수가 렌더러.** (`js/nav.js:8-13`, Q3에서 인용) `setMenuOpen(isOpen)`은 불리언 하나에서 네 가지 DOM 변화를 파생시킨다. 여는 이벤트(버튼 클릭)와 닫는 이벤트(링크 클릭, Esc)가 셋이어도 렌더 경로는 하나다. 상태 저장소는 `navMenu.classList`이고 `setMenuOpen`이 렌더 함수에 해당한다.

**React로 옮기면 이런 모양 (설명용 가상 코드).** 언어 필터 흐름을 React로 쓰면 다음과 같다. 이 프로젝트에는 없는 코드이며, 대응 관계를 보이기 위한 예시다.

```jsx
// React로 옮기면 이런 모양 — 실제 저장소에는 없는 예시
function Projects() {
  const [status, setStatus] = useState('idle');   // state.status
  const [repos, setRepos] = useState([]);          // state.repos
  const [filter, setFilter] = useState('all');     // state.filter

  const visibleRepos = repos.filter(              // getVisibleRepos()
    (r) => filter === 'all' || r.language === filter
  );

  if (status === 'loading') return <Skeleton />;   // render() 분기
  if (status === 'error') return <ErrorPanel />;
  if (visibleRepos.length === 0) return <Empty />;

  return visibleRepos.slice(0, 9).map((r) => (
    <RepoCard key={r.name} {...r} />                // shownRepos.map(createRepoCard)
  ));
}
```

`setFilter(lang)`를 부르면 React가 `Projects()`를 다시 실행한다 — 우리가 `setState` 끝에서 `render()`를 부르던 한 줄이 사라진 것이다. `visibleRepos`가 함수 본문에서 매번 계산되는 것은 `getVisibleRepos()`와 같다. `if` 분기 순서도 `render()` → `renderSuccess()`의 분기와 같다. 차이는 (1) 상태를 `Object.assign`이 아니라 setter로 교체하고, (2) 반환한 JSX를 React가 이전 결과와 비교해 바뀐 DOM만 고친다는 점이다.

### 흔한 오해와 대안 비교

| 대안 | 무엇이 문제인가 |
| --- | --- |
| 리스너에서 `projectsGrid.innerHTML = …`를 직접 | 필터 클릭·재시도·초기 로드 세 곳에 렌더 코드가 복제됨. 한 곳을 고치면 나머지가 어긋남 |
| "현재 보이는 카드 목록"을 상태에 저장 | 필터·원본 변경 시 두 곳을 갱신해야 함. 파생 값은 계산 |
| 메뉴 열림 여부를 JS 변수 `let isOpen`과 클래스 양쪽에 | 둘이 어긋나는 순간이 생김. 한 곳(클래스)만 진실 |
| 다크 모드를 JS로 요소마다 `style.color = …` | 수백 요소 순회, 새로 생긴 요소 누락. `data-theme` + CSS 변수가 정답 |
| 렌더 함수가 인수로 데이터를 받음 | 호출자마다 다른 데이터를 넘길 수 있어 "현재 상태"와 화면이 어긋날 여지. 인수 없이 `state`만 읽게 |
| 상태 변경 후 `render()` 호출을 잊음 | `setState`가 항상 `render()`를 부르게 하면 구조적으로 불가능 |
| React를 먼저 배우고 이 패턴을 모름 | `useState`가 "왜 setter를 써야 하는지", "왜 상태를 직접 수정하면 화면이 안 바뀌는지"를 이해 못 함. 이 미션이 그 답을 손으로 짜 보는 것 |

### 예상 추가 질문과 답

- **Q. `innerHTML`로 통째로 그리면 성능 문제가 없나?** — 카드 9개, 버튼 10개 규모에서는 측정 불가할 만큼 빠르다. 수천 개 행이나 입력 중인 폼을 통째로 그리면 문제가 되며, 그때 React의 최소 갱신이 가치를 갖는다.
- **Q. 폼은 왜 `innerHTML`이 아니라 `textContent`·`classList`로 갱신하나?** — 입력창을 `innerHTML`로 다시 만들면 사용자가 입력 중인 값과 포커스가 사라진다. 입력 요소는 유지하고 그 *주변*(에러 문구, 클래스)만 갱신하는 것이 이 경우의 "최소 갱신"이다.
- **Q. `Object.assign(state, patch)`와 React의 `setState`는 무엇이 다른가?** — React는 새 객체를 만들어 교체하므로 이전 상태와 참조 비교(`===`)로 변경을 감지할 수 있다. 이 코드는 같은 객체를 수정하므로 그런 비교가 불가능하지만, 변경 직후 항상 렌더하므로 감지가 필요 없다.
- **Q. 상태가 다섯 흐름에 흩어져 있는데 하나로 합쳐야 하지 않나?** — 서로 무관한 상태(테마, 메뉴, API, 폼)는 분리하는 것이 맞다. React에서도 컴포넌트마다 `useState`를 두지 전역 하나로 모으지 않는다. 공유가 필요해질 때 합친다.
- **Q. 이 패턴을 "상태 머신"이라 불러도 되나?** — API 흐름은 `idle → loading → success | error → (retry) loading`으로 전이가 정해져 있어 상태 머신에 가깝다. 폼과 테마는 전이 제약이 없는 단순 상태다. 전이를 명시적으로 제한하고 싶으면 `setState`에서 허용되지 않는 전이를 거부하면 된다.

---

## 부록: 여섯 답변을 관통하는 원칙

여섯 질문은 서로 다른 주제처럼 보이지만 같은 원칙에서 나온다.

1. **의미는 구조에, 표현은 CSS에, 동작은 JS에.** 시맨틱 태그(Q1)가 의미를 담고, Flex/Grid와 토큰(Q2)이 표현을 담고, `addEventListener`(Q3)가 동작을 담는다. `onclick` 속성과 인라인 `style`을 쓰지 않는 규칙은 이 분리를 지키기 위한 것이다. `data-reveal`, `data-filter`, `data-theme`는 세 층 사이의 약속된 접점이다.

2. **한 곳이 진실이고 나머지는 파생이다.** 테마는 `data-theme` 하나, 메뉴는 `is-open` 하나, 저장소는 `state.repos` 하나, 폼 오류는 `errors` 객체 하나에서 나온다. 화면의 모든 것은 거기서 계산된다(Q6). 배열을 `map`/`filter`로 가공하고 원본을 남기는 습관(Q4)도 같은 원칙이다.

3. **변경 경로를 하나로 좁힌다.** `setState`, `setFormState`, `setMenuOpen`, `applyTheme`. 이벤트가 몇 곳에서 들어오든 상태를 바꾸는 함수는 하나고, 그 함수가 렌더를 책임진다. 렌더를 잊거나 속성 하나를 빠뜨리는 실수가 구조적으로 막힌다.

4. **불확실성은 상태로 만든다.** 네트워크 응답(Q5)은 언제 올지, 성공할지 모른다. 그 불확실성을 `loading | success | error`라는 명시적 값으로 바꾸면 "지금 무엇을 보여줘야 하는가"가 항상 결정된다. 빈 결과, 레이트 리밋, 오프라인도 각각 자리가 있다.

5. **브라우저가 잘하는 일은 브라우저에 맡긴다.** `defer`가 실행 타이밍을, `IntersectionObserver`가 가시성 판정을, CSS `animation`이 스피너를, `scroll-behavior: smooth`가 부드러운 스크롤을, `label for`와 `button`이 키보드 동작을 맡는다. JS는 상태를 바꾸는 얇은 층으로 남는다.

6. **React는 이 패턴을 자동화한 것이지 대체한 것이 아니다.** `useState`의 setter가 `setState` + `render()`이고, 컴포넌트 함수가 `render()`이며, 가상 DOM은 `innerHTML` 통째 교체를 최소 패치로 바꾼 최적화다. 이 미션에서 손으로 짠 것을 이해하면, React에서 "왜 상태를 직접 바꾸면 안 되는가", "왜 렌더 함수는 순수해야 하는가"가 규칙이 아니라 필연으로 읽힌다.

---

관련 문서: [README.md](../README.md) · [docs/GUIDE.md](GUIDE.md) · [docs/EVALUATION.md](EVALUATION.md) · [Mission-B1-1.md](../Mission-B1-1.md)
