/**
 * match:
 * https://carepatron.sentry.io/issues/5574468879
 * https://carepatron.sentry.io/issues/5574468879?foo=bar
 * https://carepatron.sentry.io/issues/5574468879/
 * https://carepatron.sentry.io/issues/5574468879/?foo=bar
 * https://carepatron.sentry.io/issues/5574468879/tags
 * https://carepatron.sentry.io/issues/5574468879/tags?foo=bar
 * https://carepatron.sentry.io/issues/5574468879/tags/
 * https://carepatron.sentry.io/issues/5574468879/tags/?foo=bar
 * 
 * not match
 * https://carepatron.sentry.io/issues/?foo=bar
 * https://carepatron.sentry.io/issues?foo=bar
 * https://carepatron.sentry.io/issues
 */
const issueUrlRegex = /^https:\/\/carepatron\.sentry\.io\/issues\/[^\/?]+(?:\/[^\/?]*)?\/?(?:\?.*)?$/i

let interval;
function waitForPage(selector) {
  return new Promise((resolve) => {
    interval = setInterval(() => {
      const releaseElements = document.querySelectorAll('div[title="release"]');
      const seenInfoElements = document.querySelectorAll('div[data-sentry-element="HovercardWrapper"][data-sentry-component="SeenInfo"][data-sentry-source-file="seenInfo.tsx"]');

      if (releaseElements.length && seenInfoElements.length) {
        clearInterval(interval);
        resolve();
      }
    }, 500);
  });
}

function createLinkElement(buildNumber) {
  const div = document.createElement("div");
  div.style.marginLeft = "4px";

  const a = document.createElement("a");
  a.textContent = "(see on github)";
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.href = `https://github.com/Carepatron/Carepatron-App/actions/runs/${buildNumber}`;

  div.appendChild(a);

  return div;
}

function injectToTreeValueElements() {
  const releaseElement = document.querySelector('div[title="release"]');
  const valueElement =
    releaseElement?.parentElement?.parentElement?.querySelector("a span");

  const releaseString = valueElement?.textContent;
  const buildNumber = releaseString?.split(".").at(0);

  if (!buildNumber) {
    console.error("Failed to find build number");
    return;
  }

  const result = document.evaluate(
    `//text()[contains(., '${releaseString}')]`,
    document,
    null,
    XPathResult.ANY_TYPE,
    null
  );

  let nodes = [];
  let node = result.iterateNext();
  while (node) {
    nodes.push(node.parentNode);
    node = result.iterateNext();
  }

  nodes.forEach((node) => {
    const div = createLinkElement(buildNumber);
    const treeValueElement = node.parentElement.parentElement.parentElement;
    if (treeValueElement.getAttribute("data-sentry-element") === "TreeValue") {
      treeValueElement.style.display = "flex";
      treeValueElement.style.alignItems = "center";
      treeValueElement.appendChild(div);
    }
  });
}

function injectToSeenElements() {
  const seenInfoElements = document.querySelectorAll(
    'div[data-sentry-element="HovercardWrapper"][data-sentry-component="SeenInfo"][data-sentry-source-file="seenInfo.tsx"]'
  );
  seenInfoElements.forEach((seenInfoElement) => {
    const valueElement = seenInfoElement.querySelector("a span");
    const releaseString = valueElement?.textContent;
    const buildNumber = releaseString?.split(".").at(0);
    const div = createLinkElement(buildNumber);
    div.style.marginLeft = 0;
    seenInfoElement.parentElement.appendChild(div);
  });
}

async function initialize() {
  clearInterval(interval);

  await waitForPage();

  injectToTreeValueElements();
  injectToSeenElements();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "URL_CHANGED") {
    initialize();
  }
});

window.addEventListener("load", () => {
  if (issueUrlRegex.test(window.location.href)) {
    initialize();
  }
});
