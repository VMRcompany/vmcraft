const LATEST_JSON = "https://raw.githubusercontent.com/VMRcompany/vmcraft-updates/main/latest.json";
const GITHUB_LATEST = "https://api.github.com/repos/VMRcompany/vmcraft-updates/releases/latest";
const FALLBACK = {
  versionName: "0.1.40",
  apkUrl: "https://github.com/VMRcompany/vmcraft-updates/releases/download/0.1.40/VMcraft-0.1.40-release.apk"
};

const I18N = {
  ru: {
    navFeat: "Возможности",
    navHome: "Главная",
    navMods: "Моды",
    navMenu: "Меню",
    navDl: "Скачать",
    navVersions: "Версии",
    navPe: "VMcraftPE",
    lang: "EN",
    kicker: "Android · Java Edition · v",
    h1: "Minecraft: Java Edition — у тебя в кармане.",
    lead: "VMcraft — удобный лаунчер Minecraft: Java Edition на Android. Играйте в Java-версию прямо со смартфона или планшета: версии, моды, сборки и свои настройки — в одном приложении.",
    play: "Скачать APK",
    yt: "Наш YouTube канал",
    android: "Android 6+",
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
    ecoMore: "Каталог модов",
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
    modsTitle: "Моды и модпаки",
    modsSub: "Ставьте моды из Modrinth и CurseForge прямо в VMcraft: Fabric, Quilt, Forge, NeoForge и .mrpack-сборки.",
    modsSearch: "Найти мод…",
    modsTypeMod: "Моды",
    modsTypePack: "Модпаки",
    modsOpen: "На Modrinth",
    modsEmpty: "Ничего не найдено. Попробуйте другой запрос.",
    modsErr: "Не удалось загрузить каталог. Откройте поиск модов в самом лаунчере.",
    modsHowTitle: "Как поставить мод в VMcraft",
    modsH1t: "Откройте поиск модов",
    modsH1d: "В лаунчере найдите Modrinth или CurseForge и введите название.",
    modsH2t: "Выберите загрузчик",
    modsH2d: "Создайте профиль Fabric, Quilt, Forge или NeoForge под нужную версию игры.",
    modsH3t: "Или поставьте сборку",
    modsH3d: "Импортируйте .mrpack или zip — VMcraft сам скачает моды и создаст профиль.",
    ytTitle: "Наш YouTube канал",
    ytSub: "Гайды, сборки и новости лаунчера — на канале @Воваааанчик.",
    ytBtn: "Открыть YouTube",
    legal: "VMcraft — независимый проект. Он не связан с Mojang, Microsoft и Minecraft. Minecraft является товарным знаком Mojang Synergies AB.",
    copy: "© VMcraft · VMRcompany",
    peKicker: "Android · песочница · v",
    peH1: "VMcraftPE — своя игра в кармане.",
    peLead: "VMcraftPE — воксельная песочница MineHolde для Android. В комплекте полноэкранное меню, свои миры, список серверов, настройки и каталог игр, модов и текстур. Это отдельная игра, не лаунчер Java Edition.",
    peAndroid: "Android 5.0+",
    peBanner: "VMcraftPE — игра для Android",
    peFeatTitle: "Что умеет VMcraftPE",
    peFeatSub: "Свободная песочница на телефоне: миры, сеть и обновления из нашего репозитория.",
    peF1t: "Свои миры",
    peF1d: "Кнопка «Играть» открывает локальные миры. Игра, которая ставится вместе с VMcraftPE, в списке называется MineHolde.",
    peF2t: "Мультиплеер",
    peF2d: "«Серверы» показывает онлайн, пинг, адрес, порт и описание. Войти можно по имени, регистрация — на той же панели.",
    peF3t: "Моды и контент",
    peF3d: "Каталог делится на «Всё», «Игры», «Моды» и «Наборы текстур». У пакета обложка, автор и описание, у уже установленного — галочка.",
    peF4t: "Сенсорное управление",
    peF4d: "В мире слева джойстик, внизу панель предметов, справа кнопки меню, поиска и прыжка.",
    peF5t: "Самообновление",
    peF5d: "Сборка, установленная не из магазина, сама проверяет GitHub на новый APK.",
    peF6t: "Бесплатный APK",
    peF6d: "Скачивайте игру напрямую. Пакет app.vmpe.game, архитектура arm64-v8a.",
    peHowTitle: "Как начать",
    peS1t: "Установите APK",
    peS1d: "Скачайте свежий релиз и разрешите установку из этого источника.",
    peS2t: "Откройте VMcraftPE",
    peS2d: "При первом запуске и после обновления игра распаковывает файлы. Дождитесь, пока полоса дойдёт до конца.",
    peS3t: "Играйте",
    peS3d: "«Играть» открывает свои миры. «Серверы» — сеть. «Контент» на экране серверов открывает каталог дополнений.",
    peDlTitle: "Скачать VMcraftPE",
    peAllVersions: "Все версии VMcraftPE",
    peVerTitle: "Версии VMcraftPE",
    peVerSub: "Скачайте текущую или любую предыдущую сборку. Ниже — снимки с телефона и что на них происходит.",
    peShotTitle: "Как выглядит VMcraftPE",
    peShotSub: "Снимки сделаны на телефоне с установленной игрой. Это не макеты: на каждом кадре то, что открывается в приложении.",
    peMenuT: "Главное меню",
    peMenuD: "Меню на весь экран. Сверху логотип VMCRAFT Pocket Edition. Зелёная «Играть» открывает свои миры, красная «Выйти» закрывает игру. Серые «Серверы» и «Настройки» — слева. Внизу справа версия и подпись MineHolde - Games.",
    peSrvT: "Список серверов",
    peSrvD: "Слева имя сервера, число игроков и полоски пинга. Справа адрес, порт, описание, имя, пароль и кнопки «Регистрация» и «Войти». Сверху — «Назад», «Контент» и «Настройки».",
    peSetT: "Настройки",
    peSetD: "Слева разделы, на снимке открыта «Доступность». Справа язык, размер шрифта и масштаб интерфейса. «назначить» меняет число. Внизу «Назад» и флажки технических названий и продвинутых настроек.",
    peAllT: "Каталог, вкладка «Всё»",
    peAllD: "У карточки обложка, название, автор и короткое описание. Галочка значит, что пакет уже стоит. Сверху поиск, снизу листание страниц — на снимке 1 из 838 — и кнопка «Нет обновлений».",
    peGamesT: "Вкладка «Игры»",
    peGamesD: "Здесь отдельные игры, не отдельные моды. На снимке страница 1 из 41. Галочка стоит у тех, что уже установлены.",
    peModsT: "Вкладка «Моды»",
    peModsD: "Дополнения к игре. На снимке страница 1 из 766: самолёты и механизмы. Нажатие на карточку открывает пакет, галочка показывает уже установленные.",
    peTexT: "Наборы текстур",
    peTexD: "Сменный вид блоков и предметов, страница 1 из 32. На снимке REFI Textures, Realism 512, Soothing 32 и Baunilha.",
    peInstT: "Уже установленное",
    peInstD: "Слева список того, что стоит на телефоне, справа описание выбранного. На снимке выбрана игра MineHolde. «Поиск онлайн контента» открывает каталог, «Удалить» снимает выбранный пункт.",
    peWorldT: "В мире",
    peWorldD: "Обычный мир. Кружок слева — джойстик ходьбы. Внизу девять ячеек, выбранная обведена жёлтым. Справа кнопки меню, поиска и прыжка.",
    pePauseT: "Меню внутри мира",
    pePauseD: "Кнопка меню открывает чат, инвентарь, «Бросить» и «Выйти». Дальше режимы полёта, быстрого хода и прохода сквозь стены, отладка, смена камеры, лимит видимости, миникарта и журнал чата.",
    peLegal: "VMcraftPE — независимый проект VMRcompany. Он не связан с Mojang, Microsoft и Minecraft. Minecraft является товарным знаком Mojang Synergies AB.",
    navPrivacy: "Конфиденциальность",
    cookieText: "Мы используем cookies, чтобы сайт работал удобнее.",
    cookiePolicy: "Политика конфиденциальности",
    cookieAccept: "Принять",
    privacyTitle: "Политика конфиденциальности",
    privacyUpdated: "Это официальный сайт проекта VMcraft: vmcraft.mineholde.pro. Оператор: MineHolde Apps&Games.",
    privacyH1: "Какие данные мы обрабатываем",
    privacyP1: "Сайт статический. Мы не просим имя, почту или пароль. В браузере могут сохраняться язык интерфейса и согласие на cookies.",
    privacyH2: "Cookies",
    privacyP2: "Cookies и похожие данные нужны, чтобы запомнить язык, согласие на cookies и работу счётчика посещений. Пока вы не примете cookies, виджет показывается при заходе на сайт.",
    privacyH3: "Аналитика",
    privacyP3: "На главной странице может работать Яндекс Метрика. Она собирает обезличенную статистику визитов. Подробности — в политике Яндекса.",
    privacyH4: "Сторонние сервисы",
    privacyP4: "Ссылки ведут на GitHub, RuStore, APKPure и YouTube. Их правила обработки данных задают эти сервисы. Хостинг страниц — GitHub Pages.",
    privacyH5: "Как отказаться",
    privacyP5: "Можно очистить данные сайта в настройках браузера. Тогда виджет cookies появится снова. Также можно отключить cookies и счётчики в самом браузере.",
    privacyH6: "Контакты",
    privacyP6: "По вопросам политики пишите на support.mineholde@gmail.com",
    footSupport: "Оставьте свой вопрос или обратитесь в поддержку на support.mineholde@gmail.com"
  },
  en: {
    navFeat: "Features",
    navHome: "Home",
    navMods: "Mods",
    navMenu: "Menu",
    navDl: "Download",
    navVersions: "Versions",
    navPe: "VMcraftPE",
    lang: "RU",
    kicker: "Android · Java Edition · v",
    h1: "Minecraft: Java Edition in your pocket.",
    lead: "VMcraft is a Minecraft: Java Edition launcher for Android. Download versions, install mods and modpacks, customize touch controls, and play on your phone or tablet.",
    play: "Download APK",
    yt: "Our YouTube channel",
    android: "Android 6+",
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
    ecoMore: "Mods catalog",
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
    modsTitle: "Mods and modpacks",
    modsSub: "Install mods from Modrinth and CurseForge inside VMcraft: Fabric, Quilt, Forge, NeoForge, and .mrpack packs.",
    modsSearch: "Search mods…",
    modsTypeMod: "Mods",
    modsTypePack: "Modpacks",
    modsOpen: "On Modrinth",
    modsEmpty: "Nothing found. Try another query.",
    modsErr: "Could not load the catalog. Search for mods inside the launcher.",
    modsHowTitle: "How to install a mod in VMcraft",
    modsH1t: "Open mod search",
    modsH1d: "In the launcher, open Modrinth or CurseForge and type a name.",
    modsH2t: "Pick a loader",
    modsH2d: "Create a Fabric, Quilt, Forge, or NeoForge profile for your game version.",
    modsH3t: "Or import a pack",
    modsH3d: "Import a .mrpack or zip — VMcraft downloads the mods and creates a profile.",
    ytTitle: "Our YouTube channel",
    ytSub: "Guides, packs, and launcher news on @Воваааанчик.",
    ytBtn: "Open YouTube",
    legal: "VMcraft is an independent project. It is not affiliated with Mojang, Microsoft, or Minecraft. Minecraft is a trademark of Mojang Synergies AB.",
    copy: "© VMcraft · VMRcompany",
    peKicker: "Android · sandbox · v",
    peH1: "VMcraftPE — a game in your pocket.",
    peLead: "VMcraftPE is the MineHolde voxel sandbox for Android. It includes a fullscreen menu, local worlds, a server list, settings, and a catalog of games, mods, and textures. It is a separate game, not the Java Edition launcher.",
    peAndroid: "Android 5.0+",
    peBanner: "VMcraftPE — Android game",
    peFeatTitle: "What VMcraftPE can do",
    peFeatSub: "A free sandbox on your phone: worlds, multiplayer, and updates from our repository.",
    peF1t: "Your worlds",
    peF1d: "Play opens your local worlds. The game bundled with VMcraftPE is listed as MineHolde.",
    peF2t: "Multiplayer",
    peF2d: "Servers shows the player count, ping, address, port, and description. Log in with a name; registration is on the same panel.",
    peF3t: "Mods and content",
    peF3d: "The catalog is split into All, Games, Mods, and Texture packs. Each card has a cover, author, and description. A check mark means it is already installed.",
    peF4t: "Touch controls",
    peF4d: "In a world the joystick is on the left, the hotbar is at the bottom, and menu, search, and jump sit on the right.",
    peF5t: "Self-update",
    peF5d: "Sideloaded builds check GitHub for a newer APK.",
    peF6t: "Free APK",
    peF6d: "Download the game directly. Package app.vmpe.game, arm64-v8a.",
    peHowTitle: "How to start",
    peS1t: "Install the APK",
    peS1d: "Grab the latest release and allow installs from this source.",
    peS2t: "Open VMcraftPE",
    peS2d: "On the first launch and after an update the game unpacks its files. Wait until the bar finishes.",
    peS3t: "Play",
    peS3d: "Play opens local worlds. Servers is the network list. Content on the server screen opens the catalog.",
    peDlTitle: "Download VMcraftPE",
    peAllVersions: "All VMcraftPE versions",
    peVerTitle: "VMcraftPE versions",
    peVerSub: "Download the current build or any previous release. The phone screenshots below show what each screen does.",
    peShotTitle: "What VMcraftPE looks like",
    peShotSub: "These shots were taken on a phone with the game installed. They are real screens, not mockups.",
    peMenuT: "Main menu",
    peMenuD: "The menu fills the screen. The VMCRAFT Pocket Edition logo is at the top. Green Play opens local worlds, red Exit closes the game. Gray Servers and Settings are on the left. Version and MineHolde - Games sit at the lower right.",
    peSrvT: "Server list",
    peSrvD: "The left side shows the server name, player count, and ping bars. The right side has the address, port, description, name, password, and Register and Log in. Back, Content, and Settings are along the top.",
    peSetT: "Settings",
    peSetD: "Sections are on the left; Accessibility is open here. On the right you change language, font size, and interface scale. Assign changes a number. Back and the technical-name and advanced toggles are at the bottom.",
    peAllT: "Catalog, All",
    peAllD: "Each card has a cover, title, author, and short description. A check mark means the package is installed. Search is at the top. Page controls show 1 of 838 here, next to No updates.",
    peGamesT: "Games tab",
    peGamesD: "These are whole games, not single mods. This shot is page 1 of 41. A check mark means that game is already installed.",
    peModsT: "Mods tab",
    peModsD: "Add-ons for a game. This shot is page 1 of 766: planes and machines. Tap a card to open the package. A check mark means it is installed.",
    peTexT: "Texture packs",
    peTexD: "A different look for blocks and items, page 1 of 32. This shot shows REFI Textures, Realism 512, Soothing 32, and Baunilha.",
    peInstT: "Installed content",
    peInstD: "The list on the left is what is already on the phone. The description of the selection is on the right. MineHolde is selected here. Browse online content opens the catalog. Delete removes the selected item.",
    peWorldT: "In a world",
    peWorldD: "A normal world. The circle on the left is the walk joystick. Nine item slots sit at the bottom; the selected one has a yellow border. Menu, search, and jump are on the right.",
    pePauseT: "In-world menu",
    pePauseD: "The menu button opens chat, inventory, Drop, and Exit. Below that are fly, fast mode, no-clip, debug, camera, view range, the minimap, and the chat log.",
    peLegal: "VMcraftPE is an independent VMRcompany project. It is not affiliated with Mojang, Microsoft, or Minecraft. Minecraft is a trademark of Mojang Synergies AB.",
    navPrivacy: "Privacy",
    cookieText: "We use cookies to keep the site working smoothly.",
    cookiePolicy: "Privacy policy",
    cookieAccept: "Accept",
    privacyTitle: "Privacy policy",
    privacyUpdated: "This is the official VMcraft project site: vmcraft.mineholde.pro. Operator: MineHolde Apps&Games.",
    privacyH1: "What data we process",
    privacyP1: "This is a static site. We do not ask for a name, email, or password. The browser may store the interface language and cookie consent.",
    privacyH2: "Cookies",
    privacyP2: "Cookies and similar data remember the language, cookie consent, and visit statistics. Until you accept cookies, the widget is shown when you open the site.",
    privacyH3: "Analytics",
    privacyP3: "The home page may run Yandex Metrica. It collects anonymized visit stats. See Yandex’s policy for details.",
    privacyH4: "Third parties",
    privacyP4: "Links go to GitHub, RuStore, APKPure, and YouTube. Those services set their own data rules. Pages are hosted on GitHub Pages.",
    privacyH5: "How to opt out",
    privacyP5: "You can clear this site’s data in browser settings. The cookie widget will show again. You can also disable cookies and trackers in the browser.",
    privacyH6: "Contact",
    privacyP6: "For privacy questions, write to support.mineholde@gmail.com",
    footSupport: "Leave your question or contact support at support.mineholde@gmail.com"
  }
};

