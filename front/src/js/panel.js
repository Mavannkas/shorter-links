const elements = [...document.querySelectorAll('.nav__element')].slice(1);
const burger = document.querySelector('.nav__toggle');
const nav = document.querySelector('.nav');

const button = document.querySelector('.main__button');
const input = document.querySelector('.main__input');
const inputCustom = document.querySelector('#custom-url');
const error = document.querySelector('.main__error');

function main() {
  addListeners();
  genChart();
}

function addListeners() {
  elements.forEach((item) => item.addEventListener('click', setActive));
  elements.forEach((item) => item.addEventListener('keypress', setActive));
  burger.addEventListener('click', toggleBurger);
  burger.addEventListener('keypress', toggleBurger);
  button.addEventListener('click', getShortenLink);
  input.addEventListener('keypress', getShortenLink);
}

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

function toggleBurger(ev) {
  if (ev.type === 'click' || ev.key === 'Enter' || ev.code === 'Space') {
    this.classList.toggle('nav__toggle--active');
    nav.classList.toggle('nav--active');
  }
}

function getShortenLink() {
  const url = input.value;
  const urlCustom = inputCustom.value;

  try {
    check(url, urlCustom);
  } catch (error) {
    setError(error);
  }
}

// function check(url, custom) {
//   if (!url) {
//     throw {};
//   }
// }

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
    const res = await sendGet('main/stats/last/days/7');
    const json = await res.json();
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

main();
