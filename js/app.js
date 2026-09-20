const LATEST_JSON = "https://raw.githubusercontent.com/VMRcompany/vmcraft-updates/main/latest.json";
const GITHUB_LATEST = "https://api.github.com/repos/VMRcompany/vmcraft-updates/releases/latest";
const FALLBACK = {
  versionName: "0.1.14",
  apkUrl: "https://github.com/VMRcompany/vmcraft-updates/releases/download/0.1.14/VMcraft-0.1.14-release.apk"
};

const I18N = {
  ru: {
    navFeat: "Возможности",
    navMods: "Моды",
    navDl: "Скачать",
    navVersions: "Версии",
    lang: "EN",
    kicker: "Android · Java Edition · v",
    h1: "Minecraft: Java Edition — у тебя в кармане.",
    lead: "VMcraft — удобный лаунчер Minecraft: Java Edition на Android. Играйте в Java-версию прямо со смартфона или планшета: версии, моды, сборки и свои настройки — в одном приложении.",
    play: "Скачать APK",
    yt: "Наш YouTube канал",
    android: "Android 5.0+",
    pkg: "Пакет",
    banner: "VMcraft – лаунчер Minecraft Java Edition для Android",
    mockPlay: "Играть",
    featTitle: "Что умеет VMcraft",
    featSub: "Всё, что нужно, чтобы запустить Java Edition на телефоне — без лишней суеты.",
    f1t: "Запуск Java Edition",
    f1d: "Играйте в Minecraft: Java Edition на смартфоне или планшете.",
    f2t: "Версии и сборки",
    f2d: "Выбирайте версию игры и отдельные инстансы под разные миры.",
    f3t: "Моды и модпаки",
    f3d: "Ставьте моды и модпаки прямо из лаунчера.",
    f4t: "Microsoft и локальный профиль",
    f4d: "Вход через аккаунт Microsoft или локальный профиль.",
    f5t: "Сенсорное управление",
    f5d: "Пользовательские кнопки под ваш стиль игры на экране.",
    f6t: "JAR-установщики",
    f6d: "Запускайте .jar-установщики, когда это нужно.",
    f7t: "Папка игры",
    f7d: "Удобный доступ к файлам мира, модов и настроек.",
    f8t: "Самообновление",
    f8d: "Лаунчер умеет предлагать новую версию APK, если вы ставите его не из магазина.",
    f9t: "Темы оформления",
    f9d: "Тёмная оболочка лаунчера и набор цветовых пресетов.",
    ecoTitle: "Моды, которые вы уже знаете",
    howTitle: "Как начать",
    s1t: "Установите APK",
    s1d: "Скачайте свежий релиз и разрешите установку из этого источника.",
    s2t: "Выберите версию",
    s2d: "Скачайте нужную сборку Java Edition и при желании моды.",
    s3t: "Жмите «Играть»",
    s3d: "Синяя кнопка запуска — как в лаунчере. Дальше мир ваш.",
    dlTitle: "Скачать VMcraft",
    allVersions: "Все версии",
    verTitle: "Версии VMcraft",
    verSub: "Скачайте текущую или любую предыдущую сборку лаунчера.",
    verLatest: "Актуальная",
    verEmpty: "Пока нет опубликованных версий.",
    verError: "Не удалось загрузить список версий. Попробуйте обновить страницу.",
    ytTitle: "Наш YouTube канал",
    ytSub: "Гайды, сборки и новости лаунчера — на канале @Воваааанчик.",
    ytBtn: "Открыть YouTube",
    legal: "VMcraft — независимый проект. Он не связан с Mojang, Microsoft и Minecraft. Minecraft является товарным знаком Mojang Synergies AB.",
    copy: "© VMcraft · VMRcompany"
  },
  en: {
    navFeat: "Features",
    navMods: "Mods",
    navDl: "Download",
    navVersions: "Versions",
    lang: "RU",
    kicker: "Android · Java Edition · v",
    h1: "Minecraft: Java Edition in your pocket.",
    lead: "VMcraft is a Minecraft: Java Edition launcher for Android. Download versions, install mods and modpacks, customize touch controls, and play on your phone or tablet.",
    play: "Download APK",
    yt: "Our YouTube channel",
    android: "Android 5.0+",
    pkg: "Package",
    banner: "VMcraft – Minecraft Java Edition launcher for Android",
    mockPlay: "Play",
    featTitle: "What VMcraft can do",
    featSub: "Everything you need to run Java Edition on a phone — without the clutter.",
    f1t: "Launch Java Edition",
    f1d: "Play Minecraft: Java Edition on a smartphone or tablet.",
    f2t: "Versions & instances",
    f2d: "Pick a game version and keep separate instances for different worlds.",
    f3t: "Mods & modpacks",
    f3d: "Install mods and modpacks from inside the launcher.",
    f4t: "Microsoft & local profile",
    f4d: "Sign in with a Microsoft account or use a local profile.",
    f5t: "Touch controls",
    f5d: "Custom on-screen buttons mapped the way you play.",
    f6t: "JAR installers",
    f6d: "Run .jar installers when you need them.",
    f7t: "Game folder",
    f7d: "Quick access to worlds, mods, and settings files.",
    f8t: "Self-update",
    f8d: "Sideloaded builds can check GitHub for a newer APK.",
    f9t: "Themes",
    f9d: "Dark launcher chrome plus color presets.",
    ecoTitle: "Loaders you already know",
    howTitle: "How to start",
    s1t: "Install the APK",
    s1d: "Grab the latest release and allow installs from this source.",
    s2t: "Pick a version",
    s2d: "Download the Java Edition build you want, plus mods if you like.",
    s3t: "Hit Play",
    s3d: "The blue launch button is the same one as in the app.",
    dlTitle: "Download VMcraft",
    allVersions: "All versions",
    verTitle: "VMcraft versions",
    verSub: "Download the current build or any previous launcher release.",
    verLatest: "Latest",
    verEmpty: "No published versions yet.",
    verError: "Could not load the version list. Refresh the page and try again.",
    ytTitle: "Our YouTube channel",
    ytSub: "Guides, packs, and launcher news on @Воваааанчик.",
    ytBtn: "Open YouTube",
    legal: "VMcraft is an independent project. It is not affiliated with Mojang, Microsoft, or Minecraft. Minecraft is a trademark of Mojang Synergies AB.",
    copy: "© VMcraft · VMRcompany"
  }
};

