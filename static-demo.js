(function () {
  var lang = document.documentElement.lang === "ar" ? "ar" : "he";
  var MSG = {"he":"זו גרסת תצוגה של האתר. טפסים ולוח הבקרה אינם פעילים בה.","ar":"هذه نسخة عرض من الموقع. النماذج ولوحة التحكم غير مفعّلة فيها."}[lang];
  function sameOrigin(u) { return u.origin === location.origin; }
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    var u = new URL(a.getAttribute("href"), location.href);
    if (!sameOrigin(u)) return;
    if (u.pathname === location.pathname && u.search === location.search && u.hash) return;
    if (/^\/admin(\/|$)/.test(u.pathname)) { e.preventDefault(); e.stopImmediatePropagation(); alert(MSG); return; }
    e.preventDefault(); e.stopImmediatePropagation();
    location.assign(u.pathname + u.search + u.hash);
  }, true);
  var nativeFetch = window.fetch;
  window.fetch = function (input, init) {
    try {
      var u = new URL(typeof input === "string" ? input : input.url, location.href);
      var method = String((init && init.method) || (input && input.method) || "GET").toUpperCase();
      if (sameOrigin(u) && u.pathname.indexOf("/__manifest") === 0) {
        return Promise.resolve(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
      }
      if (sameOrigin(u) && /\.data$/.test(u.pathname)) {
        if (method !== "GET") { alert(MSG); location.reload(); return new Promise(function () {}); }
        u.searchParams.delete("_routes"); u.searchParams.delete("index");
        var path = u.pathname.replace(/\/_\.data$/, "/").replace(/\.data$/, "") || "/";
        location.assign(path + (u.search && u.search !== "?" ? u.search : ""));
        return new Promise(function () {});
      }
    } catch (err) {}
    return nativeFetch.apply(this, arguments);
  };
})();
