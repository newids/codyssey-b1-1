# 과제 목표 6개 — 상세 답변과 소스 근거

Mission-B1-1.md §3 "과제 목표"에 적힌 여섯 항목을 이 저장소의 실제 코드를 근거로 설명한 문서다. 각 항목마다 원리를 먼저 정리하고, 해당 원리가 코드 어디에 어떻게 적용되었는지 `파일:행` 형식으로 인용한다. 코드 발췌는 원문 그대로이며 행 번호는 작성 시점 기준이다.

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

시맨틱 태그를 쓰면 각 영역이 어떤 역할인지 브라우저, 스크린리더, 검색엔진이 구조적으로 파악할 수 있다. 이 페이지는 최상위를 `header / main / footer` 세 랜드마크로 나누고, 독립된 주제마다 `section`을 두어 `aria-labelledby`로 제목과 연결했다. 그 자체로 완결되는 내용은 `article`, 순서가 있는 목록은 `ol`, 이름과 값의 쌍은 `dl`로 표시했고, 폼 입력은 `label for`로 묶었다.

### 개념 설명

**접근성 트리.** 브라우저는 DOM과 별도로 보조기기에 전달할 접근성 트리(accessibility tree)를 만든다. `header`, `nav`, `main`, `footer`, 이름이 있는 `section`, `form`은 이 트리에서 랜드마크(landmark) 역할을 얻는다. 스크린리더 사용자는 랜드마크 목록을 열어 "내비게이션", "본문", "문의하기"처럼 원하는 영역으로 바로 건너뛴다. `div`에는 역할이 없으므로 목록에 오르지 않는다. 화면에 보이는 모양은 같아도, 접근성 트리에서는 이름이 붙은 영역 여섯 개로 나뉜 문서와 구분 없는 텍스트 한 덩어리로 된 문서만큼 차이가 난다.

**이름 없는 `section`은 랜드마크가 아니다.** `section`은 접근 가능한 이름이 있을 때만 `region` 랜드마크로 취급된다. `section`마다 `aria-labelledby`로 자기 `h2`를 가리켜 두면 "About — 문제를 코드로 풀어온 사람" 같은 이름으로 목록에 오른다. `nav`가 페이지에 하나뿐이더라도 `aria-label`을 붙여 두면 나중에 내비게이션이 늘어났을 때 서로 구분된다.

**검색엔진의 해석.** 크롤러는 `main` 안의 내용을 본문으로, `nav`를 내비게이션으로, `header`와 `footer`를 부수 영역으로 구분해 가중치를 달리 매긴다. `h1` 하나, 섹션마다 `h2`, 카드 안에 `h3`로 이어지는 제목 계층은 문서 개요(outline)가 된다.

**기본 동작.** 브라우저는 시맨틱 요소에 키보드 조작과 포커스 처리를 기본으로 제공한다. `button`은 Enter와 Space로 눌리고 탭 순서에 포함된다. `a[href]`는 키보드 포커스와 새 탭 열기가 된다. `label[for]`를 클릭하면 연결된 입력란에 포커스가 간다. `div`에 `onclick`을 붙여 버튼처럼 쓰면 이 동작을 전부 개발자가 다시 구현해야 한다. 반대로 `ul`, `ol`, `dl`에 딸린 기본 여백과 불릿은 CSS 한 줄로 지울 수 있다.

**설계 기준.** 이 페이지에서 태그를 고를 때 적용한 판단 기준은 다음과 같다.

| 판단 질문 | 예 → 선택 | 이 페이지에서의 예 |
| --- | --- | --- |
| 페이지 전체에서 하나뿐인 큰 영역인가 | `header` / `main` / `footer` | 상단 내비게이션 / 콘텐츠 전체 / 저작권 |
| 독립된 주제라 목차에 오를 만한가 | `section` + `aria-labelledby` | Hero, About, Experience, Skills, Projects, Contact |
| 떼어내도 그 자체로 완결되는가 | `article` | Skills 카드, GitHub 저장소 카드 |
| 항목 사이 순서가 의미 있는가 | `ol` (아니면 `ul`) | 경력 타임라인은 `ol`, 태그 목록은 `ul` |
| 이름과 값의 쌍인가 | `dl / dt / dd` | 경력 30년, 학력, 현재 |
| 이미지에 설명이 붙는가 | `figure / figcaption` | 프로필 일러스트 |

### 이 프로젝트에서의 적용 — 소스 인용

**최상위 랜드마크 세 개와 건너뛰기 링크.** `index.html:17-20`

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

키보드 사용자가 페이지에 들어와 첫 Tab을 누르면 "본문으로 건너뛰기" 링크가 나타난다. 이 링크를 누르면 `#main`으로 바로 이동하므로 내비게이션 링크 다섯 개와 버튼 두 개를 매번 지나갈 필요가 없다. `nav`에 `aria-label="주요 내비게이션"`을 붙인 이유는 랜드마크 목록에서 그냥 "navigation"이 아니라 "주요 내비게이션 navigation"으로 읽히게 하기 위해서다. 건너뛰기 링크는 평소 화면 밖에 있다가 포커스를 받을 때만 내려온다(`css/style.css:177-190`).

**섹션과 제목의 연결.** `index.html:94`, `index.html:102`

```html
    <section id="about" class="section about" aria-labelledby="aboutTitle">
```

```html
          <h2 class="section-title" id="aboutTitle" data-reveal>문제를 코드로 풀어온 사람</h2>
```

여섯 섹션(`#hero`:50, `#about`:94, `#experience`:132, `#skills`:184, `#projects`:239, `#contact`:256)이 모두 이 형태다. `section`의 `id`는 앵커 링크(`href="#about"`)의 목적지이고, `aria-labelledby`는 접근성 트리에 오를 이름을 지정한다. 한 요소가 두 역할을 함께 맡는다. 제목에 붙은 `data-reveal`은 스크롤 애니메이션용 표식으로, 문서 구조와 상관없는 표현용 속성은 이렇게 `data-*`로 분리했다.

**본문 안의 제목 계층.** `index.html:54-56`

```html
          <h1 class="hero-title" id="heroTitle" data-reveal>
            대기업 인트라넷에서 <br />블록체인 지갑까지, <br />30년째 만들고 있습니다.
          </h1>
```

`h1`은 Hero에 하나만 있고, 섹션 제목은 `h2`, 카드 제목과 타임라인 항목은 `h3`다(`index.html:141`, `192`, `js/github.js:89`). 제목 레벨은 글자 크기와 무관하게 문서 개요 기준으로 정했고, 크기는 CSS의 `.section-title`, `.timeline-role`에서 따로 맞췄다.

**이름과 값의 쌍은 `dl`.** `index.html:74-79`

```html
        <dl class="hero-facts" data-reveal>
          <div class="fact">
            <dt>경력</dt>
            <dd><strong>30</strong><span class="fact-unit">년</span></dd>
            <dd class="fact-note">1996년 대기업 입사 이후</dd>
          </div>
```

"경력"이라는 항목 이름에 "30년"과 "1996년 이후"라는 값이 붙는 구조라 `dl`이 맞는 태그다. `dl` 안에서는 `dt` 하나에 `dd` 여러 개를 둘 수 있고, HTML 표준은 `dt`와 `dd` 묶음을 `div`로 감싸는 것을 허용한다. 여기서는 스타일링 단위가 필요해서 감쌌다. 화면에서는 숫자가 위, 항목 이름이 아래에 보이지만 마크업 순서는 `dt → dd`이고, 시각 순서만 CSS의 `order` 속성으로 바꿨다(`css/style.css:563-569`, 1024px 이상에서는 `:1388-1390`에서 원래 순서로 돌아간다). 스크린리더가 읽는 순서는 항상 "경력, 30년"이다.

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

경력은 최신순으로 정렬된 시간 축이다. `ul`로 표시하면 순서 없는 항목 여섯 개가 되지만, `ol`로 표시하면 스크린리더가 "6개 중 1번째"처럼 위치까지 읽어 준다. 번호 자체는 CSS의 `list-style: none`(`css/style.css:151-154`)으로 숨겼다. 의미는 남기고 시각 표현만 뺀 것이다.

**독립적으로 완결되는 내용은 `article`.** `index.html:190-194`

```html
          <article class="skill-card skill-card-featured" data-reveal>
            <header class="skill-card-header">
              <h3>Blockchain</h3>
              <span class="skill-card-since">2018 —</span>
            </header>
```

카드 하나를 떼어 다른 페이지에 옮겨도 "Blockchain — Ethereum, Solidity…"라는 완결된 정보가 남는다. `article` 안에는 문서 헤더와 별개인 자체 `header`를 둘 수 있다. JS가 만드는 저장소 카드도 같은 이유로 `article`이다(`js/github.js:81`).

**이미지와 캡션.** `index.html:96-99`

```html
        <figure class="about-photo" data-reveal>
          <img src="images/profile.jpg" alt="JS Choi 캐릭터 일러스트 — 도시 전망을 배경으로 파란 후드를 입고 웃는 모습" width="320" height="400" loading="lazy" />
          <figcaption class="about-photo-caption">JS CHOI</figcaption>
        </figure>
```

`alt`에는 "프로필 사진"이라는 분류 대신 장면을 설명하는 문장을 넣었다. 이미지를 볼 수 없는 사용자에게 같은 정보를 전달하는 것이 `alt`의 목적이기 때문이다. `width`와 `height`를 명시하면 브라우저가 이미지를 내려받기 전에 자리를 확보하므로 레이아웃 이동(CLS)이 생기지 않고, `loading="lazy"`를 주면 첫 화면 밖의 이미지는 나중에 받는다. `figcaption`은 "JS CHOI"라는 장식 문구를 이미지와 한 묶음으로 만든다.

**폼: `label for`, `novalidate`, `aria-live`.** `index.html:273-278`

```html
        <form id="contactForm" class="contact-form" novalidate data-reveal>
          <div class="form-field">
            <label for="contactName">이름</label>
            <input type="text" id="contactName" name="name" autocomplete="name" placeholder="홍길동" />
            <p class="error-message" id="contactNameError" aria-live="polite"></p>
          </div>
```

`label`의 `for`와 `input`의 `id`가 같으면 라벨을 클릭할 때 입력란에 포커스가 가고, 스크린리더는 입력란에 들어갈 때 "이름, 편집창"이라고 읽는다. `placeholder`는 입력을 시작하면 사라지므로 라벨을 대신하지 못한다. `novalidate`는 브라우저의 기본 검증 UI를 끄고 JS가 검증을 맡게 하는 선언이다(Q5와 Q6에서 상태 흐름으로 설명한다). 에러 문구를 담는 `p`에 `aria-live="polite"`를 두면, 문구가 바뀔 때 스크린리더가 현재 낭독을 마친 뒤 알려 준다. 성공 메시지(`index.html:296`)와 API 상태 영역(`index.html:250`)도 같은 방식이다.

