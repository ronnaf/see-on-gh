/**
 * Regex pattern to match URLs in the format:
 * `https://carepatron.sentry.io/issues/*`
 * where `*` can be any alphanumeric string and may optionally
 * be followed by a query string.
 *
 * The pattern does NOT match:
 * - URLs with additional slashes after the ID
 * - URLs that do not start with the specified base URL
 *
 * @constant {RegExp} issueUrlRegex
 * @example
 * // Matches
 * issueUrlRegex.test('https://carepatron.sentry.io/issues/5893211453'); // true
 * issueUrlRegex.test('https://carepatron.sentry.io/issues/5893211453/?environment=production&project=4506941031251968'); // true
 *
 * // Does NOT match
 * issueUrlRegex.test('https://carepatron.sentry.io/issues/5893211453/anotherSegment'); // false
 * issueUrlRegex.test('https://carepatron.sentry.io/issues/'); // false
 * issueUrlRegex.test('https://carepatron.sentry.io/issues/?environment=production'); // false
 */
const issueUrlRegex =
  /^https:\/\/carepatron\.sentry\.io\/issues\/[^\/?]+\/?(\?.*)?$/;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.active && changeInfo.url && issueUrlRegex.test(changeInfo.url)) {
    console.log(`changeInfo.url:`, changeInfo.url);
    chrome.tabs.sendMessage(tabId, { action: 'URL_CHANGED', url: changeInfo.url });
  }
});
