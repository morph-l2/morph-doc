/**
 * Pathnames where MarkdownActionsDropdown is injected (`docs` + `skills` + `agents` plugins).
 * CommonJS so Node test runners can `require()` it without package `"type":"module"`.
 * @param {string} pathname
 * @returns {boolean}
 */
function isMarkdownActionsPathname(pathname) {
  if (typeof pathname !== 'string' || !pathname) return false;
  const bases = ['/docs', '/skills', '/agents'];
  return bases.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  );
}

module.exports = { isMarkdownActionsPathname };
