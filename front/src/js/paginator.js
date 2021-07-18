class PaginatorTemplate {
  constructor(selector, { link, limit = 10 }) {
    this.target = document.querySelector(selector);
    this.link = link;
    this.limit = limit;

    this.init();
  }

  init() {
    this.initTable();
    this.initTableListeners();
    this.initIndicator();
    this.initData();
  }

  initTable() {
    const table = this.generateTable();

    this.body = table.querySelector('tbody');

    this.appendToTarget(table);
  }

  initTableListeners() {
    this.body.addEventListener('click', this.clickHandler.bind(this));
  }

  clickHandler(ev) {
    const closestTr = ev.target.closest('.pagination__row');
    ev.target.blur();

    switch (ev.target.dataset.type) {
      case 'copy':
        this.copyLink(closestTr);
        break;

      case 'edit':
        this.showEditPopup(closestTr);
        break;

      case 'delete':
        this.deleteItem(closestTr);
        break;

      default:
        this.showStatsPopup(closestTr);
        break;
    }
  }

  copyLink(node) {
    const button = node.querySelector('.pagination__copy');
    const text = node.querySelector('a.link').innerText;
    copyValue(text, button);
  }

  showEditPopup(node) {
    const [sourceNode, urlNode] = node.querySelectorAll('.pagination__cell');
    const source = sourceNode.innerText;
    const url = urlNode.innerText.split('/').slice(-1)[0];

    this.popup = new EditModal(
      {
        title: `Edit selected link`,
        source,
        url,
      },
      () => {
        this.editRedirection.bind(this)(
          node.dataset.id,
          this.prepareBody(source, url),
        );
      },
    );
  }

  prepareBody(source, url) {
    const links = [...document.querySelectorAll('#source, #url')].map(
      (link) => link.value,
    );

    const result = {};

    if (links[0] !== source) {
      result['source'] = links[0];
    }

    if (links[1] !== url) {
      result['customID'] = links[1];
    }

    return result;
  }

  async editRedirection(id, body) {
    try {
      const response = await sendPatch(`main/shorten/${id}`, body);
      this.showSuccess('Correctly updated');
      this.changeData(this.currentPage);
    } catch (error) {
      this.showError(error);
    }
  }

  deleteItem(node) {
    const link = node.querySelector('a').innerText;
    this.popup = new Alert(
      {
        text: `Are you really want to delete this redirection?<br><a class="link" target="_blank" rel="noopener noreferrer" href="${link}">${link}</a>`,
        title: 'Attention',
      },
      () => {
        this.deleteRedirection.bind(this)(node.dataset.id);
      },
    );
  }

  async deleteRedirection(id) {
    try {
      const response = await sendDelete(`main/shorten/${id}`);
      this.showSuccess('Correctly deleted');
      this.changeData(this.currentPage);
    } catch (error) {
      this.showError(error);
    }
  }

  showStatsPopup(node) {}

  initIndicator() {
    this.initIndicatorBody();
    this.initIndicatorListeners();
  }

  initIndicatorBody() {
    this.indicator = this.generateIndicator();

    this.pageInput = this.indicator.querySelector('input');
    this.maxPageNode = this.indicator.querySelector('.indicator__count');
    this.nextButton = this.indicator.querySelector('.indicator__next');

    this.appendToTarget(this.indicator);
  }

  generateIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');

    indicator.innerHTML = `<div class="indicator__main"><span class="indicator__span">Page:</span><input type="text" class="indicator__input"><span class="indicator__span">of <span class="indicator__count"></span></span></div><button class="indicator__next button">Next</button>`;

    return indicator;
  }

  appendToTarget(node) {
    this.target.append(node);
  }

  initIndicatorListeners() {
    this.nextButton.addEventListener('click', this.nextPage.bind(this));
    this.pageInput.addEventListener('blur', this.changePage.bind(this));
    this.pageInput.addEventListener('keypress', this.changePage.bind(this));
  }

  nextPage() {
    this.changeData();
  }

  changePage({ type, key }) {
    if (key == 'Enter' || type == 'blur') {
      this.changeData(this.pageInput.value);
    }
  }

  appendToBody(node) {
    this.body.append(node);
  }

  clearBody() {
    this.body.innerHTML = '';
  }

  async initData() {
    this.setMaxPageNumber(await this.changeData());
  }

  async changeData(num) {
    const { page, lastPage, items } = await this.getPage(num);

    this.setPageNumber(page);
    this.appendTableItems(items);
    return lastPage;
  }

  async getPage(page) {
    return this.getPageByNumber(this.getCurrentPageNumber(page));
  }

  async getPageByNumber(page) {
    try {
      return sendGet(`${this.link}/${page}/${this.limit}`);
    } catch (error) {
      return {};
    }
  }

  getCurrentPageNumber(num) {
    if (this.currentPage && this.currentPage == this.maxPageNode.innerText) {
      return 1;
    }

    if (+this.maxPageNode.innerText < +num) {
      return this.currentPage;
    }

    return num ?? (this.currentPage ?? 0) + 1;
  }

  setPageNumber(page) {
    this.pageInput.value = page;
    this.currentPage = page;
  }

  setMaxPageNumber(page) {
    this.maxPageNode.innerText = page;
  }

  appendTableItems(items) {
    this.clearBody();
    items.forEach((item) => {
      this.appendToBody(this.generateTableRow(item));
    });
  }

  showSuccess(text) {
    this.popup = new SuccessAlert(text);
  }

  showError(response) {
    if (Array.isArray(response)) {
      this.popup = new ErrorAlert(response.join('\n'));
    } else {
      this.popup = new ErrorAlert(response);
    }
  }
}

class UserPaginator extends PaginatorTemplate {
  constructor(...args) {
    super(...args);
  }

  generateTable() {
    const table = document.createElement('table');
    table.classList.add('pagination');

    table.innerHTML = `<thead class="pagination__head"><tr class="pagination__row"><th class="pagination__cell">Source</th><th class="pagination__cell">Shortened</th><th class="pagination__cell">Created at</th><th class="pagination__cell pagination__cell--button"></th><th class="pagination__cell pagination__cell--button"></th><th class="pagination__cell pagination__cell--button"></th></tr></thead><tbody class="pagination__body"></tbody>`;

    return table;
  }

  generateTableRow({ redirectLink, source, created_at, redirect_link_id }) {
    const tr = document.createElement('tr');
    tr.classList.add('pagination__row');
    tr.dataset.id = redirect_link_id;
    const dateString = new Date(created_at).toLocaleString();

    tr.innerHTML = `
    <tr class="pagination__row" >
    <td class="pagination__cell">${source}</td>
    <td class="pagination__cell"><a class="link" target="_blank" rel="noopener noreferrer" href="${redirectLink}">${redirectLink}</a></td>
    <td class="pagination__cell">${dateString}</td>
    <td class="pagination__cell pagination__cell--button"><button data-type="copy" class="pagination__copy button copy">Copy</button></td>
    <td class="pagination__cell pagination__cell--button"><button data-type="edit" class="pagination__edit button">Edit</button></td>
    <td class="pagination__cell pagination__cell--button"><button data-type="delete" class="pagination__delete button">Delete</button></td>
    </tr>
    `;

    return tr;
  }
}