```html
        <div class="projects-status" id="projectsStatus" role="status" aria-live="polite"></div>
```

**버튼 상태는 속성으로 표시한다.** `index.html:32`

```html
        <button class="nav-toggle" id="navToggle" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="navMenu">
```

햄버거 버튼에는 글자가 없으므로 `aria-label`로 이름을 붙였다. `aria-expanded`는 열림과 닫힘을, `aria-controls`는 이 버튼이 어느 요소를 제어하는지를 알린다. 이 속성들은 JS가 상태에 맞춰 갱신한다(`js/nav.js:8-13`). `type="button"`을 빠뜨리면 폼 안의 버튼은 기본값인 submit으로 동작한다는 점도 함께 기억해 둘 필요가 있다.

### 흔한 오해와 대안 비교

| 대안 | 무엇이 문제인가 |
| --- | --- |
| 모든 영역을 `div.section`으로 | 랜드마크가 0개가 된다. 스크린리더 사용자는 처음부터 끝까지 순서대로 읽어야 하고, 검색엔진은 본문과 내비게이션을 구분하지 못한다 |
| `div`에 `onclick`으로 버튼 흉내 | 탭 순서에 들어가지 않고 Enter와 Space가 동작하지 않는다. `role="button"`, `tabindex="0"`, 키 핸들러를 모두 추가해야 원래 `button`과 같아진다 |
| 제목을 글자 크기 기준으로 선택(`h4`가 `h2`보다 커 보이니까) | 문서 개요가 뒤섞인다. 크기는 CSS로 정하고 레벨은 구조로 정한다 |
| `placeholder`만 있고 `label` 없음 | 입력을 시작하면 필드 이름이 사라진다. 스크린리더에는 이름 없는 편집창으로 읽힌다 |
| `section`에 제목 없음 | 이름 없는 `section`은 랜드마크로 취급되지 않아 사실상 `div`와 같다 |
| 경력 목록을 `ul`로 | 순서가 있다는 정보가 사라진다. 시각적으로 번호를 감출 것이라면 `ol` + `list-style: none`을 쓴다 |

### 예상 추가 질문과 답

- **Q. `section`과 `article`의 차이는?** — `article`은 카드나 글 한 편처럼 독립적으로 배포할 수 있는 단위이고, `section`은 문서 안의 주제 묶음이다. 카드 안에 `section`이 올 수도 있고 그 반대도 가능하다. 떼어냈을 때 의미가 남는지를 기준으로 고른다.
- **Q. `aria-*` 속성을 많이 쓰면 접근성이 좋아지나?** — 그렇지 않다. ARIA의 첫 번째 규칙은 네이티브 요소로 표현할 수 있으면 ARIA를 쓰지 않는 것이다. 이 페이지의 ARIA는 섹션 이름, 확장 상태, 라이브 영역처럼 네이티브 요소로 표현할 수 없는 곳에만 있다.
- **Q. `data-reveal` 같은 `data-*` 속성은 시맨틱을 해치지 않나?** — `data-*`는 표준이 스크립트용 사설 데이터 자리로 정해 둔 속성이라 접근성 트리나 검색에 영향이 없다. 클래스 이름에 `js-` 접두어를 붙이는 관습과 목적이 같다.
- **Q. Hero만 `h1`이고 나머지는 `h2`인 이유는?** — 페이지의 주제("30년째 만들고 있습니다")가 하나이고 나머지는 그 하위 주제이기 때문이다. `h1`이 여럿이면 어느 것이 페이지 제목인지 모호해진다.

---

## Q2. Flexbox와 Grid의 차이, 언제 무엇을 선택하는지

### 한 줄 답변

Flexbox는 한 축(행 또는 열)을 따라 항목을 배치하고 정렬하는 1차원 도구이고, Grid는 행과 열을 함께 정의해 항목을 셀에 놓는 2차원 도구다. 이 페이지는 내비게이션, 카드 헤더, 태그 목록처럼 한 줄에 좌우로 놓는 곳에 Flexbox를 썼고, 프로젝트 카드, 스킬 카드, Hero의 8:4 분할처럼 개수와 화면 폭에 따라 열 수가 바뀌는 격자에는 Grid를 썼다.

### 개념 설명

**1차원과 2차원.** Flex 컨테이너는 주축(main axis)을 하나 정하고 항목을 그 축을 따라 놓는다. `flex-wrap`으로 줄이 바뀌어도 각 줄은 독립적이라, 둘째 줄의 항목이 첫째 줄의 항목과 열을 맞추지 않는다. Grid는 먼저 트랙(행과 열)을 정의한 뒤 항목을 셀에 배치하므로 모든 행에서 열이 정렬된다. 마지막 줄에 항목이 하나만 남았을 때 Flex에서는 그 항목이 `flex-grow`에 따라 늘어나거나 왼쪽에 붙지만, Grid에서는 정확히 한 칸을 차지한다.

**내용물 중심과 격자 중심.** Flex에서는 항목의 크기가 배치를 결정한다. 버튼 두 개나 태그 다섯 개처럼 내용물 크기가 제각각이고 순서대로 흘러가기만 하면 되는 경우에 적합하다. Grid에서는 컨테이너가 먼저 격자를 정하고 내용물이 거기에 맞춰진다. 카드처럼 모든 항목이 같은 폭이어야 하는 경우에 적합하다.

**`repeat(auto-fit, minmax(A, 1fr))`.** 폭이 A 이상인 열을 들어갈 수 있는 만큼 만들고, 남는 공간은 `1fr`로 균등하게 나누라는 뜻이다. 컨테이너가 900px이고 A가 280px이면 3열, 600px이면 2열, 300px이면 1열이 된다. 미디어 쿼리 없이 열 수가 바뀐다. `auto-fill`은 항목이 부족해도 빈 트랙을 남기고, `auto-fit`은 빈 트랙을 0으로 접어서 있는 항목이 공간을 채운다. 카드가 2개뿐일 때 `auto-fit`이면 두 카드가 절반씩 차지하고, `auto-fill`이면 3열 자리 중 두 칸만 채워지고 셋째 칸은 빈다.

**`min(100%, 280px)`.** `minmax(280px, 1fr)`만 쓰면 컨테이너가 280px보다 좁아졌을 때 트랙 최소 폭이 컨테이너를 넘어 가로 스크롤이 생긴다. `min(100%, 280px)`는 280px과 컨테이너 폭 중 작은 값을 고르므로, 320px 화면에서 패딩을 빼고 280px이 안 되더라도 넘치지 않는다.

**`grid-column: span N`.** 특정 항목이 두 칸을 차지하게 하는 선언으로 Grid에서만 가능하다. Flex로 같은 효과를 내려면 `flex-basis`를 직접 계산해야 하고, 그래도 다른 행과 열이 맞는다는 보장이 없다.

**모바일 퍼스트.** 기본 규칙은 가장 좁은 화면(1열, 세로 스택)에 맞춰 쓰고, `@media (min-width: 768px)`와 `(min-width: 1024px)`에서 규칙을 덧붙인다. 큰 화면부터 쓰고 `max-width`로 취소해 나가는 방식보다 규칙 수가 적고, 기본 상태가 가장 단순해서 문제를 찾기 쉽다.

### 이 프로젝트에서의 적용 — 소스 인용

**내비게이션은 Flex, 로고는 왼쪽·메뉴는 오른쪽.** `css/style.css:320-328`

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

`.navbar`의 자식은 로고(`a.logo`), 컨트롤 묶음(`div.nav-controls`), 메뉴(`ul.nav-menu`) 셋이다. 모바일에서는 메뉴가 `position: fixed`로 흐름에서 빠지므로, 남은 두 자식이 `space-between`에 따라 양 끝에 붙는다. 한 줄에 좌우로 놓는 문제이므로 Flex 한 줄로 끝난다.

**같은 메뉴가 768px에서 가로 배치로 바뀐다.** 모바일 기본값 `css/style.css:424-438`

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

같은 `ul`이 모바일에서는 세로 패널(`flex-direction: column`)이고 데스크톱에서는 가로 메뉴(`row`)다. 데스크톱의 `margin-left: auto`는 Flex 항목의 auto 마진이 남는 공간을 모두 차지하는 성질을 이용해 메뉴를 오른쪽으로 밀어낸다. `.nav-controls { order: 3 }`은 DOM 순서(로고 → 컨트롤 → 메뉴)를 그대로 둔 채 화면에 보이는 순서만 로고 → 메뉴 → 컨트롤로 바꾼다. 모바일에서 메뉴를 `display: none`이 아니라 `opacity`, `visibility`, `transform`으로 숨긴 이유는 열고 닫을 때 전환 애니메이션을 넣기 위해서다. `display` 속성에는 애니메이션이 적용되지 않는다. `visibility 0s linear var(--transition-base)`는 사라질 때 페이드가 끝난 뒤에 `hidden`이 되도록 지연시키는 선언이다.

**프로젝트 카드는 Grid의 `auto-fit`과 `minmax`.** `css/style.css:904-908`

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--space-5);
}
```

카드 수는 API 응답과 필터에 따라 0개에서 9개 사이로 변하고, 열 수는 화면 폭에 따라 1열에서 3열 사이로 변한다. 이 선언 하나로 두 경우를 모두 처리한다. `css/style.css:1233-1425`에 있는 두 브레이크포인트 블록 어디에도 `.projects-grid` 규칙이 없다는 점에서 확인할 수 있다. 마지막 행에 카드가 하나만 남아도 위 행과 열이 맞는다.

**스킬 카드는 열 수를 고정하고 `span`으로 비정형 배치.** 모바일 `css/style.css:715-719`

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

여기서는 `auto-fit` 대신 열 수를 명시했다. Blockchain 카드는 두 칸, Leadership 카드는 한 줄 전체를 차지하게 하려는 편집 의도가 있었고, `span`이 의미를 가지려면 열 수가 정해져 있어야 하기 때문이다. `minmax(0, 1fr)`은 `1fr`만 쓸 때 긴 단어가 트랙을 늘려 버리는 현상을 막는 관용 표현이다(`1fr`의 최소값은 `auto`, 곧 내용물의 최소 폭이다). `.skill-card-wide`는 Grid 셀 안에 놓이면서 자기 내부는 Flex(`flex-direction: row`)로 헤더와 태그를 가로로 배치한다. 바깥은 Grid, 안쪽은 Flex로 두 도구를 겹쳐 쓴 예다.

**Hero는 1024px에서 8:4로 나뉜다.** 모바일 `css/style.css:486-490`

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

모바일에서는 세로로 쌓기만 하면 되므로 Flex의 column 방향이 가장 단순하다. 데스크톱에서는 왼쪽 8, 오른쪽 4라는 비율 분할이 필요해 Grid로 바꿨다. `align-items: end`는 두 칸의 아래선을 맞춘다. 같은 요소의 `display` 값을 브레이크포인트에 따라 바꾸는 것은 흔히 쓰는 방식이다. 안쪽의 `.hero-facts`는 모바일에서 3열 Grid(`css/style.css:549-555`)였다가 데스크톱에서 1열 세로 목록이 되고, 구분선도 위쪽(`border-top`)에서 왼쪽(`border-left`)으로 옮겨진다.

**흘러가면 되는 항목에는 `flex-wrap`.** `css/style.css:776-780`

```css
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
```

태그 알약은 글자 수에 따라 폭이 다르고, 줄이 바뀌어도 열을 맞출 필요가 없다. 이런 곳에 Grid를 쓰면 모든 태그가 같은 폭으로 늘어나 오히려 어색해진다. 필터 버튼(`css/style.css:799-805`)과 Hero의 CTA 버튼(`css/style.css:542-547`)도 같은 이유로 `flex-wrap`이다.

**Contact는 768px에서 5:7 Grid.** `css/style.css:1329-1334`

```css
  .contact-inner {
    display: grid;
    grid-template-columns: 5fr 7fr;
    gap: var(--space-10);
    align-items: start;
  }