const savedLang = localStorage.getItem("vmcraft-lang");
let lang = savedLang === "en" || savedLang === "ru" ? savedLang : "ru";

const SEO = {
  home: {
    ru: { title: "VMcraft — лаунчер Minecraft Java Edition для Android", desc: "Скачайте VMcraft: лаунчер Minecraft: Java Edition на Android. Версии, моды, модпаки и сенсорное управление." },
    en: { title: "VMcraft — Minecraft Java Edition launcher for Android", desc: "Download VMcraft, a Minecraft: Java Edition launcher for Android. Versions, mods, modpacks, and touch controls." }
  },
  mods: {
    ru: { title: "Моды для VMcraft — Fabric, Forge, Modrinth, CurseForge", desc: "Как ставить моды и модпаки в VMcraft на Android: Modrinth, CurseForge, Fabric, Quilt, Forge, NeoForge и .mrpack." },
    en: { title: "VMcraft mods — Fabric, Forge, Modrinth, CurseForge", desc: "Install mods and modpacks in VMcraft on Android via Modrinth, CurseForge, Fabric, Quilt, Forge, NeoForge, and .mrpack." }
  },
  versions: {
    ru: { title: "Скачать VMcraft — все версии APK", desc: "Все версии лаунчера VMcraft для Android. Скачайте актуальную или предыдущую сборку APK." },
    en: { title: "Download VMcraft — all APK versions", desc: "Every VMcraft Android launcher release. Download the latest or an older APK build." }
  },
  pe: {
    ru: { title: "VMcraftPE — воксельная песочница для Android", desc: "Скачайте VMcraftPE: своя игра на Android. Миры, мультиплеер, моды и актуальный APK." },
    en: { title: "VMcraftPE — voxel sandbox for Android", desc: "Download VMcraftPE, a voxel sandbox game for Android. Worlds, multiplayer, mods, and the latest APK." }
  },
  "pe-versions": {
    ru: { title: "Скачать VMcraftPE — все версии APK", desc: "Все версии игры VMcraftPE для Android. Скачайте актуальную или предыдущую сборку." },
    en: { title: "Download VMcraftPE — all APK versions", desc: "Every VMcraftPE Android game release. Download the latest or an older APK." }
  },
  privacy: {
    ru: { title: "Политика конфиденциальности — VMcraft", desc: "Политика конфиденциальности сайта VMcraft: cookies, аналитика и обработка данных." },
    en: { title: "Privacy policy — VMcraft", desc: "VMcraft website privacy policy: cookies, analytics, and data processing." }
  }
};

