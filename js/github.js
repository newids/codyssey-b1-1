const GITHUB_USERNAME = 'newids';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;
const MAX_VISIBLE_REPOS = 9;
const SKELETON_COUNT = 3;
const FILTER_ALL = 'all';

const LANGUAGE_COLORS = {
  HTML: '#e34c26',
  CSS: '#563d7c',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  Swift: '#f05138',
  Rust: '#dea584',
  Go: '#00add8',
  Shell: '#89e051',
  'Jupyter Notebook': '#da5b0b',
};

const filterBar = document.getElementById('filterBar');
const projectsStatus = document.getElementById('projectsStatus');
const projectsGrid = document.getElementById('projectsGrid');
const projectsCount = document.getElementById('projectsCount');

/* ---- state ------------------------------------------------------------- */

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

/* ---- derived data ------------------------------------------------------ */

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const formatDate = (isoString) => isoString.slice(0, 10).replaceAll('-', '.');

const getLanguages = (repos) => {
  const languages = repos.map(({ language }) => language).filter(Boolean);
  return [...new Set(languages)].sort();
};

const getVisibleRepos = () =>
  state.repos.filter(({ language }) => state.filter === FILTER_ALL || language === state.filter);

/* ---- templates --------------------------------------------------------- */

const createFilterButton = (label, value) => `
  <button type="button" class="filter-btn${state.filter === value ? ' is-active' : ''}" data-filter="${escapeHtml(value)}" aria-pressed="${state.filter === value}">
    ${escapeHtml(label)}
  </button>
`;

const createSkeletonCard = () => `
  <div class="skeleton-card" aria-hidden="true">
    <div class="skeleton" style="height: 12px; width: 40%;"></div>
    <div class="skeleton" style="height: 22px; width: 65%;"></div>
    <div class="skeleton" style="height: 12px; width: 100%;"></div>
    <div class="skeleton" style="height: 12px; width: 80%;"></div>
  </div>
`;

const createRepoCard = ({ name, description, html_url: url, language, stargazers_count: stars, updated_at: updatedAt }) => {
  const languageLabel = language ?? '—';
  const languageColor = LANGUAGE_COLORS[language] ?? '';
  const hasDescription = Boolean(description);

  return `
    <article class="project-card">
      <div class="project-card-meta">
        <span>${formatDate(updatedAt)}</span>
        <span class="project-card-stars">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.4 6.3 20.5l1.2-6.4L2.8 9.7l6.4-.8z"/></svg>
          ${stars}
        </span>
      </div>
      <h3 class="project-card-title">${escapeHtml(name)}</h3>
      <p class="project-card-desc${hasDescription ? '' : ' is-empty'}">${hasDescription ? escapeHtml(description) : '설명이 없습니다.'}</p>
      <div class="project-card-footer">
        <span class="project-card-lang">
          <span class="lang-dot" style="--lang-color: ${languageColor}"></span>${escapeHtml(languageLabel)}
        </span>
        <a class="project-card-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">GitHub에서 보기 →</a>
      </div>
    </article>
  `;
};

/* ---- render (status → markup) ----------------------------------------- */

const renderFilters = () => {
  if (state.status !== 'success') {
    filterBar.innerHTML = '';
    return;
  }
  const languageButtons = getLanguages(state.repos).map((language) => createFilterButton(language, language));
  filterBar.innerHTML = [createFilterButton('전체', FILTER_ALL), ...languageButtons].join('');
};

const renderLoading = () => {
  projectsStatus.innerHTML = '<div class="status-loading"><span class="spinner" aria-hidden="true"></span>GitHub 저장소를 불러오는 중…</div>';
  projectsGrid.innerHTML = Array.from({ length: SKELETON_COUNT }, createSkeletonCard).join('');
  projectsCount.textContent = '';
};

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

function render() {
  renderFilters();

  if (state.status === 'loading') renderLoading();
  else if (state.status === 'error') renderError();
  else if (state.status === 'success') renderSuccess();
}

/* ---- events ------------------------------------------------------------ */

filterBar.addEventListener('click', ({ target }) => {
  const button = target.closest('[data-filter]');
  if (!button) return;
  setState({ filter: button.dataset.filter });
});

/* ---- data fetching ----------------------------------------------------- */

const describeHttpError = (status) => {
  if (status === 403) return 'GitHub API 요청 한도(시간당 60회)를 넘었습니다. 잠시 후 다시 시도해주세요.';
  if (status === 404) return `GitHub 사용자 '${GITHUB_USERNAME}'를 찾을 수 없습니다.`;
  return `서버가 오류를 반환했습니다. (HTTP ${status})`;
};

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