```

모바일 기본값은 Flex column이다(`css/style.css:1017-1021`). 소개 글과 폼을 나란히 놓되 폼이 조금 더 넓어야 해서 `5fr 7fr`로 나눴다. `align-items: start`를 주면 왼쪽 소개 글이 짧아도 위쪽에 붙어 있다. 기본값인 `stretch`였다면 폼 높이만큼 늘어난다.

**타임라인 항목은 768px에서 2열 Grid.** `css/style.css:1303-1308`

```css
  .timeline-item {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: var(--space-8);
    padding-block: var(--space-6);
  }
```

기간 칸은 180px로 고정하고 내용 칸이 나머지를 차지한다. 항목마다 기간 칸의 폭이 같아야 세로 정렬선이 생긴다. Flex였다면 기간 텍스트의 길이에 따라 내용 칸의 시작점이 흔들렸을 것이다. `flex-basis: 180px`로 흉내 낼 수는 있지만 Grid 선언이 구조를 더 분명하게 보여 준다.

### 흔한 오해와 대안 비교

| 대안 | 무엇이 문제인가 |
| --- | --- |
| 카드 그리드를 `display: flex; flex-wrap: wrap`으로 | 마지막 행에 카드가 한두 개 남으면 `flex-grow`로 늘어나 커지거나, 늘어나지 않으면 왼쪽에 몰린다. 행 사이 열 정렬도 보장되지 않아 `width: calc(33.333% - gap)` 같은 계산이 필요해진다 |
| 내비게이션을 Grid로 | 가능은 하지만 양 끝 정렬을 위해 `grid-template-columns: auto 1fr auto` 같은 선언이 필요하다. Flex의 `space-between` 한 줄이 더 간단하다 |
| `minmax(280px, 1fr)`만 쓰기 (`min()` 없이) | 320px 화면에서 트랙이 컨테이너보다 넓어져 가로 스크롤이 생긴다 |
| `repeat(auto-fill, …)` | 카드가 적을 때 빈 트랙이 남아 카드가 왼쪽에 작게 몰린다. 있는 만큼 채우려면 `auto-fit`을 쓴다 |
| 데스크톱 퍼스트(`max-width` 미디어 쿼리) | 모바일에서 데스크톱 규칙을 하나하나 취소해야 한다. 규칙이 늘고 기본 상태가 복잡해진다 |
| `float`로 열 배치 | clearfix, 높이 붕괴, 순서 제약이 따른다. Flex와 Grid 이전에 쓰던 우회 방법이다 |

### 예상 추가 질문과 답

- **Q. Grid만 쓰면 안 되나?** — 태그처럼 크기가 제각각이고 정렬이 필요 없는 항목은 Flex가 더 적은 선언으로 끝난다. Grid는 트랙을 정의해야 하므로 흘러가기만 하면 되는 경우에는 과하다.
- **Q. `gap`은 Flex에서도 되나?** — 된다. 이 페이지의 모든 Flex와 Grid 컨테이너는 마진 대신 `gap`을 쓴다. 마지막 항목의 마진을 지우는 `:last-child` 규칙이 필요 없어진다.
- **Q. `fr`과 `%`의 차이는?** — `%`는 컨테이너 폭에 대한 비율이라 `gap`을 빼고 계산해야 한다. `fr`은 `gap`을 뺀 나머지 공간을 나누므로 `8fr 4fr`에 `gap`을 더해도 넘치지 않는다.
- **Q. 브레이크포인트를 768과 1024로 정한 근거는?** — 미션이 지정한 값이다. 실무에서는 내용이 깨지는 지점에 브레이크포인트를 두는 것이 원칙이며, 이 페이지는 `clamp()`와 `auto-fit`을 함께 써서 브레이크포인트 사이에서도 유동적으로 변한다.
- **Q. `order`를 쓰면 접근성 문제가 없나?** — 화면 순서와 DOM 순서(탭 순서)가 어긋나면 키보드 사용자가 혼란을 느낄 수 있다. 여기서는 `.nav-controls`(테마 버튼)를 맨 끝으로 보내는 정도라, 탭 순서(로고 → 테마 버튼 → 메뉴)와 화면 순서(로고 → 메뉴 → 테마 버튼)의 차이가 작다고 판단했다. 큰 폭의 재배치에는 쓰지 않는 것이 맞다.

---
## Q3. querySelector로 DOM을 선택하고 addEventListener로 이벤트를 연결하는 흐름

### 한 줄 답변

스크립트를 `defer` 속성으로 연결하면 HTML 파싱이 끝난 뒤에 파일 순서대로 실행된다. 그래서 각 파일의 첫 줄부터 요소를 바로 찾아 상수에 담아 둘 수 있다. 하나뿐인 요소는 `getElementById`로, 여러 개인 요소는 `querySelectorAll`과 `forEach`로 찾아 `addEventListener`로 처리기를 등록했다. API 응답 이후에 생기는 필터 버튼은 부모 요소에 처리기 하나만 두고 `closest()`로 눌린 버튼을 찾는 이벤트 위임(event delegation) 방식으로 처리했다. HTML 파일에는 `onclick` 속성이 하나도 없다.

### 개념 설명

**HTML 파싱과 스크립트 실행 시점.** 브라우저는 HTML을 위에서 아래로 읽어 내려가다가 `<script>` 태그를 만나면 기본적으로 파싱을 멈추고 스크립트를 내려받아 실행한다. 스크립트가 `<head>` 안에 있고 그 안에서 `document.getElementById('navToggle')`를 호출하면, 해당 요소는 아직 파싱되지 않았으므로 결과가 `null`이다. 이 문제를 피하는 방법은 세 가지다.

| 방식 | 다운로드 | 실행 시점 | 실행 순서 |
| --- | --- | --- | --- |
| 기본 (`<script src>`) | 파싱을 멈추고 받음 | 받는 즉시 | 문서 순서 |
| `async` | 파싱과 동시에 받음 | 다운로드가 끝나는 즉시(파싱 중단) | 보장되지 않음 |
| `defer` | 파싱과 동시에 받음 | 파싱 완료 후, `DOMContentLoaded` 직전 | 문서 순서 |

`defer`를 쓰면 DOM이 모두 만들어진 뒤에 스크립트가 적힌 순서대로 실행된다. `DOMContentLoaded` 처리기로 코드를 감쌀 필요가 없고, 파일 사이의 순서 의존도 그대로 유지된다. 예를 들어 `github.js`는 `render` 함수를 정의한 뒤에 `loadRepos()`를 호출하는데, 이 순서는 파일 안에서 보장된다.

**요소 선택 API.** `getElementById`는 `id` 값으로 요소 하나를 찾는다. 브라우저가 id 색인을 유지하므로 가장 빠르다. `querySelector`는 CSS 선택자에 맞는 첫 요소를, `querySelectorAll`은 맞는 요소 전부를 돌려준다. `querySelectorAll`의 반환값은 정적 `NodeList`다. 호출 시점의 결과가 고정되므로 이후 DOM이 바뀌어도 목록이 변하지 않고, `forEach`를 바로 쓸 수 있다. 반면 `getElementsByClassName`은 살아 있는 `HTMLCollection`을 돌려준다. 순회하는 도중에 DOM을 바꾸면 목록 내용이 함께 바뀌고, `forEach` 메서드도 없다.

**이벤트 버블링과 위임.** 사용자가 어떤 요소를 클릭하면 이벤트는 실제로 클릭된 요소(`event.target`)에서 시작해 부모 방향으로 전파된다. 이 과정을 버블링(bubbling)이라고 하며, 경로에 있는 각 조상 요소의 처리기가 차례로 실행된다. 이 성질을 이용하면 부모 요소에 처리기 하나만 두고 `event.target.closest(선택자)`로 어느 자식이 눌렸는지 알아낼 수 있다. 자식 요소가 나중에 추가되거나 `innerHTML`로 통째로 교체되어도 부모에 등록한 처리기는 그대로 남는다.

**`{ passive: true }` 옵션.** `scroll`이나 `touchmove` 이벤트의 처리기는 `preventDefault()`를 호출해 스크롤을 막을 수 있다. 그래서 브라우저는 처리기 실행이 끝날 때까지 실제 스크롤을 미룬다. `passive: true`를 지정하면 이 처리기가 `preventDefault()`를 호출하지 않는다고 브라우저에 알리는 셈이고, 브라우저는 처리기를 기다리지 않고 스크롤을 먼저 진행한다.

**구조와 동작의 분리.** `onclick="…"` 속성은 HTML 안에 JavaScript를 섞는 방식이다. 호출할 함수가 전역에 있어야 하고, 이벤트 하나에 처리기를 하나만 달 수 있으며, 콘텐츠 보안 정책(Content-Security-Policy)이 인라인 스크립트를 막는 환경에서는 동작하지 않는다. `addEventListener`는 처리기를 여러 개 등록할 수 있고, `once`·`passive` 같은 옵션과 `removeEventListener`를 지원한다.

### 이 프로젝트에서의 적용 — 소스 인용

**스크립트 일곱 개를 모두 `defer`로, 문서 끝에 순서대로 연결했다.** `index.html:322-328`

```html
  <script defer src="js/theme.js"></script>
  <script defer src="js/nav.js"></script>
  <script defer src="js/scrollTop.js"></script>
  <script defer src="js/reveal.js"></script>
  <script defer src="js/typing.js"></script>
  <script defer src="js/github.js"></script>
  <script defer src="js/contactForm.js"></script>
