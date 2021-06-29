const faqElements = document.querySelectorAll('.faq__element');

function toggleAria() {
  if (this.getAttribute('aria-expanded') != 'false') {
    this.setAttribute('aria-expanded', 'false');
  } else {
    this.setAttribute('aria-expanded', 'true');
  }
}

faqElements.forEach((item) => {
  item.addEventListener('click', toggleAria);
});