function applySeo() {
  const page = document.body.dataset.page || "home";
  const pack = SEO[page] && SEO[page][lang];
  if (!pack) return;
  document.title = pack.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", pack.desc);
  const ogt = document.querySelector('meta[property="og:title"]');
  if (ogt) ogt.setAttribute("content", pack.title);
  const ogd = document.querySelector('meta[property="og:description"]');
  if (ogd) ogd.setAttribute("content", pack.desc);
}

function markActiveNav() {
  const page = document.body.dataset.page || "home";
  document.querySelectorAll(".nav-links a[data-nav]").forEach((a) => {
    a.classList.toggle("is-active", a.getAttribute("data-nav") === page);
  });
}

function applyLang() {
  const t = I18N[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!t[key]) return;
    if (key === "privacyP6" || key === "footSupport") {
      el.innerHTML = t[key].replace(
        /support\.mineholde@gmail\.com/g,
        '<a href="mailto:support.mineholde@gmail.com">support.mineholde@gmail.com</a>'
      );
    } else {
      el.textContent = t[key];
    }
  });
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.textContent = t.lang;
  const menuBtnLabel = document.getElementById("menuBtn");
  if (menuBtnLabel) menuBtnLabel.setAttribute("aria-label", t.navMenu);
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key]) el.setAttribute("placeholder", t[key]);
  });
  applySeo();
  markActiveNav();
  if (typeof window.renderVersions === "function") window.renderVersions();
  if (typeof window.renderPeVersions === "function") window.renderPeVersions();
  if (typeof window.renderModCards === "function") window.renderModCards();
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