```

일곱 파일 모두 `defer`이므로 파싱을 막지 않고, 실행은 적힌 순서를 따른다. `theme.js`가 가장 먼저 실행되어 저장된 테마를 적용하므로, 라이트 화면이 잠깐 보였다가 다크로 바뀌는 시간이 짧아진다. 각 파일은 첫 줄부터 필요한 요소를 찾는다.

**하나뿐인 요소는 `getElementById`, 여러 개인 요소는 `querySelectorAll`로 찾았다.** `js/nav.js:3-6`

```js
const siteHeader = document.getElementById('siteHeader');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
```

`id`가 있고 페이지에 하나뿐인 요소는 `getElementById`로 찾는다. `.nav-link`는 다섯 개이므로 `querySelectorAll`로 `NodeList`를 받는다. 이 상수들은 파일 첫머리에서 한 번만 조회하고 처리기 안에서 재사용한다. 처리기가 실행될 때마다 `querySelector`를 다시 부르지 않는다.

**처리기 등록과 상태 동기화 함수를 분리했다.** `js/nav.js:8-22`

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

클릭 처리기는 `classList.toggle('is-open')`의 반환값으로 새 상태를 얻는다. 이 메서드는 토글 뒤에 클래스가 남아 있으면 `true`를 돌려준다. 그 값을 `setMenuOpen`에 넘기면 메뉴의 클래스, 버튼의 클래스, `aria-expanded`, `aria-label` 네 가지가 한 번에 바뀐다. 메뉴를 여는 곳은 버튼 하나지만 닫는 곳은 링크 클릭과 Esc 키까지 여럿이다. 모든 경로가 `setMenuOpen` 한 함수를 거치므로 네 속성이 서로 어긋날 일이 없다. `navLinks.forEach`가 가능한 이유는 `NodeList`가 `forEach` 메서드를 지원하기 때문이다.

**키보드 이벤트를 문서 전체에서 받는다.** `js/nav.js:24-29`

```js
document.addEventListener('keydown', ({ key }) => {
  if (key === 'Escape' && navMenu.classList.contains('is-open')) {
    setMenuOpen(false);
    navToggle.focus();
  }
});
```

`keydown` 처리기를 `document`에 등록한 이유는 포커스가 어느 요소에 있든 Esc 키를 받기 위해서다. 이벤트 객체에서는 `key` 속성만 구조분해로 꺼냈다(Q4 참조). 메뉴를 닫은 뒤 `navToggle.focus()`로 포커스를 햄버거 버튼에 되돌린다. 키보드로 조작하는 사용자가 현재 위치를 잃지 않도록 하는 관례다.

**스크롤 처리기는 `passive`로 등록하고, 초기 상태도 즉시 계산한다.** `js/nav.js:31-36`

```js
const updateHeaderStyle = () => {
  siteHeader.classList.toggle('is-scrolled', window.scrollY >= NAV_SCROLL_THRESHOLD);
};

window.addEventListener('scroll', updateHeaderStyle, { passive: true });
updateHeaderStyle();
```

처리기 본문은 `classList.toggle` 한 줄이다. 스크롤할 때마다 실행되는 코드이므로 가볍게 유지한다. `toggle`의 두 번째 인수(`window.scrollY >= 60`)는 강제 플래그(force)다. 이 값이 참이면 클래스를 추가하고 거짓이면 제거하므로 `if/else` 분기가 필요 없다. 마지막 줄의 `updateHeaderStyle()` 호출은 초기 상태를 맞추기 위한 것이다. 브라우저는 새로고침 시 이전 스크롤 위치를 복원하는데, 이때 스크롤 이벤트가 발생하지 않아도 헤더가 올바른 모습으로 시작한다. `js/scrollTop.js:5-10`도 같은 구조다.

```js
const updateScrollTopVisibility = () => {
  scrollTopBtn.classList.toggle('is-visible', window.scrollY >= SCROLL_TOP_THRESHOLD);
};

window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });
updateScrollTopVisibility();
```

**요소가 화면에 보이는지는 스크롤 처리기 대신 IntersectionObserver로 판정한다.** `js/reveal.js:1-16`

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

"요소가 20% 이상 보이면 클래스를 붙인다"는 조건을 스크롤 처리기로 구현하면, 스크롤할 때마다 39개 요소의 `getBoundingClientRect()`를 계산해야 한다. `IntersectionObserver`를 쓰면 브라우저가 레이아웃을 계산하는 시점에 교차 여부를 알려 주므로 별도 계산 비용이 거의 들지 않는다. 한 번 보인 요소는 `unobserve`로 관찰 대상에서 빼서, 화면 밖으로 나갔다가 돌아와도 애니메이션이 반복되지 않는다. 애니메이션을 적용할 요소는 HTML에서 `data-reveal` 속성으로 표시하고 `[data-reveal]` 속성 선택자로 모은다.

**아직 존재하지 않는 버튼에는 이벤트 위임으로 대응한다.** `js/github.js:170-174`

```js
filterBar.addEventListener('click', ({ target }) => {
  const button = target.closest('[data-filter]');
  if (!button) return;
  setState({ filter: button.dataset.filter });
});
```

필터 버튼은 API 응답이 도착한 뒤 `renderFilters()`가 `innerHTML`로 만든다(`js/github.js:103-110`). 그리고 상태가 바뀔 때마다 통째로 다시 만들어진다. 버튼마다 처리기를 달면 다시 그릴 때마다 등록도 반복해야 한다. 대신 처음부터 존재하는 부모 `#filterBar`에 처리기 하나를 두고, 클릭된 요소에서 `closest('[data-filter]')`로 가장 가까운 필터 버튼을 찾는다. 버튼 바깥의 빈 공간을 클릭하면 `closest`가 `null`을 돌려주므로 그냥 반환한다. 어느 필터인지는 버튼의 `data-filter` 속성(`button.dataset.filter`)에서 읽는다.

**동적으로 만든 요소에 처리기를 직접 다시 붙인 경우도 있다.** `js/github.js:118-130`

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

재시도 버튼은 위임 대신 직접 등록했다. 에러 상태에서만 존재하는 요소가 하나뿐이라 위임의 이점이 작고, 마크업을 만든 직후 같은 함수 안에서 등록하면 버튼은 있는데 처리기가 없는 순간이 생기지 않는다. `innerHTML`로 교체되면서 사라진 이전 버튼의 처리기는 요소와 함께 정리되므로 메모리 누수도 없다. `loadRepos`는 이 지점(184행)보다 뒤에 선언된 `function`이지만, 함수 선언은 호이스팅되므로 앞에서 참조해도 문제가 없다.

**폼에서는 `input`과 `submit` 이벤트를 쓴다.** `js/contactForm.js:51-52`, `:60-61`

```js
fields.forEach(({ name, input }) => {
  input.addEventListener('input', () => {
```

```js
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
```

`input` 이벤트는 키 입력이나 붙여넣기로 값이 바뀔 때마다 발생하므로 실시간 검증에 알맞다. `change` 이벤트는 포커스가 필드를 벗어날 때만 발생한다. `submit` 이벤트는 버튼이 아니라 `form` 요소에서 받는다. Enter 키로 제출하는 경우도 같은 경로를 거치기 때문이다. `event.preventDefault()`는 폼 제출의 기본 동작인 페이지 이동을 막는다. 미션이 요구한 네 가지 이벤트(`click`, `submit`, `scroll`, `input`)가 각각 어디에 있는지는 이 절과 평가 설명서 §2.4에 정리되어 있다.

**HTML에 `onclick` 속성이 없다.** `index.html`의 모든 버튼(`:27`, `:32`, `:294`, `:318`)은 `id`와 클래스만 갖는다. 동작은 전부 JavaScript 파일에서 `addEventListener`로 연결했다.

### 흔한 오해와 대안 비교

| 대안 | 문제점 |
| --- | --- |
| `<head>`에 `defer` 없이 스크립트 배치 | 요소를 찾으면 `null`이 되어 `Cannot read properties of null` 오류가 난다. `DOMContentLoaded`로 감싸면 되지만 `defer`가 더 단순하다 |
| `async` 사용 | 일곱 파일의 실행 순서가 보장되지 않는다. `theme.js`보다 `github.js`가 먼저 실행될 수 있다 |
| `onclick="toggleMenu()"` 속성 | 전역 함수가 필요하고, 처리기를 하나만 달 수 있으며, 콘텐츠 보안 정책에 걸릴 수 있다. HTML과 동작이 뒤섞인다 |
| 필터 버튼마다 `addEventListener` | 다시 그릴 때마다 재등록해야 한다. 한 번이라도 빠뜨리면 버튼이 눌리지 않는다 |
| 스크롤 처리기에서 `getBoundingClientRect()`로 노출 판정 | 스크롤할 때마다 레이아웃 계산이 일어난다. `IntersectionObserver`가 이 용도로 만들어진 API다 |
| `getElementsByClassName` + `for` 반복문 | 살아 있는 컬렉션이라 순회 중에 DOM을 바꾸면 결과가 흔들린다. `forEach`도 쓸 수 없다 |
| 스크롤 처리기에 `passive` 옵션 없음 | 브라우저가 처리기 실행이 끝날 때까지 스크롤을 미룬다 |

### 예상 추가 질문과 답

- **Q. `querySelector`와 `getElementById` 중 무엇을 써야 하나?** — `id`가 있으면 `getElementById`가 더 빠르고 의도도 분명하다. 속성이나 자식 관계 같은 선택자가 필요하거나 여러 요소를 한 번에 잡을 때는 `querySelector(All)`을 쓴다.
- **Q. 처리기 안에서 `this`를 쓰지 않는 이유는?** — 화살표 함수를 쓰기 때문에 `this`가 요소를 가리키지 않는다. 대신 클로저로 잡아 둔 상수(`navMenu`)나 `event.target`을 쓴다(Q4 참조).
- **Q. `removeEventListener`는 왜 없나?** — 이 페이지의 요소들은 페이지가 살아 있는 동안 계속 존재하므로 해제할 필요가 없다. 재시도 버튼처럼 동적으로 만든 요소는 `innerHTML` 교체와 함께 정리된다.
- **Q. `keydown`을 `document`에 달면 입력창에서 Esc를 눌러도 메뉴가 닫히나?** — 그렇다. 다만 조건이 "메뉴가 열려 있을 때"뿐이므로, 메뉴가 닫힌 상태에서 입력 중에 Esc를 눌러도 아무 일도 일어나지 않는다.
- **Q. `classList.toggle`의 두 번째 인수는 무엇인가?** — 강제 플래그다. `true`면 무조건 추가, `false`면 무조건 제거한다. 조건식을 넘기면 `if/else` 없이 상태를 반영할 수 있다.

---

## Q4. 화살표 함수·구조분해·배열 메서드가 왜 필요하고 어떻게 썼는지

