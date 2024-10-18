function initialize() {
  const interval = setInterval(() => {
    const releaseElement = document.querySelector('div[title="release"]');
    if (releaseElement) {
      clearInterval(interval);
      injectLink(releaseElement);
    }
  }, 1000);
}

function injectLink(releaseElement) {
  const valueElement =
    releaseElement.parentElement?.parentElement?.querySelector("a span");
  if (!valueElement) return;

  const release = valueElement.textContent;
  const buildNumber = release?.split(".").at(0);

  const button = document.createElement("a");
  button.style.marginLeft = "4px";
  button.textContent = "(see on github)";
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  button.href = `https://github.com/Carepatron/Carepatron-App/actions/runs/${buildNumber}`;

  releaseElement.appendChild(button);
}

window.addEventListener("load", initialize);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "URL_CHANGED") {
    initialize();
  }
});
