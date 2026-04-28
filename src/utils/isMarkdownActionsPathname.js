/**
 * Pathnames where MarkdownActionsDropdown is injected (`docs` + `skills` + `agents` plugins).
 * CommonJS so Node test runners can `require()` it without package `"type":"module"`.
 * @param {string} pathname
 * @returns {boolean}
 */
function isMarkdownActionsPathname(pathname) {
  if (typeof pathname !== 'string' || !pathname) return false;
  return (
    pathname.startsWith('/docs/') ||
    pathname.startsWith('/skills/') ||
    pathname.startsWith('/agents/')
  );
}

module.exports = { isMarkdownActionsPathname };