### 한 줄 답변

화살표 함수는 짧은 콜백을 간결하게 쓸 수 있고 자기만의 `this`를 만들지 않으므로 이벤트 처리기와 `map` 콜백에 알맞다. 구조분해 할당은 GitHub 응답처럼 큰 객체에서 필요한 필드만 꺼내고 이름까지 바꿔 받을 때 쓴다. `map`은 배열을 새 배열로 바꾸는 변환(저장소 목록 → HTML 카드 목록)에, `filter`는 조건에 맞는 항목 선별(fork 제외, 언어 필터)에, `forEach`는 반환값이 필요 없는 반복 작업(처리기 등록)에 썼다. 세 메서드 모두 원본 배열을 바꾸지 않는다.

### 개념 설명

**화살표 함수.** `function` 키워드로 만든 함수는 호출 방식에 따라 `this`가 정해진다. 메서드로 호출하면 그 객체, 이벤트 처리기로 호출되면 요소, 그냥 호출하면 `undefined` 또는 `window`가 된다. 화살표 함수는 `this`, `arguments`, `new.target`을 따로 갖지 않고 바깥 스코프의 것을 그대로 쓴다. 콜백 안에서 `this`가 무엇인지 따질 필요가 없어진다. 본문이 표현식 하나면 중괄호와 `return`을 생략할 수 있어 `(x) => x * 2` 같은 한 줄 콜백을 쓰기 편하다. 대신 생성자로 쓸 수 없고, 프로토타입 메서드에는 적합하지 않다.

**구조분해 할당.** 객체나 배열의 일부를 변수로 바로 꺼내는 문법이다.

| 형태 | 예 | 의미 |
| --- | --- | --- |
| 객체 | `const { name } = repo` | `repo.name`을 `name` 변수에 |
| 이름 변경 | `const { html_url: url } = repo` | `repo.html_url`을 `url` 변수에 |
| 기본값 | `const { language = '—' } = repo` | 값이 없으면 `'—'` |
| 매개변수 | `({ key }) => …` | 인수 객체에서 `key`만 |
| 배열 | `const [first, second] = list` | 위치로 꺼냄 |

함수 매개변수 자리에서 구조분해를 쓰면, 그 함수가 인수의 어떤 필드를 사용하는지 함수 선언부에 드러난다.

**배열 메서드의 반환값과 원본 보존.**

| 메서드 | 반환값 | 원본 변경 | 용도 |
| --- | --- | --- | --- |
| `map` | 같은 길이의 새 배열 | 없음 | 변환 |
| `filter` | 조건에 맞는 항목만 담은 새 배열 | 없음 | 선별 |
| `forEach` | `undefined` | 없음(콜백이 바꾸지 않는 한) | 반복 작업 |
| `reduce` | 누적값 하나 | 없음 | 집계 |
| `some` / `find` | 불리언 / 첫 번째 일치 항목 | 없음 | 조건 검사·검색 |

이 메서드들은 원본 배열을 그대로 두고 새 값을 만든다. 상태 객체가 들고 있는 배열을 `map`이나 `filter`로 가공해도 상태는 바뀌지 않고, 같은 입력에서는 매번 같은 결과가 나온다. `push`, `splice`, `sort`처럼 원본을 바꾸는 메서드와 구분해서 써야 한다.

### 이 프로젝트에서의 적용 — 소스 인용

**매개변수 구조분해와 이름 변경으로 API 응답을 카드로 바꾼다.** `js/github.js:75-78`

```js
const createRepoCard = ({ name, description, html_url: url, language, stargazers_count: stars, updated_at: updatedAt }) => {
  const languageLabel = language ?? '—';
  const languageColor = LANGUAGE_COLORS[language] ?? '';
  const hasDescription = Boolean(description);
```

GitHub API가 돌려주는 저장소 객체에는 필드가 90개가 넘는다. 함수 선언부에서 여섯 개만 꺼내면 이 함수가 어떤 필드에 의존하는지 한눈에 보이고, 본문에서 `repo.stargazers_count`를 반복해 쓰지 않아도 된다. API의 snake_case 이름(`html_url`)을 이 코드의 camelCase 이름(`url`)으로 바꾸는 일도 구조분해 한 줄로 끝난다. `??`(nullish 병합 연산자)는 값이 `null`이나 `undefined`일 때만 대체값을 쓴다. GitHub는 언어를 감지하지 못한 저장소에 `null`을 주므로 이 경우 `'—'`로 표시된다. `||`와 달리 빈 문자열이나 `0`은 그대로 둔다.

**`map`으로 변환하고 `join`으로 합친다.** `js/github.js:152-156`

```js
  const shownRepos = visibleRepos.slice(0, MAX_VISIBLE_REPOS);
  const filterLabel = state.filter === FILTER_ALL ? '전체' : state.filter;

  projectsStatus.innerHTML = '';
  projectsGrid.innerHTML = shownRepos.map(createRepoCard).join('');
```

저장소 객체 배열이 `map(createRepoCard)`를 거쳐 HTML 문자열 배열이 되고, `join('')`을 거쳐 문자열 하나가 된다. `createRepoCard`는 저장소 객체 하나를 받아 문자열을 돌려주는 함수이므로 `map`에 함수 참조를 그대로 넘겼다. `.join('')`을 빼면 배열이 문자열로 바뀔 때 항목 사이에 쉼표가 들어간다. `slice`는 원본을 자르지 않고 앞에서 9개를 복사한다.

**`filter`로 항목을 골라낸다 — fork 제외와 언어 필터.** `js/github.js:194-197`

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

첫 번째 `filter`는 데이터가 도착했을 때 한 번 실행된다. 다른 사람의 저장소를 복제한 fork는 본인 작업이 아니므로 상태에 넣기 전에 걸러낸다. 두 번째 `filter`는 화면을 그릴 때마다 실행된다. 전체 목록인 `state.repos`는 그대로 두고, 현재 필터에 맞는 부분 집합을 새로 만든다. 원본이 남아 있으므로 필터를 바꾼 뒤 '전체'로 돌아갈 수 있다. 콜백의 `({ fork })`와 `({ language })`는 매개변수 구조분해다.

**`map`, `filter(Boolean)`, `Set`, 스프레드를 이어서 언어 목록을 뽑는다.** `js/github.js:50-53`

```js
const getLanguages = (repos) => {
  const languages = repos.map(({ language }) => language).filter(Boolean);
  return [...new Set(languages)].sort();
};
```

네 단계로 이루어진다. `map`으로 언어 이름만 뽑고(`['HTML', null, 'TypeScript', 'HTML', …]`), `filter(Boolean)`으로 `null`을 버리고, `new Set()`으로 중복을 없앤 뒤, 스프레드 문법 `[...]`로 다시 배열로 만들어 `sort()`한다. `Boolean`을 콜백으로 넘기면 각 값이 참인지 거짓인지로 판정되므로 `x => x != null`과 같은 효과가 난다. `sort()`는 원본 배열을 정렬하지만, 여기서 원본은 방금 만든 임시 배열이므로 문제가 없다.

**`Array.from`으로 정해진 개수만큼 만든다.** `js/github.js:114`

```js
  projectsGrid.innerHTML = Array.from({ length: SKELETON_COUNT }, createSkeletonCard).join('');
```

스켈레톤 카드 3개를 `for` 반복문 없이 만든다. `Array.from`의 두 번째 인수는 매핑 함수이므로 `[undefined, undefined, undefined].map(createSkeletonCard)`와 같은 결과가 나온다.

**스프레드로 기존 객체를 복사하면서 한 필드만 바꾼다.** `js/contactForm.js:51-58`

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

`{ ...formState.errors, [name]: … }`는 기존 에러 객체를 얕게 복사한 뒤, 현재 필드에 해당하는 키(`[name]`, 계산된 속성명)만 새 값으로 덮어쓴다. `formState.errors.name = …`처럼 직접 대입하지 않는 이유는 상태를 수정하지 않고 교체하는 원칙을 지키기 위해서다(Q6 참조). `fields.forEach`는 세 필드 각각에 처리기를 등록하는 작업이고 반환값이 필요 없으므로 `forEach`를 썼다. `validators[name]`은 객체를 함수 조회표로 쓴 것이다. `if (name === 'email') …` 같은 분기를 두지 않아도 된다.

**`Object.fromEntries`, `some`, `find`로 제출 시 일괄 검증한다.** `js/contactForm.js:63-69`

```js
  const errors = Object.fromEntries(fields.map(({ name, input }) => [name, validators[name](input.value)]));
  const hasError = Object.values(errors).some((message) => message !== '');

  if (hasError) {
    setFormState({ errors, isSubmitted: false });
    const firstInvalid = fields.find(({ name }) => errors[name] !== '');
    firstInvalid.input.focus();
```

`fields.map(…)`으로 `[['name', ''], ['email', '올바른…'], ['message', '']]` 같은 키-값 쌍 배열을 만들고, `Object.fromEntries`로 `{ name: '', email: '…', message: '' }` 객체로 바꾼다. `Object.values(errors).some(…)`은 비어 있지 않은 메시지가 하나라도 있으면 `true`를 돌려준다. `fields.find(…)`는 첫 번째 오류 필드를 찾고, 그 입력창에 포커스를 준다. `some`은 조건에 맞는 항목을 만나는 순간 검사를 멈추고, `find`는 항목 자체를 돌려준다.

**이벤트 객체에서 필요한 속성만 구조분해로 꺼낸다.** `js/nav.js:24`, `js/theme.js:31-35`

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

`KeyboardEvent`에서는 `key` 속성만, `MediaQueryListEvent`에서는 `matches` 속성만 쓴다. 매개변수에서 바로 꺼내면 본문에서 `event.key`를 반복해 쓰지 않아도 되고, 함수가 이벤트의 어떤 정보를 쓰는지 선언부에 드러난다.

**화살표 함수와 `function` 선언을 구분해서 썼다.** `js/github.js:34-37`, `:160-166`, `:184`

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

34행의 `setState`는 160행의 `render`를 호출한다. 호출되는 함수가 호출하는 함수보다 뒤에 선언되어 있는 셈이다. `render`와 `loadRepos`를 `const` 화살표 함수로 선언하면 일시적 사각지대(temporal dead zone) 규칙 때문에 선언 전 참조가 오류를 일으키지만, `function` 선언은 호이스팅되므로 파일 어디서든 참조할 수 있다. 그래서 여러 곳에서 호출되는 진입점은 `function`으로, 나머지는 `const` 화살표 함수로 통일했다. `this` 때문이 아니라 호이스팅 때문에 내린 선택이다.

**`textContent`와 `innerHTML`을 구분하고, 외부 데이터는 이스케이프한다.** `js/github.js:41-46`

