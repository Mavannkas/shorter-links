class PopupTemplate {
  constructor(title, callback) {
    this.title = title;
    this.callback = callback;
    this.showPopup();
  }

  showPopup() {
    this.addScrollBlock();
    this.popupNode = this.createPopup();
    this.addListeners();

    this.appendToBody();
  }

  addScrollBlock() {
    document.body.classList.add('no-scroll');
  }

  removeScrollBlock() {
    document.body.classList.remove('no-scroll');
  }

  createPopup() {
    const popup = this.createPopupTemplate();
    // const body = this.createPopupBody();
    // popup.querySelector('.popup__body').append(body);

    return popup;
  }

  createPopupTemplate() {
    const popup = document.createElement('div');
    popup.classList.add('popup-shadow');

    popup.innerHTML = `<div class="popup"><div class="popup__close"><ion-icon name="close-outline"></ion-icon></div><h3 class="popup__header">${this.title}</h3><div class="popup__body"></div><div class="popup__buttons"><button class="popup__button button">Ok</button><button class="popup__button popup__button--red button">Cancel</button></div></div>`;

    return popup;
  }

  addListeners() {
    const [close, ok, cancel] = this.popupNode.querySelectorAll(
      '.popup__close, button',
    );

    ok.addEventListener('click', this.callback);
    ok.addEventListener('click', this.destroyPopup.bind(this));
    cancel.addEventListener('click', this.destroyPopup.bind(this));
    close.addEventListener('click', this.destroyPopup.bind(this));
  }

  destroyPopup() {
    this.popupNode.remove();
    this.removeScrollBlock();
  }

  appendToBody() {
    document.body.append(this.popupNode);
  }
}
