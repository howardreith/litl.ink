'use strict';

$("#errorWrapper").hide();
$("#linkContainer").hide();
$("#copyToClipboardButton").hide();

$("#urlInputForm").submit((event) => {
  event.preventDefault();
  const value = document.getElementById('urlInput').value;
  if (!isValidHttpUrl(value)) {
    $("#errorWrapper").show();
    $('#linkContainer').hide();
    $('#copyToClipboardButton').hide();
    throw Error('Invalid URL')
  }

  const backendUrl = window.location.href.includes('localhost') ?
    'http://localhost:8080/addLink' :
    'https://reithlitlink.herokuapp.com/addLink';
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({url: value})
  };
  fetch(backendUrl, options)
    .then((res) => res.json()
    .then((res) => {
    $('#linkContainer').show();
    $('#copyToClipboardButton').show();
    const link = res.builtUrl;
    document.getElementById("littleLink").innerHTML =
      `<a id="littleLink" class="littleLink" href="${link}" target=_blank>${link.replace('http://', '')}</a>`;
    $("#errorWrapper").hide();
  }))
    .catch((e) => {
      console.error('An error occurred while fetching link: ', e)
    })
});

$('#copyToClipboardButton').click(() => {
  const littleUrl = document.getElementById("littleLink").innerText;
  navigator.clipboard.writeText(littleUrl)
    .catch((e) => {
      console.error('An error occurred while writing text to clipboard: ', e)
    })
});

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}