const sendPost = async (url, data) => {
  const response = await fetch(
    `http://localhost:3000/${url}`,
    Object.assign(createBody('POST'), {
      body: JSON.stringify(data),
    }),
  );

  return await tryReturnJson(response);
};

const sendGet = async (url) => {
  const response = await fetch(
    `http://localhost:3000/${url}`,
    createBody('GET'),
  );

  return await tryReturnJson(response);
};

const sendDelete = async (url) => {
  const response = await fetch(
    `http://localhost:3000/${url}`,
    createBody('DELETE'),
  );

  return await tryReturnJson(response);
};

function createBody(method) {
  return {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

async function tryReturnJson(response) {
  const json = await response.json();

  if (!response.ok) {
    throw json.message;
  }

  return json;
}

function copyValue(text, node) {
  navigator.clipboard.writeText(text);
  showSuccessCopied(node);
}

function showSuccessCopied(node) {
  node.classList.add('copy--copied');
  setTimeout(() => node.classList.remove('copy--copied'), 1e3);
}
