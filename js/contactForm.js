const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUCCESS_MESSAGE = '메시지가 성공적으로 전송되었습니다. 감사합니다!';

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

const validators = {
  name: (value) => (value.trim() === '' ? '이름을 입력해주세요.' : ''),
  email: (value) => {
    if (value.trim() === '') return '이메일을 입력해주세요.';
    if (!EMAIL_PATTERN.test(value.trim())) return '올바른 이메일 형식이 아닙니다.';
    return '';
  },
  message: (value) => (value.trim() === '' ? '메시지를 입력해주세요.' : ''),
};

const fields = [
  { name: 'name', input: document.getElementById('contactName'), error: document.getElementById('contactNameError') },
  { name: 'email', input: document.getElementById('contactEmail'), error: document.getElementById('contactEmailError') },
  { name: 'message', input: document.getElementById('contactMessage'), error: document.getElementById('contactMessageError') },
];

/* ---- state ------------------------------------------------------------- */

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

/* ---- events ------------------------------------------------------------ */

fields.forEach(({ name, input }) => {
  input.addEventListener('input', () => {
    setFormState({
      errors: { ...formState.errors, [name]: validators[name](input.value) },
      isSubmitted: false,
    });
  });
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const errors = Object.fromEntries(fields.map(({ name, input }) => [name, validators[name](input.value)]));
  const hasError = Object.values(errors).some((message) => message !== '');

  if (hasError) {
    setFormState({ errors, isSubmitted: false });
    const firstInvalid = fields.find(({ name }) => errors[name] !== '');
    firstInvalid.input.focus();
    return;
  }

  contactForm.reset();
  setFormState({ errors, isSubmitted: true });
});
