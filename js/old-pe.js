(function () {
  var API = "https://content.luanti.org";
  var root = document.getElementById("oldpe");
  var bootPath = location.pathname;
  if (!root) return;
  if (bootPath !== "/old-pe" && bootPath.indexOf("/old-pe/") !== 0) return;

  var catalog = null;
  var catalogWait = null;

  var shots = [
    ["menu.jpg", "Главное меню", "Меню на весь экран. Сверху логотип VMCRAFT Pocket Edition. Зелёная «Играть» открывает свои миры, красная «Выйти» закрывает игру. Серые «Серверы» и «Настройки» — слева. Внизу справа версия и подпись MineHolde - Games."],
    ["servers.jpg", "Список серверов", "Слева имя сервера, число игроков и полоски пинга. Справа адрес, порт, описание, имя, пароль и кнопки «Регистрация» и «Войти». Сверху — «Назад», «Контент» и «Настройки»."],
    ["settings.jpg", "Настройки", "Слева разделы, на снимке открыта «Доступность». Справа язык, размер шрифта и масштаб интерфейса. «назначить» меняет число. Внизу «Назад» и флажки технических названий и продвинутых настроек."],
    ["content.jpg", "Каталог, вкладка «Всё»", "У карточки обложка, название, автор и короткое описание. Галочка значит, что пакет уже стоит. Сверху поиск, снизу листание страниц — на снимке 1 из 838 — и кнопка «Нет обновлений»."],
    ["games.jpg", "Вкладка «Игры»", "Здесь отдельные игры, не отдельные моды. На снимке страница 1 из 41. Галочка стоит у тех, что уже установлены."],
    ["mods.jpg", "Вкладка «Моды»", "Дополнения к игре. На снимке страница 1 из 766: самолёты и механизмы. Нажатие на карточку открывает пакет, галочка показывает уже установленные."],
    ["textures.jpg", "Наборы текстур", "Сменный вид блоков и предметов, страница 1 из 32. На снимке REFI Textures, Realism 512, Soothing 32 и Baunilha."],
    ["installed.jpg", "Уже установленное", "Слева список того, что стоит на телефоне, справа описание выбранного. На снимке выбрана игра MineHolde. «Поиск онлайн контента» открывает каталог, «Удалить» снимает выбранный пункт."],
    ["world.jpg", "В мире", "Обычный мир. Кружок слева — джойстик ходьбы. Внизу девять ячеек, выбранная обведена жёлтым. Справа кнопки меню, поиска и прыжка."],
    ["pause.jpg", "Меню внутри мира", "Кнопка меню открывает чат, инвентарь, «Бросить» и «Выйти». Дальше режимы полёта, быстрого хода и прохода сквозь стены, отладка, смена камеры, лимит видимости, миникарта и журнал чата."]
  ];

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function typeLabel(type) {
    var key = String(type || "").toLowerCase();
    if (key === "game") return "Игра";
    if (key === "txp") return "Набор текстур";
    if (key === "mod") return "Мод";
    return type || "";
  }

  function route() {
    var path = decodeURIComponent(location.pathname).replace(/\/index\.html$/i, "");
    if (path.length > 1 && path.charAt(path.length - 1) === "/") path = path.slice(0, -1);
    if (path === "/old-pe") return { name: "home" };
    if (path === "/old-pe/download-versions") return { name: "downloads" };
    if (path === "/old-pe/packages") return { name: "store" };
    var parts = path.split("/");
    if (parts.length === 4 && parts[1] === "old-pe" && parts[2] && parts[3]) {
      return { name: "package", author: parts[2], pkg: parts[3] };
    }
    return { name: "missing" };
  }

  function query() {
    return new URLSearchParams(location.search);
  }

  function go(href) {
    var url = new URL(href, location.origin);
    history.pushState({}, "", url.pathname + url.search + url.hash);
    render();
    var target = url.hash && document.querySelector(url.hash);
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }

  function md(src) {
    var text = esc(src || "").replace(/\r\n/g, "\n");
    text = text.replace(/```([\s\S]*?)```/g, function (_, code) {
      return "<pre><code>" + code + "</code></pre>";
    });
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
    text = text.replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, '<img src="$2" alt="$1">');
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    text = text.replace(/^#### (.*)$/gm, "<h4>$1</h4>");
    text = text.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    text = text.replace(/^## (.*)$/gm, "<h2>$1</h2>");
    text = text.replace(/^# (.*)$/gm, "<h2>$1</h2>");
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    var lines = text.split("\n");
    var out = "";
    var list = "";
    function close() {
      if (list) out += list === "ol" ? "</ol>" : "</ul>";
      list = "";
    }
    lines.forEach(function (line) {
      var bullet = line.match(/^\s*[-*] (.*)$/);
      var numbered = line.match(/^\s*\d+\. (.*)$/);
      if (bullet) {
        if (list !== "ul") { close(); out += "<ul>"; list = "ul"; }
        out += "<li>" + bullet[1] + "</li>";
      } else if (numbered) {
        if (list !== "ol") { close(); out += "<ol>"; list = "ol"; }
        out += "<li>" + numbered[1] + "</li>";
      } else if (!line.trim()) {
        close();
      } else if (/^<(h[2-4]|pre)/.test(line)) {
        close();
        out += line;
      } else {
        close();
        out += "<p>" + line + "</p>";
      }
    });
    close();
    return out;
  }

  function shell(current, body) {
    var links = [
      ["/old-pe/#features", "Особенности", "home"],
      ["/old-pe/#gallery", "Галерея", "home"],
      ["/old-pe/download-versions/", "Скачать", "downloads"],
      ["/old-pe/packages/", "Магазин", "store"]
    ];
    root.innerHTML =
      '<header class="op-nav"><div class="op-nav-inner">' +
        '<a class="op-brand" href="/old-pe/"><img src="/images/pe/icon.png" alt="">Старая (альфа) PE</a>' +
        '<button class="op-burger" type="button" aria-label="Меню"><span></span><span></span><span></span></button>' +
        '<nav class="op-links">' + links.map(function (item) {
          return '<a href="' + item[0] + '"' + (item[2] === current ? ' class="is-current"' : "") + ">" + item[1] + "</a>";
        }).join("") +
        '<a href="/pe.html">VMcraftPE</a></nav>' +
        '<div class="op-nav-end"><a class="op-btn op-btn-green" href="/old-pe/download-versions/">Скачать</a></div>' +
      "</div></header>" +
      '<main>' + body + "</main>" +
      '<footer class="op-foot"><div class="op-wrap">' +
        '<p><a href="/old-pe/">Старая (альфа) PE</a><a href="/old-pe/packages/">Магазин</a><a href="/old-pe/download-versions/">Версии</a><a href="/pe.html">VMcraftPE</a><a href="/privacy.html">Конфиденциальность</a></p>' +
        "<p>Старая (альфа) PE — страница VMcraftPE от VMRcompany. Каталог читает публичный API ContentDB и показывает настоящие пакеты. Это не официальный сайт Luanti и не связано с Mojang, Microsoft и Minecraft.</p>" +
      "</div></footer>" +
      '<aside class="op-cookie" id="cookieBanner"><p>Мы используем cookies, чтобы сайт работал удобнее. <a href="/privacy.html">Политика конфиденциальности</a></p><button class="op-btn op-btn-green" id="cookieAccept" type="button">Принять</button></aside>';
    var burger = root.querySelector(".op-burger");
    var nav = root.querySelector(".op-nav");
    if (burger) burger.addEventListener("click", function () { nav.classList.toggle("is-open"); });
    setupCookies();
  }

  function setupCookies() {
    var banner = document.getElementById("cookieBanner");
    var btn = document.getElementById("cookieAccept");
    if (!banner || !btn) return;
    var ok = false;
    try { ok = localStorage.getItem("vmcraft-cookies-ok") === "1"; } catch (e) {}
    if (ok) {
      document.documentElement.classList.remove("cookie-pending");
      return;
    }
    document.documentElement.classList.add("cookie-pending");
    btn.addEventListener("click", function () {
      try { localStorage.setItem("vmcraft-cookies-ok", "1"); } catch (e) {}
      document.documentElement.classList.remove("cookie-pending");
    });
  }

  function galleryHtml() {
    return shots.map(function (shot) {
      return '<figure><img src="/images/pe/shots/' + shot[0] + '" alt="' + esc(shot[1]) + '"><figcaption><strong>' + esc(shot[1]) + ".</strong> " + esc(shot[2]) + "</figcaption></figure>";
    }).join("");
  }

  function renderHome() {
    document.title = "Старая (альфа) PE — VMcraftPE";
    shell("home",
      '<section class="op-hero"><div class="op-wrap">' +
        "<h1>Старая (альфа) PE</h1>" +
        '<i class="op-kicker">VMcraftPE для Android</i>' +
        '<p class="op-lead">Воксельная песочница MineHolde на телефоне: свои миры, серверы, настройки и каталог игр, модов и текстур. Ниже — реальные кадры с телефона и тот же каталог, что открывается в игре.</p>' +
        '<div class="op-actions"><a class="op-btn op-btn-blue" href="/old-pe/#features">Узнать больше</a><a class="op-btn op-btn-green" href="/old-pe/download-versions/">Скачать</a></div>' +
        '<p class="op-news" id="opNews"><strong>Новости:</strong> версии APK собраны на странице скачивания.</p>' +
      "</div></section>" +
      '<section class="op-section" id="features"><div class="op-wrap"><h2>Особенности</h2><div class="op-cols">' +
        "<div><h3>В игре</h3>" +
          "<h4>Свои миры</h4><p>«Играть» открывает локальные миры. Игра, которая ставится вместе с приложением, в списке называется MineHolde.</p>" +
          "<h4>Серверы</h4><p>Список показывает онлайн, пинг, адрес, порт и описание. Войти можно по имени на той же панели.</p>" +
          "<h4>Каталог в клиенте</h4><p>Игры, моды и наборы текстур ставятся из приложения. Превью пакета открывает его страницу на этом сайте.</p>" +
          "<h4>Управление пальцем</h4><p>В мире слева джойстик, внизу панель предметов, справа меню, поиск и прыжок.</p>" +
        "</div>" +
        "<div><h3>На сайте</h3>" +
          "<h4>Магазин</h4><p>Раздел читает публичный API каталога: поиск, фильтр по типу, описание, снимки, зависимости и отзывы настоящего пакета.</p>" +
          "<h4>Страница пакета</h4><p>Адрес вида /old-pe/автор/название/ — это идентификатор пакета в каталоге.</p>" +
          "<h4>Все сборки</h4><p>На странице версий каждая сборка VMcraftPE скачивается одним нажатием.</p>" +
          "<h4>Снимки с телефона</h4><p>Галерея ниже снята в установленном приложении, это не макеты.</p>" +
        "</div></div></div></section>" +
      '<section class="op-section" id="gallery"><div class="op-wrap"><h2>Галерея</h2><div class="op-gallery">' + galleryHtml() + "</div></div></section>"
    );
    fetch("https://api.github.com/repos/VMRcompany/VMcraftPE/releases/latest").then(function (res) {
      return res.ok ? res.json() : null;
    }).then(function (rel) {
      var node = document.getElementById("opNews");
      if (node && rel && rel.name) node.innerHTML = "<strong>Новости:</strong> актуальная сборка " + esc(rel.name) + ".";
    }).catch(function () {});
  }

  function versionParts(label) {
    return String(label || "").replace(/^v/i, "").split(/[^\d]+/).filter(Boolean).map(function (n) { return parseInt(n, 10); });
  }

  function newer(a, b) {
    var pa = versionParts(a.name || a.tag_name);
    var pb = versionParts(b.name || b.tag_name);
    var len = Math.max(pa.length, pb.length);
    for (var i = 0; i < len; i++) {
      var d = (pb[i] || 0) - (pa[i] || 0);
      if (d) return d;
    }
    return 0;
  }

  function apkOf(rel) {
    return (rel.assets || []).filter(function (asset) { return /\.apk$/i.test(asset.name); })[0];
  }

  function renderDownloads() {
    document.title = "Скачать — Старая (альфа) PE";
    shell("downloads", '<section class="op-section"><div class="op-wrap"><h2>Скачать VMcraftPE</h2><p class="op-status" id="opDl">Загрузка списка версий…</p></div></section>');
    Promise.all([
      fetch("https://api.github.com/repos/VMRcompany/VMcraftPE/releases?per_page=100").then(function (res) { return res.ok ? res.json() : []; }).catch(function () { return []; }),
      fetch("/data/pe-releases.json?v=20261123a").then(function (res) { return res.ok ? res.json() : []; }).catch(function () { return []; })
    ]).then(function (lists) {
      var map = {};
      lists[1].concat(lists[0]).forEach(function (rel) {
        if (!rel || rel.draft || !apkOf(rel)) return;
        map[rel.tag_name || rel.name] = rel;
      });
      var items = Object.keys(map).map(function (key) { return map[key]; }).sort(newer);
      var box = document.getElementById("opDl");
      if (!box) return;
      if (!items.length) {
        box.textContent = "Список версий сейчас недоступен.";
        return;
      }
      box.outerHTML = items.map(function (rel, index) {
        var apk = apkOf(rel);
        var when = rel.published_at ? new Date(rel.published_at).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" }) : "";
        var size = apk.size ? (apk.size / (1024 * 1024)).toFixed(1).replace(".", ",") + " МБ" : "";
        return '<article class="op-ver"><div><h3>VMcraftPE ' + esc(rel.name || rel.tag_name) + (index === 0 ? '<span class="op-badge">Актуальная</span>' : "") + "</h3><p>" + esc([when, size].filter(Boolean).join(" · ")) + "</p><p>" + esc(rel.body || "") + '</p></div><a class="op-btn op-btn-green" href="' + esc(apk.browser_download_url) + '">Скачать</a></article>';
      }).join("");
    });
  }

  function loadCatalog() {
    if (catalog) return Promise.resolve(catalog);
    if (catalogWait) return catalogWait;
    catalogWait = fetch(API + "/api/packages/?type=mod&type=game&type=txp").then(function (res) {
      if (!res.ok) throw new Error("catalog");
      return res.json();
    }).then(function (data) {
      catalog = Array.isArray(data) ? data : [];
      return catalog;
    });
    return catalogWait;
  }

  function renderStore() {
    document.title = "Магазин — Старая (альфа) PE";
    var params = query();
    var type = params.get("type") || "";
    var q = params.get("q") || "";
    var sort = params.get("sort") || "score";
    var page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
    shell("store",
      '<section class="op-section"><div class="op-wrap"><h2>Магазин</h2>' +
      '<form class="op-tools" id="opSearch">' +
        '<input name="q" value="' + esc(q) + '" placeholder="Поиск по названию и описанию">' +
        '<select name="type"><option value="">Всё</option><option value="game">Игры</option><option value="mod">Моды</option><option value="txp">Наборы текстур</option></select>' +
        '<select name="sort"><option value="score">По оценке</option><option value="downloads">По скачиваниям</option><option value="title">По названию</option></select>' +
        '<button class="op-btn op-btn-green" type="submit">Найти</button>' +
      '</form><div id="opStore"><p class="op-status">Загрузка каталога…</p></div></div></section>'
    );
    var form = document.getElementById("opSearch");
    form.type.value = type;
    form.sort.value = sort;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var next = new URLSearchParams();
      if (form.q.value.trim()) next.set("q", form.q.value.trim());
      if (form.type.value) next.set("type", form.type.value);
      if (form.sort.value && form.sort.value !== "score") next.set("sort", form.sort.value);
      go("/old-pe/packages/" + (next.toString() ? "?" + next.toString() : ""));
    });
    loadCatalog().then(function (items) {
      var needle = q.toLowerCase();
      var filtered = items.filter(function (item) {
        if (type && String(item.type || "").toLowerCase() !== type) return false;
        if (!needle) return true;
        return (item.title + " " + item.author + " " + (item.short_description || "") + " " + item.name).toLowerCase().indexOf(needle) !== -1;
      });
      filtered.sort(function (a, b) {
        if (sort === "title") return String(a.title || "").localeCompare(String(b.title || ""), "ru");
        if (sort === "downloads") return (b.downloads || 0) - (a.downloads || 0);
        return (b.score || 0) - (a.score || 0);
      });
      var per = 24;
      var pages = Math.max(1, Math.ceil(filtered.length / per));
      page = Math.min(page, pages);
      var slice = filtered.slice((page - 1) * per, page * per);
      var html = '<p class="op-meta">Найдено: ' + filtered.length + "</p>";
      if (!slice.length) html += '<p class="op-status">Ничего не нашлось.</p>';
      html += '<div class="op-grid">' + slice.map(function (item) {
        var href = "/old-pe/" + encodeURIComponent(item.author) + "/" + encodeURIComponent(item.name) + "/";
        var thumb = item.thumbnail ? '<img src="' + esc(item.thumbnail) + '" alt="">' : '<img alt="">';
        return '<a class="op-card" href="' + href + '">' + thumb + "<div><span class=\"op-type\">" + esc(typeLabel(item.type)) + "</span><h3>" + esc(item.title || item.name) + "</h3><p>" + esc(item.short_description || "") + '</p><p class="op-meta">' + esc(item.author) + "</p></div></a>";
      }).join("") + "</div>";
      function pageHref(n) {
        var qp = new URLSearchParams(params);
        if (n <= 1) qp.delete("page"); else qp.set("page", String(n));
        return "/old-pe/packages/" + (qp.toString() ? "?" + qp.toString() : "");
      }
      html += '<div class="op-pager">';
      if (page > 1) html += '<a class="op-btn op-btn-ghost" href="' + pageHref(page - 1) + '">Назад</a>';
      html += '<span class="op-meta">' + page + " / " + pages + "</span>";
      if (page < pages) html += '<a class="op-btn op-btn-ghost" href="' + pageHref(page + 1) + '">Дальше</a>';
      html += "</div>";
      var box = document.getElementById("opStore");
      if (box) box.innerHTML = html;
    }).catch(function () {
      var box = document.getElementById("opStore");
      if (box) box.innerHTML = '<p class="op-status">Каталог сейчас не открывается. Повторите попытку позже.</p>';
    });
  }

  function packageUrl(author, name) {
    return API + "/api/packages/" + encodeURIComponent(author) + "/" + encodeURIComponent(name);
  }

  function renderPackage(author, name) {
    document.title = author + "/" + name + " — Старая (альфа) PE";
    shell("store", '<section class="op-section"><div class="op-wrap"><p class="op-status">Загрузка пакета…</p></div></section>');
    Promise.all([
      fetch(packageUrl(author, name) + "/").then(function (res) { if (!res.ok) throw new Error("missing"); return res.json(); }),
      fetch(packageUrl(author, name) + "/screenshots/").then(function (res) { return res.ok ? res.json() : []; }).catch(function () { return []; }),
      fetch(packageUrl(author, name) + "/reviews/").then(function (res) { return res.ok ? res.json() : []; }).catch(function () { return []; }),
      fetch(packageUrl(author, name) + "/dependencies/").then(function (res) { return res.ok ? res.json() : null; }).catch(function () { return null; })
    ]).then(function (result) {
      var pkg = result[0];
      var screens = Array.isArray(result[1]) && result[1].length ? result[1] : (pkg.screenshots || []);
      var reviews = Array.isArray(result[2]) ? result[2] : [];
      var deps = result[3];
      if (!screens.length && pkg.thumbnail) screens = [{ url: pkg.thumbnail, title: pkg.title }];
      var download = API + "/packages/" + encodeURIComponent(pkg.author || author) + "/" + encodeURIComponent(pkg.name || name) + "/download/";
      var side = "<p><span class=\"op-type\">" + esc(typeLabel(pkg.type)) + "</span></p><h2>" + esc(pkg.title || name) + "</h2><p>" + esc(pkg.author || author) + " / " + esc(pkg.name || name) + "</p>";
      if (pkg.license) side += "<p>Лицензия: " + esc(pkg.license) + "</p>";
      if (pkg.media_license) side += "<p>Лицензия медиа: " + esc(pkg.media_license) + "</p>";
      if (pkg.score != null) side += "<p>Оценка: " + esc(pkg.score) + "</p>";
      if (pkg.downloads != null) side += "<p>Скачиваний: " + esc(pkg.downloads) + "</p>";
      if (Array.isArray(pkg.tags) && pkg.tags.length) side += "<p>Метки: " + esc(pkg.tags.join(", ")) + "</p>";
      side += '<a class="op-btn op-btn-green" href="' + esc(download) + '">Скачать пакет</a>';
      [["Сайт", pkg.website], ["Исходный код", pkg.repo], ["Задачи", pkg.issue_tracker], ["Форум", pkg.forum_url], ["Поддержать", pkg.donate_url]].forEach(function (link) {
        if (link[1]) side += '<a class="op-btn op-btn-ghost" href="' + esc(link[1]) + '" target="_blank" rel="noopener">' + link[0] + "</a>";
      });
      var depHtml = "";
      var depList = [];
      if (Array.isArray(deps)) depList = deps;
      else if (deps && Array.isArray(deps.dependencies)) depList = deps.dependencies;
      if (depList.length) {
        depHtml = "<h3>Зависимости</h3><ul>" + depList.map(function (dep) {
          var label = dep.name || dep.dep || dep.mod || dep.package || "";
          var target = dep.packages && dep.packages[0];
          if (target && target.author && target.name) {
            return '<li><a href="/old-pe/' + encodeURIComponent(target.author) + "/" + encodeURIComponent(target.name) + '/">' + esc(label || (target.author + "/" + target.name)) + "</a></li>";
          }
          return "<li>" + esc(label) + (dep.is_optional ? " (необязательно)" : "") + "</li>";
        }).join("") + "</ul>";
      }
      var reviewHtml = reviews.length ? "<h3>Отзывы</h3>" + reviews.map(function (review) {
        var who = review.user && (review.user.display_name || review.user.username) || "";
        var mark = review.rating === 5 ? "за" : review.rating === 1 ? "против" : "нейтрально";
        return '<article class="op-review"><strong>' + esc(review.title || mark) + "</strong><p class=\"op-meta\">" + esc(who) + " · " + esc(mark) + "</p><p>" + esc(review.comment || "") + "</p></article>";
      }).join("") : "";
      document.title = (pkg.title || name) + " — Старая (альфа) PE";
      shell("store",
        '<section class="op-section"><div class="op-wrap"><p class="op-meta"><a href="/old-pe/packages/">Магазин</a> / ' + esc(pkg.author || author) + " / " + esc(pkg.name || name) + "</p>" +
        '<div class="op-package"><div><div class="op-shots">' + screens.map(function (shot) {
          var url = shot.url || shot;
          return '<img src="' + esc(url) + '" alt="' + esc(shot.title || pkg.title || "") + '" data-full="' + esc(url) + '">';
        }).join("") + '</div><div class="op-md">' + md(pkg.long_description || pkg.short_description || "") + "</div>" + depHtml + reviewHtml + "</div><aside class=\"op-side\">" + side + "</aside></div></div></section>"
      );
      root.querySelectorAll(".op-shots img").forEach(function (img) {
        img.addEventListener("click", function () {
          var box = document.createElement("div");
          box.className = "op-light";
          box.innerHTML = '<img src="' + img.getAttribute("data-full") + '" alt="">';
          box.addEventListener("click", function () { box.remove(); });
          document.body.appendChild(box);
        });
      });
    }).catch(function () {
      shell("store", '<section class="op-section"><div class="op-wrap"><h2>Пакет не найден</h2><p><a href="/old-pe/packages/">Вернуться в магазин</a></p></div></section>');
    });
  }

  function render() {
    var page = route();
    if (page.name === "home") renderHome();
    else if (page.name === "downloads") renderDownloads();
    else if (page.name === "store") renderStore();
    else if (page.name === "package") renderPackage(page.author, page.pkg);
    else shell("home", '<section class="op-section"><div class="op-wrap"><h2>Страница не найдена</h2><p><a href="/old-pe/">На главную альфы</a></p></div></section>');
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest ? event.target.closest("a") : null;
    if (!link || link.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var url;
    try { url = new URL(link.href, location.origin); } catch (e) { return; }
    if (url.origin !== location.origin || url.pathname.indexOf("/old-pe") !== 0) return;
    if (/\.apk$/i.test(url.pathname)) return;
    event.preventDefault();
    go(url.pathname + url.search + url.hash);
  });
  window.addEventListener("popstate", function () {
    render();
    var target = location.hash && document.querySelector(location.hash);
    if (target) target.scrollIntoView();
  });
  render();
  var initial = location.hash && document.querySelector(location.hash);
  if (initial) initial.scrollIntoView();
})();