```js
const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
```

템플릿 리터럴로 HTML을 만들어 `innerHTML`에 넣을 때, 저장소 이름이나 설명처럼 외부에서 온 데이터는 반드시 이스케이프한다. 설명에 `<img onerror=…>` 같은 문자열이 들어 있으면 그대로 실행되기 때문이다(XSS). `replaceAll`을 이어 부르는 부분은 메서드 체이닝의 예다. 각 호출은 원래 문자열을 바꾸지 않고 새 문자열을 돌려준다. 순수 텍스트만 넣는 곳(`projectsCount`, 에러 메시지 `p`)에는 `textContent`를 써서 이스케이프 없이 안전하게 처리했다(`js/github.js:157`, `js/contactForm.js:41`).

### 흔한 오해와 대안 비교

| 대안 | 문제점 |
| --- | --- |
| `forEach` 안에서 `result.push(...)`로 새 배열 만들기 | `map`이 바로 그 일을 한다. `forEach`와 `push` 조합은 의도가 흐려지고 바깥 배열을 바꾼다 |
| `for` 반복문으로 필터링 | 동작은 같지만 어떤 항목을 남기는지가 조건문 안에 묻힌다. `filter(pred)`는 조건이 이름에 드러난다 |
| `function` 콜백 안에서 `this` 사용 | 이벤트 처리기에서는 요소를, `map` 콜백에서는 `undefined`를 가리킨다. 화살표 함수를 쓰면 이 문제가 없다 |
| `repo.html_url`, `repo.stargazers_count`를 본문에서 반복 | 읽기 어렵고 오타 위험이 있다. 구조분해로 한 번에 이름을 붙인다 |
| 상태 배열에 `arr.sort()` 직접 호출 | 원본이 정렬되어 다른 곳에서 가정한 순서가 깨진다. 복사본(`[...arr].sort()`)을 정렬한다 |
| `indexOf`로 언어 목록 중복 제거 | 시간 복잡도가 O(n²)다. `Set`은 O(n)이고 의도도 분명하다 |
| API 문자열을 `innerHTML`에 그대로 삽입 | XSS 위험이 있다. `escapeHtml`을 거치거나 `textContent`를 쓴다 |
| `var` | 함수 스코프와 호이스팅 때문에 반복문 변수가 공유된다. `const`를 기본으로 쓰고 재할당이 필요할 때만 `let`을 쓴다(`js/typing.js:27`의 `roleIndex`가 유일하다) |

### 예상 추가 질문과 답

- **Q. 화살표 함수를 쓰면 안 되는 경우는?** — 객체 메서드에서 `this`로 자기 객체를 참조해야 할 때, 생성자 함수, `arguments` 객체가 필요할 때다. 이 프로젝트에는 그런 경우가 없어서 이벤트 처리기, 콜백, 유틸리티 함수를 전부 화살표 함수로 썼다.
- **Q. `??`와 `||`의 차이는?** — `||`는 거짓으로 평가되는 값(`0`, `''`, `false`)을 전부 대체하고, `??`는 `null`과 `undefined`만 대체한다. `stars`가 `0`일 때 `stars || '—'`를 쓰면 별 개수 0이 `'—'`로 잘못 표시된다.
- **Q. `map`을 반복 작업용으로 써도 되나?** — 동작은 하지만 반환된 배열을 버리게 되어 코드를 읽는 사람이 혼란스럽다. 반환값이 필요 없으면 `forEach`를 쓴다.
- **Q. 구조분해에서 없는 키를 꺼내면?** — `undefined`가 된다. 오류가 나지 않으므로 기본값(`= '—'`)이나 `??`로 처리한다. 이 코드는 `language ?? '—'`로 처리했다.
- **Q. `Object.assign(state, patch)`는 원본을 바꾸지 않는다는 원칙에 어긋나지 않나?** — 상태 객체 자체는 바꾼다. 대신 상태 안의 배열은 바꾸지 않고 `filter`나 `slice`로 새 배열을 만들어 쓰며, 상태를 바꾸는 경로를 `setState` 하나로 제한했다. React처럼 상태 객체를 통째로 교체하는 방식이 더 엄격하지만, 이 규모에서는 변경 경로를 한 곳으로 모으는 것으로 충분하다고 판단했다.

---
## Q5. fetch와 async/await로 데이터를 가져오고 로딩/성공/실패를 UI로 표현한 방법

### 한 줄 답변

`loadRepos()`는 요청을 보내기 전에 먼저 상태를 `loading`으로 바꿔 스피너와 스켈레톤 카드를 표시한다. 그다음 `await fetch()`로 응답을 기다리고, `response.ok`가 거짓이면 예외를 직접 던진다. `catch` 블록에서는 네트워크 오류(`TypeError`)와 HTTP 오류를 구분해 서로 다른 안내 문구를 만든 뒤 상태를 `error`로 바꾼다. 응답이 정상이면 상태를 `success`로 바꾸고 데이터를 저장한다. 렌더 함수는 결과가 0건일 때 빈 화면으로 분기한다. 네 가지 화면은 모두 `render()` 한 함수가 `state.status` 값에 따라 그린다.

### 개념 설명

**Promise와 async/await.** `fetch()`를 호출하면 Promise가 즉시 반환되고 네트워크 요청은 뒤에서 진행된다. `await`를 만나면 해당 `async` 함수의 실행만 멈추고 제어권은 이벤트 루프로 돌아가므로 페이지는 계속 반응한다. Promise가 이행(fulfilled)되면 `await`는 결과값을 돌려주고, 거부(rejected)되면 그 자리에서 예외가 발생해 `catch`로 넘어간다. `.then().catch()` 체인과 동작은 같지만 코드가 위에서 아래로 읽힌다.

**fetch는 HTTP 오류를 거부로 처리하지 않는다.** 서버가 404나 403을 돌려주더라도 응답 자체는 도착했으므로 Promise는 이행된다. 이때 `response.ok`가 `false`일 뿐이다. `fetch`의 Promise가 거부되는 경우는 요청 자체가 실패했을 때다. DNS 조회 실패, 오프라인, CORS 차단이 여기에 해당하며 이때는 `TypeError`가 발생한다. HTTP 오류를 `catch`에서 처리하려면 개발자가 `!response.ok`일 때 직접 예외를 던져야 한다.

**오류 분류.** `catch`에 들어온 `error`가 `TypeError`이면 네트워크 계층의 문제이고, 개발자가 `throw new Error(...)`로 던진 객체이면 HTTP 계층의 문제다. `instanceof`로 둘을 구분하면 사용자에게 "인터넷 연결을 확인하세요"와 "요청 한도를 넘었습니다"를 따로 안내할 수 있다.

**상태 머신 4상태.** 화면이 가질 수 있는 상태를 `idle → loading → success | error`로 정해 두면 "로딩 중인데 이전 카드가 남아 있는" 화면이나 "에러인데 스피너가 도는" 화면이 나올 수 없다. 빈 상태(empty)는 데이터가 도착했지만 0건인 경우이므로 `success`에 속한다. 그래서 별도 상태값을 두지 않고 렌더 단계에서 분기한다.

**재시도.** 에러 화면의 버튼은 `loadRepos`를 다시 호출한다. 그러면 `loading`부터 같은 경로를 다시 밟는다. 상태 머신이 있으면 재시도 코드와 최초 호출 코드가 같아진다.

**요청 한도.** GitHub REST API는 인증 없이 호출하면 IP당 시간당 60회로 제한된다. 한도를 넘으면 403 응답이 오는데, 이를 "권한 없음"으로 안내하면 사용자가 원인을 알 수 없다. "한도 초과, 잠시 후 재시도"로 안내해야 한다.

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

`status`는 `'idle' | 'loading' | 'success' | 'error'` 네 값 중 하나를 가진다. `repos`에는 성공 시 데이터가, `errorMessage`에는 실패 시 안내 문구가, `filter`에는 사용자가 고른 언어가 들어간다. Projects 섹션에 나타날 수 있는 모든 화면은 이 네 값으로 결정된다. `setState`는 패치를 상태에 병합한 직후 `render()`를 호출하므로, 상태를 바꾼 뒤 렌더링을 빠뜨리는 일이 생기지 않는다.

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

줄 단위로 읽으면 다음과 같다.

1. `setState({ status: 'loading', errorMessage: '' })` — `fetch`를 호출하기 전에 로딩 화면을 먼저 그린다. 재시도인 경우 이전 에러 문구도 이 시점에 비운다.
2. `await fetch(GITHUB_API_URL)` — 응답 헤더가 도착할 때까지 이 함수만 대기한다. CSS로 만든 스피너 애니메이션은 그동안 계속 돈다.
3. `if (!response.ok) throw …` — 403, 404, 500 응답을 `catch`로 보낸다. 안내 문구는 `describeHttpError`가 상태 코드별로 만든다.
4. `await response.json()` — 본문 파싱도 비동기로 진행되고 실패할 수 있으므로 `try` 안에 둔다.
5. `data.filter(({ fork }) => !fork)` — 상태에 저장하기 전에 포크 저장소를 걸러낸다.
6. `setState({ status: 'success', repos: ownRepos })` — 성공 화면을 그린다.
7. `catch` — `TypeError`이면 네트워크 안내 문구를, 그 외에는 앞에서 던진 `Error`의 `message`를 사용자에게 보여준다. `console.error`로는 개발자가 볼 원인을 남긴다.
8. 마지막 줄 `loadRepos()` — 파일이 실행되는 시점, 곧 `defer`로 DOM 파싱이 끝난 직후에 첫 호출이 일어난다.

**상태 코드별 안내 문구.** `js/github.js:178-182`

```js
const describeHttpError = (status) => {
  if (status === 403) return 'GitHub API 요청 한도(시간당 60회)를 넘었습니다. 잠시 후 다시 시도해주세요.';
  if (status === 404) return `GitHub 사용자 '${GITHUB_USERNAME}'를 찾을 수 없습니다.`;
  return `서버가 오류를 반환했습니다. (HTTP ${status})`;
};
```

미션이 명시한 403 요청 한도 상황을 첫 번째 분기에서 처리한다. 404는 `GITHUB_USERNAME`을 잘못 적었을 때 나오는 응답이다. 개발 중 가장 자주 생기는 실수라서 화면에서 바로 알 수 있게 했다.

**렌더 분기.** `js/github.js:160-166`

```js
function render() {
  renderFilters();

  if (state.status === 'loading') renderLoading();
  else if (state.status === 'error') renderError();
  else if (state.status === 'success') renderSuccess();
}
```

`render`는 인수를 받지 않고 `state`만 읽는다. 어떤 이벤트가 호출하든 같은 상태에서는 같은 화면이 나온다. `idle`일 때는 아무것도 그리지 않지만, 파일이 실행되자마자 `loadRepos()`가 상태를 `loading`으로 바꾸므로 사용자가 `idle` 화면을 볼 일은 없다.

