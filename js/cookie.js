(function () {
  const KEY = "vmcraft-cookies-ok";
  const banner = document.getElementById("cookieBanner");
  const btn = document.getElementById("cookieAccept");
  if (!banner || !btn) return;

  function accepted() {
    try {
      return localStorage.getItem(KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function hide() {
    document.documentElement.classList.remove("cookie-pending");
  }

  if (accepted()) {
    hide();
    return;
  }

  document.documentElement.classList.add("cookie-pending");
  btn.addEventListener("click", function () {
    try {
      localStorage.setItem(KEY, "1");
    } catch (e) {}
    hide();
  });
})();
