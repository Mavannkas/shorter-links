class PaginatorTemplate {
  constructor(selector, { link, limit = 10 }) {
    this.target = document.querySelector(selector);
    this.link = link;
    this.limit = limit;

    this.init();
  }

  init() {
    this.initTable();
    this.initIndicator();
    this.initData();
    // this.initListeners();
    //add copy, stats, delete, edit
  }

  initTable() {
    const table = this.generateTable();

    this.body = table.querySelector('tbody');

    this.appendToTarget(table);
  }

  initIndicator() {
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

  appendToBody(node) {
    this.body.append(node);
  }

  clearBody() {
    this.body.innerHTML = '';
  }

  async initData() {
    const { page, lastPage, items } = await this.getPage();

    this.setPageNumber(page);
    this.setMaxPageNumber(lastPage);
    this.appendTableItems(items);
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
    items.forEach((item) => {
      this.appendToBody(this.generateTableRow(item));
    });
  }

  initIndicatorListeners() {
    this.nextButton.addEventListener('click', nextPage);
    this.pageInput.addEventListener('blur', changePage);
    this.pageInput.addEventListener('keypress', changePage);
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
    <td class="pagination__cell"><a class="link" href="${redirectLink}">${redirectLink}</a></td>
    <td class="pagination__cell">${dateString}</td>
    <td class="pagination__cell pagination__cell--button"><button class="pagination__copy button copy">Copy</button></td>
    <td class="pagination__cell pagination__cell--button"><button class="pagination__edit button">Edit</button></td>
    <td class="pagination__cell pagination__cell--button"><button class="pagination__delete button">Delete</button></td>
    </tr>
    `;

    return tr;
  }
}
