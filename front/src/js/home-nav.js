function resetActive() {
  elements.forEach((item) => {
    item.classList.remove('nav__element--active');
  });
}

function setActive(ev) {
  if (ev.type === 'click' || ev.key === 'Enter' || ev.code === 'Space') {
    resetActive();
    this.classList.add('nav__element--active');
  }
}

const elements = [...document.querySelectorAll('.nav__element')].slice(1);

elements.forEach((item) => item.addEventListener('click', setActive));
elements.forEach((item) => item.addEventListener('keypress', setActive));

const burger = document.querySelector('.nav__toggle');
const nav = document.querySelector('.nav');

function toggleBurger(ev) {
  if (ev.type === 'click' || ev.key === 'Enter' || ev.code === 'Space') {
    this.classList.toggle('nav__toggle--active');
    nav.classList.toggle('nav--active');
  }
}

burger.addEventListener('click', toggleBurger);
burger.addEventListener('keypress', toggleBurger);
