function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

$("#urlInputForm").submit((event) => {
  event.preventDefault();
  const value = document.getElementById('urlInput').value
  if (!isValidHttpUrl(value)) {
    document.getElementById("linkContainer").innerHTML =
      `<div id="linkContainer"><span>Invalid URL</span></div>`;
    throw Error('Invalid URL')
  }

  const backendUrl = window.location.href.includes('localhost') ? 'http://localhost:8080/addLink' : 'https://reithlitlink.herokuapp.com/addLink'
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({url: value})
  };
  fetch(backendUrl, options).then((res) => res.json().then((res) => {
    const link = res.builtUrl
    document.getElementById("linkContainer").innerHTML =
      `<div id="linkContainer"><a href="${link}" target=_blank>${link.replace('http://', '')}</a></div>`;
  }))
});