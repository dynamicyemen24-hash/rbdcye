/* Trusted Types bootstrap — CSP require-trusted-types-for 'script' */
(function () {
  if (typeof window === 'undefined' || !window.trustedTypes) return;
  try {
    if (!window.trustedTypes.getPolicy('default')) {
      window.trustedTypes.createPolicy('default', {
        createHTML: function (s) { return s; },
        createScript: function (s) { return s; },
        createScriptURL: function (s) { return s; }
      });
    }
  } catch (e) {}
  try {
    if (!window.trustedTypes.getPolicy('dompurify')) {
      window.trustedTypes.createPolicy('dompurify', {
        createHTML: function (s) { return s; },
        createScript: function (s) { return s; },
        createScriptURL: function (s) { return s; }
      });
    }
  } catch (e) {}
})();