function versionParts(tag) {
  return String(tag || "")
    .replace(/^v/i, "")
    .split(/[^\d]+/)
    .filter(Boolean)
    .map((n) => parseInt(n, 10));
}

function newerRelease(a, b) {
  if (!a) return b;
  if (!b) return a;
  const pa = versionParts(a.versionName);
  const pb = versionParts(b.versionName);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d > 0 ? a : b;
  }
  return a;
}

async function fromGithubReleasesList() {
  const data = await tryJson("https://api.github.com/repos/VMRcompany/vmcraft-updates/releases?per_page=30");
  if (!Array.isArray(data) || !data.length) return null;
  let best = null;
  data.forEach((rel) => {
    if (!rel || rel.draft) return;
    const apk = (rel.assets || []).find((asset) => /\.apk$/i.test(asset.name));
    if (!apk || !apk.browser_download_url) return;
    best = newerRelease(best, {
      versionName: rel.tag_name || rel.name || "",
      apkUrl: apk.browser_download_url
    });
  });
  return best;
}

async function fetchLatest() {
  const found = [];
  try {
    const gh = await fromGithubRelease();
    if (gh) found.push(gh);
  } catch (_) { /* next */ }
  try {
    const list = await fromGithubReleasesList();
    if (list) found.push(list);
  } catch (_) { /* next */ }
  try {
    const feed = await tryJson(LATEST_JSON + "?t=" + Date.now());
    if (feed && feed.apkUrl) {
      found.push({
        versionName: feed.versionName || feed.tag_name || "",
        apkUrl: feed.apkUrl
      });
    }
  } catch (_) { /* keep others */ }
  return found.reduce(newerRelease, null) || FALLBACK;
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

const PE_GITHUB_LATEST = "https://api.github.com/repos/VMRcompany/VMcraftPE/releases/latest";
const PE_FALLBACK = {
  versionName: "0.2.1",
  apkUrl: "https://github.com/VMRcompany/VMcraftPE/releases/download/v5180009/VMcraftPE.apk"
};

async function fromPeGithubRelease() {
  const json = await tryJson(PE_GITHUB_LATEST);
  if (!json) return null;
  const apk = (json.assets || []).find((asset) => /\.apk$/i.test(asset.name));
  if (!apk || !apk.browser_download_url) return null;
  const name = (json.name || "").trim();
  return {
    versionName: /^\d+\.\d+/.test(name) ? name : (json.tag_name || PE_FALLBACK.versionName).replace(/^v/i, ""),
    apkUrl: apk.browser_download_url
  };
}

async function fetchPeLatest() {
  try {
    const gh = await fromPeGithubRelease();
    if (gh) return gh;
  } catch (_) { /* keep fallback */ }
  return PE_FALLBACK;
}

function applyPeLatest(data) {
  const version = data.versionName || PE_FALLBACK.versionName;
  const apkUrl = data.apkUrl || PE_FALLBACK.apkUrl;
  document.querySelectorAll("[data-version-pe]").forEach((el) => {
    el.textContent = version;
  });
  document.querySelectorAll("a[data-apk-pe]").forEach((a) => {
    a.href = apkUrl;
    a.removeAttribute("download");
  });
}

async function loadPeLatest() {
  applyPeLatest(await fetchPeLatest());
}

document.querySelectorAll("a[data-apk-pe]").forEach((a) => {
  a.addEventListener("click", async (event) => {
    event.preventDefault();
    const data = await fetchPeLatest();
    applyPeLatest(data);
    window.location.assign(data.apkUrl || PE_FALLBACK.apkUrl);
  });
});

if (document.querySelector("a[data-apk-pe], [data-version-pe]")) loadPeLatest();

(function setupHomeBg() {
  const video = document.querySelector(".home-bg-video");
  if (!video) return;
  const play = () => video.play().catch(() => {});
  play();
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) play();
  });
})();

(function setupMenu() {
  const nav = document.getElementById("siteNav");
  const btn = document.getElementById("menuBtn");
  if (!nav || !btn) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  const close = () => {
    nav.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  };
  nav.querySelectorAll(".nav-links a").forEach((a) => {
    a.addEventListener("click", close);
  });
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();
