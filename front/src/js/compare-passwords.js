const passwords = [...document.querySelectorAll('input[type="password"]')];
const error = document.querySelector('.error');
const myForm = document.querySelector('form');

myForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  error.innerText = '';

  const [firstPass, secondPass] = passwords.map((item) => item.value);

  if (!firstPass.length && !secondPass.length) {
    error.innerText = 'You must fill passwords';
  } else if (passwords[0].value != passwords[1].value) {
    error.innerText = 'Passwords must be equal!';
  } else {
    myForm.submit();
  }
});
