const back = document.querySelector('.create__side--back');
const backInput = document.querySelector('.create__side--back input');
const front = document.querySelector('.create__side--front input');
const button = document.querySelector('.create__button');
const output = document.querySelector('.create__info');
const custom = document.querySelector('#custom');

const main = async () => {
  button.innerText = 'Cut again!';
  const sourceValue = front.value;
  const customValue = custom.value;

  clear();

  await sleep(100);
  try {
    await checkData(sourceValue, customValue);
    const response = await postUserData(sourceValue, customValue);
    setSuccess(response.redirectLink);
  } catch (error) {
    setError(error);
  }
};

const clear = () => {
  front.value = '';
  custom.value = '';

  back.classList.remove('swing');
  front.classList.remove('.create__side--off');
  clearOutput();
};

const clearOutput = () => {
  output.innerText = 'Please wait...';
  output.classList.remove('create__info--error', 'create__info--success');
  output.classList.add('create__info--await');
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const postUserData = (sourceValue, customValue) =>
  sendPost('main/shorten', getInputObject(sourceValue, customValue));

const getInputObject = (sourceValue, customValue) => {
  const res = {
    source: sourceValue,
  };

  if (customValue) {
    res.customID = customValue;
  }

  return res;
};

const checkData = async (input, customInput) => {
  if (!input) {
    throw 'You must enter link!';
  }

  if (customInput && customInput.length < 3) {
    throw 'Custom url must have at least 3 chars';
  }
};

const setSuccess = (msg) => {
  output.innerText = 'Success';
  output.classList.add('create__info--success');
  backInput.value = msg;
  setAnimation();
};

const setAnimation = () => {
  back.classList.add('swing');
};

const setError = (msg) => {
  output.innerText = typeof msg === 'string' ? msg : msg.join('. ');
  output.classList.add('create__info--error');
};

button.addEventListener('click', main);

backInput.addEventListener('click', async () => {
  clearOutput();
  await sleep(100);
  backInput.select();
  backInput.setSelectionRange(0, 99999);
  document.execCommand('copy');
  output.innerText = 'Copied to the clipboard';
  output.classList.add('create__info--success');
});
