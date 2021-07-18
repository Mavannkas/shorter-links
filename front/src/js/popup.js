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
    document.body.focus();
  }

  addScrollBlock() {
    document.body.classList.add('no-scroll');
  }

  removeScrollBlock() {
    document.body.classList.remove('no-scroll');
  }

  createPopup() {
    const popup = this.createPopupTemplate();

    return popup;
  }

  createPopupTemplate() {
    const popup = document.createElement('div');
    popup.classList.add('popup-shadow');

    popup.innerHTML = `<div class="popup"><div class="popup__close"><ion-icon name="close-outline"></ion-icon></div><h3 class="popup__header">${this.title}</h3><div class="popup__body"></div><div class="popup__buttons"><button class="popup__button button">Ok</button><button class="popup__button popup__button--red button">Cancel</button></div></div>`;

    return popup;
  }

  addListeners() {
    this.bodyHandler = this.popupHandle.bind(this);
    document.body.addEventListener('click', this.bodyHandler, true);
    document.body.addEventListener('keydown', this.bodyHandler, true);
  }

  popupHandle({ target, key }) {
    if (
      (target.classList.contains('popup__button') &&
        !target.classList.contains('popup__button--red')) ||
      key === 'Enter'
    ) {
      this.callback();
    }

    this.destroyPopup(target, key);
  }

  destroyPopup(target, key) {
    if (
      target.classList.contains('popup-shadow') ||
      target.classList.contains('popup__button') ||
      target.classList.contains('hydrated') ||
      key === 'Escape' ||
      key === 'Enter'
    ) {
      this.popupNode.remove();
      this.removeScrollBlock();
      document.body.removeEventListener('click', this.bodyHandler, true);
      document.body.removeEventListener('keydown', this.bodyHandler, true);
    }
  }

  appendToBody() {
    document.body.append(this.popupNode);
  }
}

class Alert extends PopupTemplate {
  constructor({ title, text }, callback) {
    super(title, callback);
    this.text = text;

    this.init();
  }

  init() {
    this.setAttention();
    const body = this.createPopupBody();
    this.popupNode.querySelector('.popup__body').append(body);
  }

  setAttention() {
    this.popupNode
      .querySelector('.popup__header')
      .classList.add('popup__header--attention');
  }

  createPopupBody() {
    const p = document.createElement('p');
    p.classList.add('popup__text');
    p.innerHTML = this.text;

    return p;
  }
}

class EditModal extends PopupTemplate {
  constructor({ title, url, source }, callback) {
    super(title, callback);
    this.url = url;
    this.source = source;

    this.init();
  }

  init() {
    const body = this.createPopupBody();
    this.popupNode.querySelector('.popup__body').append(body);
  }

  createPopupBody() {
    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.innerHTML = `
    <label class="popup__label" for="source">Enter new source</label>
    <input class="popup__input main__input" type="text" value="${this.source}" id="source" require>
    <label class="popup__label" for="url">Enter new custom url</label>
    <input class="popup__input main__input" type="text" value="${this.url}" id="url" require>
    `;

    return form;
  }
}

class ErrorAlert extends Alert {
  constructor(text) {
    super(
      {
        title: 'Attention!',
        text,
      },
      () => 1,
    );
  }
}

class SuccessAlert extends Alert {
  constructor(text) {
    super(
      {
        title: 'Success!',
        text,
      },
      () => 1,
    );
  }

  setAttention() {
    this.popupNode
      .querySelector('.popup__header')
      .classList.add('popup__header--success');
  }
}
