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

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.active && changeInfo.url && issueUrlRegex.test(changeInfo.url)) {
    chrome.tabs.sendMessage(tabId, {
      action: "URL_CHANGED",
      url: changeInfo.url,
    });
  }
});
