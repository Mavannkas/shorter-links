const button = document.querySelector('.main__button');
const input = document.querySelector('.main__input');
const inputCustom = document.querySelector('#custom-url');
const error = document.querySelector('.main__error');

const linkTable = document.querySelector('#links');

function main() {
  addListeners();
  genChart();
  genTable();
}

function addListeners() {
  prepareShortenFormListeners();
  prepareTableListeners();
}

function prepareShortenFormListeners() {
  button.addEventListener('click', getShortenLink);
  input.addEventListener('keypress', getShortenLink);
  input.addEventListener('paste', getShortenLink);
}

function prepareTableListeners() {
  linkTable.addEventListener('click', copyLink);
}



async function getShortenLink(ev) {
  if (button.innerText === 'Wait...') return;
  if (button.innerText === 'Copy' && ev.type === 'click') {
    copyValue(input.value, button);
    return;
  }

  clear();

  if ((ev.type === 'keypress' && ev.key !== 'Enter') || ev.type === 'paste')
    return;

  const url = input.value;
  const urlCustom = inputCustom.value;
  input.value = '';
  inputCustom.value = '';

  try {
    check(url, urlCustom);

    setLoading();
    const res = await sendUrl(url, urlCustom);

    setSuccess(res);
  } catch (error) {
    setError(error);
  }
}

function copyValue(text, node) {
  navigator.clipboard.writeText(text);
  showSuccessCopied(node);
}

function showSuccessCopied(node) {
  node.classList.add('copy--copied');
  setTimeout(() => node.classList.remove('copy--copied'), 1e3);
}

function clear() {
  error.innerText = '';
  removeButtonBlinking('Shorten');
}

function removeButtonBlinking(text) {
  button.firstElementChild.innerText = text;
  button.classList.remove('main__button--waiter');
}

function check(url, custom) {
  if (!url) {
    throw 'You must enter link!';
  }

  if (custom && custom.length < 3) {
    throw 'Custom url must have at least 3 chars';
  }
}

function setLoading() {
  button.firstElementChild.innerText = 'Wait...';
  button.classList.add('main__button--waiter');
}

async function sendUrl(url, custom) {
  return await sendPost('main/shorten', getInputObject(url, custom));
}

function getInputObject(sourceValue, customValue) {
  const res = {
    source: sourceValue,
  };

  if (customValue) {
    res.customID = customValue;
  }

  return res;
}

function setSuccess({ redirectLink, source }) {
  removeButtonBlinking('Copy');
  input.value = redirectLink;
  addNewRow(redirectLink, source, true);
}

function setError(msg) {
  removeButtonBlinking('Error');
  error.innerText = typeof msg === 'string' ? msg : msg.join('. ');
}

async function genChart() {
  const ctx = document.getElementById('myChart');
  const data = {
    labels: getLastSevenDays(),
    datasets: [
      {
        label: 'Redirect Usage stats',
        data: await getLastDaysStats(), //
        backgroundColor: [
          '#fb930042',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)',
        ],
        borderColor: [
          '#fb9300',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)',
        ],
        tension: 0.1,
        borderWidth: 1,
      },
    ],
  };
  const config = {
    type: 'bar',
    data: data,
  };

  setUpdateChart(new Chart(ctx, config));
}

function getLastSevenDays() {
  const dayInMs = 24 * 60 * 60 * 1000;
  const days = [];

  for (let i = 6; i >= 0; i--) {
    days.push(
      new Date(Date.now() - i * dayInMs).toLocaleDateString('en-En', {
        weekday: 'short',
      }),
    );
  }
  return days;
}

function setUpdateChart(chart) {
  setInterval(async () => {
    chart.data.datasets[0].data = await getLastDaysStats();
    chart.update();
  }, 1.5e4);
}

async function getLastDaysStats() {
  try {
    const json = await sendGet('main/stats/last/days/7');
    return refillJson(json.reverse());
  } catch (error) {
    return [];
  }
}

function refillJson(json) {
  const days = getDays();

  json.forEach((item) => {
    days[item.day] = item.redirectCount;
  });

  return Object.values(days);
}

function getDays() {
  const days = {};
  const dayInMs = 24 * 60 * 60 * 1000;

  for (let i = 6; i >= 0; i--) {
    const day = new Date(
      new Date(Date.now() - i * dayInMs).toLocaleDateString('en'),
    ).toISOString();

    days[day] = 0;
  }

  return days;
}

function copyLink({ target }) {
  if (target.nodeName === 'BUTTON') {
    const url = target.parentElement.firstElementChild.innerText;
    copyValue(url, target);
  }
}

async function genTable() {
  try {
    const { items } = await sendGet('main/shorten/pages/1/5');

    items
      .reverse()
      .forEach(({ redirectLink, source }) => addNewRow(redirectLink, source));
  } catch (err) {}
}

function addNewRow(short, source, isFirstCreate = false) {
  const newRow = getRow(short, source);
  putRowInTable(newRow, isFirstCreate);
}

function getRow(short, source) {
  const newRow = document.createElement('tr');
  newRow.classList.add('table__row');
  newRow.innerHTML = `<td class="table__cell">${source}</td>
  <td class="table__cell"><a href="${short}" target="_blank" >${short}</a><button class="button copy">Copy</button></td>
  `;

  return newRow;
}

function putRowInTable(newRow, remove = false) {
  const tbody = linkTable.querySelector('.table__body');
  tbody.prepend(newRow);
  if (remove) tbody.lastElementChild.remove();
}

main();
