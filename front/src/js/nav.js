const nav = document.querySelector('.nav-mobile');
const burger = document.querySelector('.burger');
const navItems = document.querySelectorAll('.nav-mobile__item');

const toggleNav = () => {
  if (nav.classList.contains('nav--show')) {
    hideNav();
  } else {
    showNav();
  }
};

const showNav = () => {
  nav.classList.add('nav--show');
  navItems.forEach((item) => {
    item.classList.add('nav-mobile__item-animation');
  });
};

const hideNav = () => {
  nav.classList.remove('nav--show');
  navItems.forEach((item) => {
    item.classList.remove('nav-mobile__item-animation');
  });
};

burger.addEventListener('click', toggleNav);
nav.addEventListener('click', toggleNav);