const savedLang = localStorage.getItem("vmcraft-lang");
let lang = savedLang === "en" || savedLang === "ru" ? savedLang : "ru";

function applyLang() {
  const t = I18N[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.textContent = t[key];
  });
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.textContent = t.lang;
  const onVersions = document.body.dataset.page === "versions";
  if (onVersions) {
    document.title = lang === "ru" ? "Версии VMcraft" : "VMcraft versions";
  } else {
    document.title = lang === "ru"
      ? "VMcraft — лаунчер Minecraft: Java Edition для Android"
      : "VMcraft — Minecraft: Java Edition launcher for Android";
  }
  if (typeof window.renderVersions === "function") window.renderVersions();
}

const langBtnEl = document.getElementById("langBtn");
if (langBtnEl) {
  langBtnEl.addEventListener("click", () => {
    lang = lang === "ru" ? "en" : "ru";
    localStorage.setItem("vmcraft-lang", lang);
    applyLang();
  });
}

applyLang();

async function tryJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function fromGithubRelease() {
  const json = await tryJson(GITHUB_LATEST);
  if (!json) return null;
  const apk = (json.assets || []).find((asset) => /\.apk$/i.test(asset.name));
  if (!apk || !apk.browser_download_url) return null;
  return {
    versionName: json.tag_name || json.name || FALLBACK.versionName,
    apkUrl: apk.browser_download_url
  };
}

async function fetchLatest() {
  try {
    const feed = await tryJson(LATEST_JSON + "?t=" + Date.now());
    if (feed && feed.apkUrl) return feed;
  } catch (_) { /* try GitHub next */ }
  try {
    const gh = await fromGithubRelease();
    if (gh) return gh;
  } catch (_) { /* keep fallback */ }
  return FALLBACK;
}

function applyLatest(data) {
  const version = data.versionName || FALLBACK.versionName;
  const apkUrl = data.apkUrl || FALLBACK.apkUrl;
  document.querySelectorAll("[data-version]").forEach((el) => {
    el.textContent = version;
  });
  document.querySelectorAll("a[data-apk]").forEach((a) => {
    a.href = apkUrl;
    a.removeAttribute("download");
  });
}

async function loadLatest() {
  applyLatest(await fetchLatest());
}

document.querySelectorAll("a[data-apk]").forEach((a) => {
  a.addEventListener("click", async (event) => {
    event.preventDefault();
    const data = await fetchLatest();
    applyLatest(data);
    window.location.assign(data.apkUrl || FALLBACK.apkUrl);
  });
});

if (document.querySelector("a[data-apk], [data-version]")) loadLatest();