**로딩 화면 — 스피너와 스켈레톤.** `js/github.js:112-116`

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

스피너는 위쪽 테두리만 강조색으로 칠한 원을 회전시킨 것이다. 스켈레톤은 카드가 들어올 자리에 반짝이는 막대를 미리 놓아 곧 내용이 채워진다는 사실을 알린다. 두 효과 모두 JS 타이머가 아니라 CSS `animation`으로 구현했으므로 `await` 대기 중에도 멈추지 않는다. 스피너 요소에는 `aria-hidden="true"`를 주어 스크린리더가 읽지 않게 했고, "불러오는 중…" 텍스트는 `#projectsStatus`의 `aria-live="polite"`(`index.html:250`)를 통해 낭독된다. 스켈레톤 카드에도 `aria-hidden`이 붙어 있다(`js/github.js:67`).

**에러 화면 — 원인 안내와 재시도.** (`js/github.js:118-130`, Q3에서 인용) 점선 테두리 패널(`css/style.css:882-884`) 안에 아이콘, "프로젝트를 불러올 수 없습니다." 제목, `state.errorMessage`, 재시도 버튼이 들어간다. 안내 문구는 `escapeHtml`을 거쳐 삽입된다. `error.message`에 사용자명 같은 외부 문자열이 포함될 수 있기 때문이다.

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

필터 결과가 0건인 경우와 저장소가 하나도 없는 경우는 화면은 같지만 사용자가 다음에 할 행동이 다르다. `state.filter` 값을 보고 안내 문구를 바꾼다.

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

`empty`를 `status` 값으로 두지 않은 이유가 이 함수에 있다. 데이터는 정상적으로 도착했고(`success`), 현재 필터에서 보여줄 항목이 없을 뿐이다. 필터를 바꾸면 카드가 다시 나타나야 하므로 `repos`는 그대로 두고 렌더 단계에서만 분기한다. 세 영역(`projectsStatus`, `projectsGrid`, `projectsCount`)을 매번 모두 다시 설정하는 점도 중요하다. 이렇게 해야 이전 상태의 에러 패널 같은 잔재가 남지 않는다.

**필터 버튼도 상태에서 계산한다.** `js/github.js:103-110`

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

로딩 중이거나 에러일 때는 필터 바를 비운다. 성공 상태에서만 응답에 실제로 들어 있는 언어로 버튼을 만든다. 언어 목록을 코드에 미리 적어 두지 않았다.

**첫 화면이 그려지는 순서.** `index.html:249-252`

```html
        <div class="filter-bar" id="filterBar" role="group" aria-label="언어별 필터"></div>
        <div class="projects-status" id="projectsStatus" role="status" aria-live="polite"></div>
        <div class="projects-grid" id="projectsGrid"></div>
        <p class="projects-count" id="projectsCount"></p>
```

HTML에는 빈 컨테이너 네 개만 있다. HTML 파싱이 끝나면 `github.js`가 실행되어 `loadRepos()`를 호출하고, 로딩 화면(스피너와 스켈레톤)이 그려진다. 수백 밀리초 뒤 응답이 도착하면 성공 화면(필터, 카드, 개수)으로 바뀐다. 사용자가 빈 화면을 보는 시간은 거의 없다.

### 흔한 오해와 대안 비교

| 대안 | 무엇이 문제인가 |
| --- | --- |
| `!response.ok` 검사 없이 `response.json()` 호출 | 403·404 응답 본문(`{"message": "Not Found"}`)은 배열이 아니므로 `data.filter`에서 다른 오류가 난다. 원인을 찾기 어렵다 |
| `fetch().then(r => r.json()).then(render).catch(...)` 체인 | 동작은 같지만 `ok` 검사와 로딩 상태 설정이 체인 사이에 끼어 읽기 어렵다. `await`는 위에서 아래로 읽힌다 |
| 로딩 상태 없이 `fetch` 후 바로 카드 삽입 | 느린 네트워크에서 빈 화면이 오래 남는다. 사용자는 고장으로 받아들인다 |
| 에러 시 `alert()` | 모달이 흐름을 막고, 재시도 경로가 없으며, 스타일을 입힐 수 없다 |
| 모든 오류를 "오류가 발생했습니다"로 통일 | 403(기다리면 됨), 오프라인(연결 확인), 404(설정 오류)는 대처 방법이 다르다 |
| `empty`를 별도 status로 관리 | 필터를 바꿀 때 `success`로 되돌리는 로직이 추가로 필요하다. "데이터 있음 + 필터 결과 0건"을 렌더 단계에서 분기하는 편이 단순하다 |
| `response.json()`을 `try` 밖에 두기 | 잘린 응답 등 JSON 파싱 실패를 잡지 못한다 |
| 재시도 버튼에서 `location.reload()` 호출 | 페이지 전체가 다시 로드된다. 스크롤 위치와 필터 상태가 사라진다 |

### 예상 추가 질문과 답

- **Q. `await`가 페이지를 멈추지 않는다는 것을 어떻게 확인하나?** — `await` 대기 중에도 CSS 스피너가 돌고 다크 모드 버튼이 눌린다. `await`는 이 `async` 함수의 나머지 부분을 마이크로태스크로 미룰 뿐이다.
- **Q. 사용자가 재시도 버튼을 연속으로 누르면?** — 요청이 여러 개 나가고 마지막 응답이 화면에 남는다. 이 규모에서는 문제가 되지 않지만, 실무에서는 `AbortController`로 이전 요청을 취소하거나 `loading` 중에는 버튼을 비활성화한다.
- **Q. 응답을 캐시하지 않은 이유는?** — 미션 범위 밖이고 데이터가 작다. 요청 한도가 걱정된다면 `sessionStorage`에 응답과 시각을 저장해 재사용할 수 있다(§7 개선 여지).
- **Q. `console.error`는 배포 전에 지워야 하나?** — 사용자에게는 보이지 않고 개발자 도구에서만 확인된다. 실패 원인(상태 코드, 스택)을 남기는 유일한 곳이다. 로깅 서비스가 있다면 그쪽으로 보내는 편이 좋다.
- **Q. `per_page=100`인데 저장소가 100개를 넘으면?** — 첫 페이지만 받는다. `Link` 헤더의 `rel="next"`를 따라가는 페이지 처리가 필요하다. 현재 계정은 33개라 해당하지 않는다.

---

## Q6. 이벤트 → 상태 변경 → DOM 업데이트가 어떻게 연결되는지 (React의 기초)

### 한 줄 답변

이 프로젝트의 동적 기능은 모두 같은 구조를 따른다. 이벤트 리스너는 DOM을 직접 고치지 않고 상태만 바꾼다(`setState`, `setFormState`, `applyTheme`). 상태를 바꾸는 함수는 곧바로 렌더 함수를 호출하고, 렌더 함수는 현재 상태만 읽어 화면을 다시 만든다. React의 `useState`는 "setter 호출이 렌더링을 일으킨다"는 이 구조를 라이브러리가 대신 처리하도록 만든 것이고, 컴포넌트 함수가 `render()`에 해당한다.

### 개념 설명

**단방향 데이터 흐름(one-way data flow).** 이벤트 → 상태 → 화면 순서로만 흐른다. 화면이 상태를 바꾸지 않고(사용자 행동은 이벤트로 들어온다), 상태를 거치지 않고 화면을 바꾸는 코드도 없다. 그러면 "지금 화면이 왜 이렇게 보이는가"라는 질문의 답이 항상 "상태가 이렇기 때문"이 되어, 디버깅이 상태 확인으로 끝난다.

**같은 정보는 한 곳에만 저장한다.** 같은 정보를 두 곳(예: JS 변수와 DOM 속성)에 두면 언젠가 둘이 어긋난다. 이 프로젝트에서 "메뉴가 열렸는가"는 `navMenu`의 `is-open` 클래스 하나로, "테마"는 `html[data-theme]` 하나로, "저장소 목록"은 `state.repos` 하나로 결정된다. DOM 자체를 저장소로 쓰는 경우(테마, 메뉴)와 JS 객체를 쓰는 경우(API, 폼)가 섞여 있지만, 어느 쪽이든 한 곳이다.

**파생 값은 저장하지 않고 계산한다.** "현재 필터에 맞는 저장소 목록"을 상태에 저장하면 필터나 원본이 바뀔 때마다 갱신해야 한다. 렌더링 시점에 `getVisibleRepos()`로 계산하면 항상 최신 값이 된다. 계산 비용이 문제 되지 않는 규모라면 이 방식이 낫다.

**전체 재렌더링과 최소 갱신.** 이 코드는 `innerHTML`로 영역을 통째로 다시 그린다. 단순하고 상태와 화면이 어긋날 일이 없지만, 큰 DOM에서는 비용이 크고 입력 포커스나 스크롤 위치 같은 DOM 내부 상태가 사라진다. React는 "통째로 다시 그리는 것처럼 코드를 쓰되, 실제로는 이전 결과와 비교해 바뀐 부분만 DOM에 반영"한다. 이를 재조정(reconciliation)이라 부른다. React가 추가로 제공하는 것은 이 최소 갱신이고, 상태에서 화면을 만드는 구조 자체는 이 코드와 같다.

**React와의 대응.**

| 이 프로젝트 | React | 비고 |
| --- | --- | --- |
| `const state = { status, repos, filter }` | `const [status, setStatus] = useState('idle')` 등 | 상태 선언 |
| `setState(patch)` → `render()` | `setStatus(next)` → 자동 리렌더 | React는 렌더 호출을 숨긴다 |
| `function render() { … innerHTML = … }` | `function Projects() { return <…/> }` | 컴포넌트 = 렌더 함수 |
| `getVisibleRepos()` | 렌더 중 `repos.filter(...)` 또는 `useMemo` | 파생 값 |
| `filterBar.addEventListener('click', …)` | `<button onClick={() => setFilter(lang)}>` | 이벤트 → setter |
| `innerHTML` 통째 교체 | 가상 DOM 비교 → 최소 패치 | React가 추가로 하는 일 |
| `Object.assign(state, patch)` | 새 객체로 교체(`setX(prev => ({...prev, ...}))`) | React는 불변 교체를 요구한다 |

### 이 프로젝트에서의 적용 — 소스 인용

**흐름 1 — 다크 모드: 상태는 DOM 속성, 렌더링은 CSS.** `js/theme.js:9-13`, `:23-29`

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

클릭 리스너는 현재 상태(`data-theme`)를 읽고 다음 상태를 계산해 `applyTheme`에 넘긴다. 배경색이나 글자색을 바꾸는 코드는 한 줄도 없다. 실제 색 변경은 CSS가 맡는다. `css/style.css:61-85`

