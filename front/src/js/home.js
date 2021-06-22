const back = document.querySelector('.create__side--back');
const front = document.querySelector('.create__side--front input');

const setAnimation = () => {
  back.classList.toggle('swing-top-fwd');
  front.classList.toggle('.create__side--off');
  front.setAttribute('disabled', true);
};
