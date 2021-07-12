const sendPost = async (url, data) => {
  const response = await fetch(`http://localhost:3000/${url}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw json.message;
  }

  return json;
};

const sendGet = async (url) => {
  const response = await fetch(`http://localhost:3000/${url}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw json.message;
  }

  return json;
};

function copyValue(text, node) {
  navigator.clipboard.writeText(text);
  showSuccessCopied(node);
}

function showSuccessCopied(node) {
  node.classList.add('copy--copied');
  setTimeout(() => node.classList.remove('copy--copied'), 1e3);
}
