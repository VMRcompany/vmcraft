(function () {
  const STORAGE_KEY = "vmcraft-captcha-ok";
  const SITE_KEY = "";
  const COPY = {
    ru: {
      title: "Подтвердите, что вы не робот",
      sub: "Короткая проверка перед входом на сайт.",
      wait: "Загрузка проверки…",
      label: "Я не робот"
    },
    en: {
      title: "Confirm you are not a robot",
      sub: "A short check before you enter the site.",
      wait: "Loading the check…",
      label: "I'm not a robot"
    }
  };

  function isBot() {
    return /bot|crawl|spider|slurp|mediapartners|yandex|googlebot|bingbot|baidu/i.test(navigator.userAgent || "");
  }

  function lang() {
    try {
      return localStorage.getItem("vmcraft-lang") === "en" ? "en" : "ru";
    } catch (e) {
      return "ru";
    }
  }

  function alreadyPassed() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function unlock() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {}
    document.documentElement.classList.remove("captcha-lock");
    const gate = document.getElementById("captchaGate");
    if (gate) gate.remove();
  }

  if (alreadyPassed() || isBot()) {
    document.documentElement.classList.remove("captcha-lock");
    return;
  }

  document.documentElement.classList.add("captcha-lock");

  const t = COPY[lang()];
  const gate = document.createElement("div");
  gate.id = "captchaGate";
  gate.className = "captcha-gate";
  gate.setAttribute("role", "dialog");
  gate.setAttribute("aria-modal", "true");
  gate.setAttribute("aria-labelledby", "captchaTitle");
  gate.innerHTML =
    '<div class="captcha-card">' +
      '<p class="captcha-kicker">VMcraft</p>' +
      '<h2 id="captchaTitle">' + t.title + "</h2>" +
      "<p>" + t.sub + "</p>" +
      '<div class="captcha-widget" id="captchaWidget"></div>' +
    "</div>";
  document.body.appendChild(gate);

  function renderFallback() {
    const widget = document.getElementById("captchaWidget");
    if (!widget) return;
    widget.innerHTML =
      '<label class="human-check">' +
        '<input type="checkbox" id="humanCheck">' +
        "<span>" + t.label + "</span>" +
      "</label>";
    const box = document.getElementById("humanCheck");
    box.addEventListener("change", function () {
      if (!box.checked) return;
      box.disabled = true;
      window.setTimeout(unlock, 280);
    });
  }

  function renderRecaptcha() {
    const widget = document.getElementById("captchaWidget");
    if (!widget || !window.grecaptcha || typeof window.grecaptcha.render !== "function") {
      renderFallback();
      return;
    }
    widget.innerHTML = '<div id="captchaBox"></div>';
    window.grecaptcha.render("captchaBox", {
      sitekey: SITE_KEY,
      theme: "dark",
      callback: function () {
        unlock();
      },
      "expired-callback": function () {
        document.documentElement.classList.add("captcha-lock");
      },
      "error-callback": renderFallback
    });
  }

  if (!SITE_KEY) {
    renderFallback();
    return;
  }

  const widget = document.getElementById("captchaWidget");
  if (widget) widget.innerHTML = '<p class="captcha-status">' + t.wait + "</p>";

  window.vmcraftOnRecaptchaApi = renderRecaptcha;
  const script = document.createElement("script");
  script.src = "https://www.recaptcha.net/recaptcha/api.js?onload=vmcraftOnRecaptchaApi&render=explicit&hl=" + lang();
  script.async = true;
  script.defer = true;
  script.onerror = renderFallback;
  document.head.appendChild(script);
  window.setTimeout(function () {
    if (!window.grecaptcha) renderFallback();
  }, 8000);
})();