```css
[data-theme='dark'] {
  --color-bg: #15181f;
  --color-surface: #1d212b;
  --color-text: #f0ece4;
```

토큰을 참조하는 수백 개의 규칙이 속성 하나에 따라 한꺼번에 바뀐다. 아이콘 전환도 같은 속성을 기준으로 한다(`css/style.css:379-389`). "상태 → 렌더링" 구조에서 렌더러 역할을 JS 대신 CSS 캐스케이드가 맡은 경우다. 초기 상태는 `readInitialTheme()`(`js/theme.js:15-19`)가 저장값, 시스템 설정 순으로 결정하고, 파일이 실행되는 즉시 `applyTheme(readInitialTheme())`(`:21`)로 적용된다.

**흐름 2 — GitHub API: `setState` → `render`.** (`js/github.js:27-37`, `:160-166`, Q5에서 인용) 상태 객체 하나, 변경 함수 하나, 렌더 함수 하나로 구성된다. `loadRepos`는 `setState`를 세 번(`loading`, 그리고 `success` 또는 `error`) 호출할 뿐 DOM을 건드리지 않는다. `render`는 인수 없이 `state`만 읽는다. 재시도 버튼도 `loadRepos`를 다시 호출하는 것이 전부다.

**흐름 3 — 언어 필터: 파생 값을 다시 계산한다.** `js/github.js:55-56`, `:170-174`

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

버튼을 클릭하면 `state.filter`만 바뀐다. 이어서 `render()`가 호출되고, `renderFilters()`가 활성 버튼을 다시 그리며(`is-active`와 `aria-pressed`는 `state.filter === value` 비교로 정해진다, `js/github.js:60-64`), `renderSuccess()`가 `getVisibleRepos()`로 카드 목록을 다시 계산한다. "현재 보이는 목록"은 어디에도 저장되지 않는다. 필터 버튼 자체도 상태에서 만들어지므로, 클릭된 버튼을 찾아 클래스를 붙이는 코드가 따로 없다.

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

어떤 필드에 오류가 있는지는 `errors[name] !== ''` 하나로 판정한다. `renderField`는 이 조건 하나에서 테두리 클래스, `aria-invalid`, 안내 문구 세 가지를 만든다. `input` 리스너(`:51-58`)와 `submit` 리스너(`:60-75`)는 검증 결과를 `errors` 객체로 만들어 `setFormState`에 넘길 뿐, 클래스나 텍스트를 직접 바꾸지 않는다. 덕분에 "입력 중 오류 해제"와 "제출 시 일괄 표시"가 같은 렌더 함수를 공유한다. `contactForm.reset()`(`:73`)을 먼저 호출한 뒤 `setFormState({ errors, isSubmitted: true })`를 호출하는 순서에도 이유가 있다. DOM을 초기화한 다음 상태를 렌더링해야 성공 메시지가 남는다.

**흐름 5 — 메뉴 열림: 동기화 함수가 렌더 함수 역할을 한다.** (`js/nav.js:8-13`, Q3에서 인용) `setMenuOpen(isOpen)`은 불리언 값 하나로 네 가지 DOM 변화를 만든다. 여는 이벤트(버튼 클릭)와 닫는 이벤트(링크 클릭, Esc)가 세 곳에 있어도 렌더 경로는 하나다. 상태는 `navMenu.classList`에 저장되고 `setMenuOpen`이 렌더 함수에 해당한다.

**React로 옮기면 이런 모양이 된다 (설명용 가상 코드).** 언어 필터 흐름을 React로 쓰면 다음과 같다. 이 코드는 저장소에 없으며, 대응 관계를 보이기 위한 예시다.

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

`setFilter(lang)`를 호출하면 React가 `Projects()`를 다시 실행한다. 이 프로젝트에서 `setState` 끝에 적었던 `render()` 호출 한 줄이 사라진 셈이다. `visibleRepos`를 함수 본문에서 매번 계산하는 것은 `getVisibleRepos()`와 같고, `if` 분기 순서도 `render()`에서 `renderSuccess()`로 이어지는 분기와 같다. 다른 점은 두 가지다. 상태를 `Object.assign`으로 수정하지 않고 setter로 교체한다는 점, 그리고 반환한 JSX를 React가 이전 결과와 비교해 바뀐 DOM만 고친다는 점이다.

### 흔한 오해와 대안 비교

| 대안 | 무엇이 문제인가 |
| --- | --- |
| 리스너에서 `projectsGrid.innerHTML = …`를 직접 실행 | 필터 클릭, 재시도, 초기 로드 세 곳에 렌더 코드가 복제된다. 한 곳을 고치면 나머지가 어긋난다 |
| "현재 보이는 카드 목록"을 상태에 저장 | 필터나 원본이 바뀔 때 두 곳을 갱신해야 한다. 파생 값은 계산하는 편이 안전하다 |
| 메뉴 열림 여부를 `let isOpen` 변수와 클래스 양쪽에 저장 | 둘이 어긋나는 순간이 생긴다. 클래스 한 곳만 쓴다 |
| 다크 모드를 JS로 요소마다 `style.color = …` 설정 | 수백 개 요소를 순회해야 하고, 나중에 생긴 요소는 빠진다. `data-theme` 속성과 CSS 변수를 쓴다 |
| 렌더 함수가 인수로 데이터를 받음 | 호출하는 곳마다 다른 데이터를 넘길 수 있어 현재 상태와 화면이 어긋날 여지가 생긴다. 인수 없이 `state`만 읽게 한다 |
| 상태 변경 후 `render()` 호출을 빠뜨림 | `setState`가 항상 `render()`를 호출하도록 만들면 이 실수가 생기지 않는다 |
| React를 먼저 배우고 이 구조를 건너뜀 | `useState`에서 왜 setter를 써야 하는지, 왜 상태를 직접 수정하면 화면이 바뀌지 않는지 이해하기 어렵다. 이 미션은 그 구조를 직접 만들어 보는 과정이다 |

### 예상 추가 질문과 답

- **Q. `innerHTML`로 통째로 그리면 성능 문제가 없나?** — 카드 9개, 버튼 10개 규모에서는 측정하기 어려울 만큼 빠르다. 수천 개 행이나 입력 중인 폼을 통째로 그리면 문제가 되고, 그때 React의 최소 갱신이 의미를 갖는다.
- **Q. 폼은 왜 `innerHTML` 대신 `textContent`와 `classList`로 갱신하나?** — 입력창을 `innerHTML`로 다시 만들면 사용자가 입력 중인 값과 포커스가 사라진다. 입력 요소는 유지하고 그 주변(안내 문구, 클래스)만 갱신하는 것이 이 경우의 최소 갱신이다.
- **Q. `Object.assign(state, patch)`와 React의 `setState`는 무엇이 다른가?** — React는 새 객체를 만들어 교체하므로 이전 상태와 참조 비교(`===`)로 변경 여부를 알 수 있다. 이 코드는 같은 객체를 수정하므로 그런 비교가 불가능하지만, 변경 직후 항상 렌더링하므로 비교가 필요 없다.
- **Q. 상태가 다섯 흐름에 흩어져 있는데 하나로 합쳐야 하지 않나?** — 서로 관계없는 상태(테마, 메뉴, API, 폼)는 분리하는 편이 맞다. React에서도 컴포넌트마다 `useState`를 두고 전역 하나로 모으지 않는다. 공유가 필요해질 때 합친다.
- **Q. 이 구조를 상태 머신이라 불러도 되나?** — API 흐름은 `idle → loading → success | error → (retry) loading`으로 전이가 정해져 있어 상태 머신에 가깝다. 폼과 테마는 전이 제약이 없는 단순 상태다. 전이를 제한하고 싶다면 `setState`에서 허용되지 않는 전이를 거부하면 된다.

---

## 부록: 여섯 답변을 관통하는 원칙

여섯 질문은 서로 다른 주제처럼 보이지만 같은 원칙에서 나온다.

1. **의미는 HTML 구조에, 표현은 CSS에, 동작은 JS에 둔다.** 시맨틱 태그(Q1)가 의미를, Flexbox·Grid와 디자인 토큰(Q2)이 표현을, `addEventListener`(Q3)가 동작을 맡는다. `onclick` 속성과 인라인 `style`을 쓰지 않는 규칙은 이 분리를 지키기 위한 것이다. `data-reveal`, `data-filter`, `data-theme`는 세 층이 서로 참조하는 약속된 접점이다.

2. **같은 정보는 한 곳에만 저장하고 나머지는 계산한다.** 테마는 `data-theme` 하나, 메뉴는 `is-open` 하나, 저장소는 `state.repos` 하나, 폼 오류는 `errors` 객체 하나에서 나온다. 화면의 모든 요소는 거기서 계산된다(Q6). 배열을 `map`·`filter`로 가공하고 원본을 남겨 두는 습관(Q4)도 같은 원칙에서 나온다.

3. **상태를 바꾸는 경로를 하나로 줄인다.** `setState`, `setFormState`, `setMenuOpen`, `applyTheme`가 그 경로다. 이벤트가 여러 곳에서 들어와도 상태를 바꾸는 함수는 하나이고, 그 함수가 렌더링까지 책임진다. 렌더링을 빠뜨리거나 속성 하나를 놓치는 실수가 줄어든다.

4. **불확실한 것은 명시적인 상태값으로 바꾼다.** 네트워크 응답(Q5)은 언제 올지, 성공할지 알 수 없다. 이 불확실성을 `loading | success | error`라는 값으로 바꾸면 지금 무엇을 보여줄지가 항상 정해진다. 빈 결과, 요청 한도 초과, 오프라인도 각각 대응하는 화면이 있다.

5. **브라우저가 기본으로 제공하는 기능을 먼저 쓴다.** 실행 시점은 `defer`가, 요소가 보이는지 판정은 `IntersectionObserver`가, 스피너는 CSS `animation`이, 부드러운 스크롤은 `scroll-behavior: smooth`가, 키보드 조작은 `label for`와 `button` 요소가 처리한다. JS는 상태를 바꾸는 역할에 집중한다.

6. **React는 이 구조를 자동화한 것이다.** `useState`의 setter는 `setState`와 `render()` 호출을 합친 것이고, 컴포넌트 함수는 `render()`이며, 가상 DOM은 `innerHTML` 통째 교체를 최소 패치로 바꾼 최적화다. 이 미션에서 직접 만든 구조를 이해하면 React에서 "왜 상태를 직접 바꾸면 안 되는가", "왜 렌더 함수는 순수해야 하는가"라는 규칙의 이유가 분명해진다.

---

관련 문서: [README.md](../README.md) · [docs/GUIDE.md](GUIDE.md) · [docs/EVALUATION.md](EVALUATION.md) · [Mission-B1-1.md](../Mission-B1-1.md)
