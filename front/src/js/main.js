const sendPost = (url, data) =>
  fetch(`http://localhost:3000/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
