(function () {
  var root = document.getElementById("forum");
  var pathNow = location.pathname;
  if (!root || (pathNow !== "/forum" && pathNow.indexOf("/forum/") !== 0)) return;

  var KEY = "vmcraft-forum-v1";
  var SESSION = "vmcraft-forum-session";
  var RESERVED = { mods: 1, login: 1, register: 1, new: 1, channels: 1, topic: 1, forum: 1 };

  function empty() {
    return {
      users: [],
      channels: [
        { slug: "general", title: "Общее", about: "Общие разговоры" },
        { slug: "vmcraftpe", title: "VMcraftPE", about: "Песочница на Android" },
        { slug: "minecraft", title: "Minecraft", about: "Моды и обсуждения Minecraft" }
      ],
      posts: [],
      mods: []
    };
  }

  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!data || !Array.isArray(data.users)) return empty();
      data.channels = data.channels && data.channels.length ? data.channels : empty().channels;
      data.posts = data.posts || [];
      data.mods = data.mods || [];
      return data;
    } catch (e) {
      return empty();
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function session() {
    try { return localStorage.getItem(SESSION) || ""; } catch (e) { return ""; }
  }

  function setSession(slug) {
    if (slug) localStorage.setItem(SESSION, slug);
    else localStorage.removeItem(SESSION);
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function userBy(data, slug) {
    for (var i = 0; i < data.users.length; i++) if (data.users[i].slug === slug) return data.users[i];
    return null;
  }

  function me(data) {
    return userBy(data, session());
  }

  function route() {
    var path = decodeURIComponent(location.pathname).replace(/\/index\.html$/i, "");
    if (path.length > 1 && path.charAt(path.length - 1) === "/") path = path.slice(0, -1);
    if (path === "/forum") return { name: "home" };
    if (path === "/forum/mods") return { name: "mods" };
    if (path === "/forum/login") return { name: "login" };
    if (path === "/forum/register") return { name: "register" };
    if (path === "/forum/new") return { name: "new" };
    if (path === "/forum/channels") return { name: "channels" };
    var topic = path.match(/^\/forum\/topic\/([^/]+)\/([^/]+)$/);
    if (topic) return { name: "topic", author: topic[1], pkg: topic[2] };
    var message = path.match(/^\/forum\/([a-z0-9][a-z0-9_-]{1,31})\/(\d+)$/);
    if (message) return { name: "message", slug: message[1], num: message[2] };
    var profile = path.match(/^\/forum\/([a-z0-9][a-z0-9_-]{1,31})$/);
    if (profile) return { name: "profile", slug: profile[1] };
    return { name: "missing" };
  }

  function go(href) {
    var url = new URL(href, location.origin);
    history.pushState({}, "", url.pathname + url.search);
    render();
    window.scrollTo(0, 0);
  }

  function md(src) {
    var text = esc(src || "");
    text = text.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    text = text.replace(/^&gt; (.*)$/gm, "<blockquote>$1</blockquote>");
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    var lines = text.split("\n");
    var out = "";
    var list = false;
    lines.forEach(function (line) {
      var item = line.match(/^- (.*)$/);
      if (item) {
        if (!list) { out += "<ul>"; list = true; }
        out += "<li>" + item[1] + "</li>";
      } else {
        if (list) { out += "</ul>"; list = false; }
        if (line.trim()) out += "<p>" + line + "</p>";
      }
    });
    if (list) out += "</ul>";
    return out;
  }

  function when(iso) {
    try { return new Date(iso).toLocaleString("ru-RU"); } catch (e) { return ""; }
  }

  function shell(data, body) {
    var person = me(data);
    var channels = data.channels.map(function (ch) {
      return '<a href="/forum/?channel=' + encodeURIComponent(ch.slug) + '">' + esc(ch.title) + "</a>";
    }).join("");
    root.innerHTML =
      '<header class="fm-top"><div class="fm-top-inner">' +
        '<a class="fm-brand" href="/forum/"><img src="/images/pe/icon.png" alt=""><span>VMcraft forum<small>от MineHolde - Games</small></span></a>' +
        '<nav class="fm-nav">' +
          '<a href="/forum/">Обсуждения</a>' +
          '<a href="/forum/mods">Моды</a>' +
          '<a href="/forum/channels">Каналы</a>' +
          '<a href="/old-pe/">Старая (альфа) VMcraftPE</a>' +
          (person
            ? '<a href="/forum/' + encodeURIComponent(person.slug) + '/">' + esc(person.nick) + '</a><button class="fm-btn fm-btn-line" id="fmOut" type="button">Выйти</button>'
            : '<a class="fm-btn fm-btn-green" href="/forum/login">Войти</a>') +
        "</nav></div></header>" +
      '<div class="fm-wrap fm-layout"><aside class="fm-side"><a href="/forum/new">Новое обсуждение</a>' + channels +
        '<a href="/forum/mods">Каталог модов</a></aside><div class="fm-main">' + body + "</div></div>" +
      '<footer class="fm-wrap fm-foot">VMcraft forum от MineHolde - Games. Аккаунт, обсуждения и файлы сохраняются в этом браузере.</footer>';
    var out = document.getElementById("fmOut");
    if (out) out.addEventListener("click", function () { setSession(""); render(); });
  }

  function bindEditor(id) {
    root.querySelectorAll("[data-wrap]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var box = document.getElementById(id);
        if (!box) return;
        var pair = btn.getAttribute("data-wrap").split("|");
        var a = box.selectionStart;
        var b = box.selectionEnd;
        var text = box.value;
        box.value = text.slice(0, a) + pair[0] + text.slice(a, b) + (pair[1] || "") + text.slice(b);
        box.focus();
      });
    });
  }

  function editor(id) {
    return '<div class="fm-tools">' +
      '<button type="button" data-wrap="**|**">Жирный</button>' +
      '<button type="button" data-wrap="_|_">Курсив</button>' +
      '<button type="button" data-wrap="- |">Список</button>' +
      '<button type="button" data-wrap="&gt; |">Цитата</button>' +
      '<button type="button" data-wrap="`|`">Код</button>' +
      '<button type="button" data-wrap="[|](https://)">Ссылка</button>' +
      "</div><textarea id=\"" + id + "\" name=\"body\" required></textarea>";
  }

  function renderHome(data) {
    document.title = "VMcraft forum от MineHolde - Games";
    var channel = new URLSearchParams(location.search).get("channel") || "";
    var roots = data.posts.filter(function (post) {
      return !post.parent && (!channel || post.channel === channel) && !post.topic;
    });
    roots.sort(function (a, b) { return String(b.created).localeCompare(String(a.created)); });
    var list = roots.map(function (post) {
      var author = userBy(data, post.author);
      return '<div class="fm-row"><div><a href="/forum/' + encodeURIComponent(post.author) + "/" + post.num + '/">' + esc(post.title || "Сообщение") +
        '</a><div class="fm-meta">' + esc(author ? author.nick : post.author) + " · " + esc(when(post.created)) + "</div></div></div>";
    }).join("") || '<p class="fm-note">Пока нет обсуждений. Заведите первое.</p>';
    shell(data, '<section class="fm-card"><h1>Обсуждения</h1><p class="fm-note">Каналы слева. У каждого сообщения свой адрес.</p>' + list + "</section>");
  }

  function renderNew(data) {
    var person = me(data);
    if (!person) { go("/forum/login"); return; }
    var options = data.channels.map(function (ch) {
      return '<option value="' + esc(ch.slug) + '">' + esc(ch.title) + "</option>";
    }).join("");
    shell(data, '<section class="fm-card"><h1>Новое обсуждение</h1><form class="fm-form" id="fmNew">' +
      '<select name="channel">' + options + "</select>" +
      '<input name="title" required placeholder="Заголовок" maxlength="140">' +
      editor("fmBody") +
      '<input name="file" placeholder="Ссылка на файл, если хотите им поделиться">' +
      '<input name="picture" type="file" accept="image/*">' +
      '<button class="fm-btn fm-btn-green" type="submit">Опубликовать</button></form></section>');
    bindEditor("fmBody");
    document.getElementById("fmNew").addEventListener("submit", function (event) {
      event.preventDefault();
      var form = event.target;
      publish(data, person, {
        channel: form.channel.value,
        title: form.title.value.trim(),
        body: form.body.value,
        file: form.file.value.trim()
      }, form.picture.files[0]);
    });
  }

  function publish(data, person, fields, file) {
    function finish(image) {
      var fresh = userBy(load(), person.slug);
      var store = load();
      fresh = userBy(store, person.slug);
      fresh.nextNum = fresh.nextNum || 1;
      var num = fresh.nextNum++;
      store.posts.push({
        author: fresh.slug,
        num: num,
        channel: fields.channel || "",
        topic: fields.topic || "",
        title: fields.title || "",
        body: fields.body || "",
        file: fields.file || "",
        image: image || "",
        parent: fields.parent || "",
        created: new Date().toISOString()
      });
      save(store);
      go("/forum/" + encodeURIComponent(fresh.slug) + "/" + num + "/");
    }
    if (file && file.size < 350000 && /^image\//.test(file.type)) {
      var reader = new FileReader();
      reader.onload = function () { finish(String(reader.result || "")); };
      reader.readAsDataURL(file);
    } else finish("");
  }

  function findPost(data, slug, num) {
    num = String(num);
    for (var i = 0; i < data.posts.length; i++) {
      if (data.posts[i].author === slug && String(data.posts[i].num) === num) return data.posts[i];
    }
    return null;
  }

  function renderMessage(data, slug, num) {
    var post = findPost(data, slug, num);
    if (!post) {
      shell(data, '<section class="fm-card"><h1>Сообщение не найдено</h1></section>');
      return;
    }
    var author = userBy(data, post.author);
    document.title = (post.title || "Сообщение") + " — VMcraft forum";
    var replies = data.posts.filter(function (item) { return item.parent === post.author + "/" + post.num; });
    var files = "";
    if (post.file) files += '<p><a href="' + esc(post.file) + '" target="_blank" rel="noopener">Файл</a></p>';
    if (post.image) files += '<p><img src="' + post.image + '" alt=""></p>';
    var replyHtml = replies.map(function (item) {
      return '<div class="fm-row"><div><a href="/forum/' + encodeURIComponent(item.author) + "/" + item.num + '/">Ответ</a><div class="fm-body">' + md(item.body) + "</div></div></div>";
    }).join("");
    var form = me(data)
      ? '<form class="fm-form" id="fmReply"><h2>Ответить</h2>' + editor("fmReplyBody") + '<button class="fm-btn fm-btn-green" type="submit">Отправить</button></form>'
      : '<p><a href="/forum/login">Войдите</a>, чтобы ответить.</p>';
    shell(data, '<article class="fm-card"><h1>' + esc(post.title || "Сообщение") + "</h1>" +
      '<p class="fm-meta"><a href="/forum/' + encodeURIComponent(post.author) + '/">' + esc(author ? author.nick : post.author) + "</a> · " + esc(when(post.created)) +
      "<br>Ссылка: /forum/" + esc(post.author) + "/" + esc(post.num) + "/</p>" +
      '<div class="fm-body">' + md(post.body) + "</div>" + files + "</article>" +
      '<section class="fm-card"><h2>Ответы</h2>' + (replyHtml || '<p class="fm-note">Ответов пока нет.</p>') + form + "</section>");
    bindEditor("fmReplyBody");
    var reply = document.getElementById("fmReply");
    if (reply) reply.addEventListener("submit", function (event) {
      event.preventDefault();
      publish(load(), me(load()), { body: reply.body.value, parent: post.author + "/" + post.num, title: "Ответ" }, null);
    });
  }

  function renderProfile(data, slug) {
    var person = userBy(data, slug);
    if (!person) {
      shell(data, '<section class="fm-card"><h1>Такого ника нет</h1></section>');
      return;
    }
    document.title = person.nick + " — VMcraft forum";
    var viewer = me(data);
    var posts = data.posts.filter(function (post) { return post.author === person.slug && !post.parent; });
    var follow = "";
    if (viewer && viewer.slug !== person.slug) {
      var on = (viewer.following || []).indexOf(person.slug) !== -1;
      follow = '<button class="fm-btn fm-btn-green" id="fmFollow" type="button">' + (on ? "Отписаться" : "Подписаться") + "</button>";
    }
    shell(data, '<section class="fm-card"><h1>' + esc(person.nick) + "</h1>" +
      '<p class="fm-meta">Адрес: /forum/' + esc(person.slug) + "/ · подписчики " + (person.followers || []).length + " · подписки " + (person.following || []).length + "</p>" +
      "<p>" + esc(person.about || "") + "</p>" + follow + "</section>" +
      '<section class="fm-card"><h2>Сообщения</h2>' + (posts.map(function (post) {
        return '<div class="fm-row"><a href="/forum/' + encodeURIComponent(post.author) + "/" + post.num + '/">' + esc(post.title || "Сообщение") + "</a></div>";
      }).join("") || '<p class="fm-note">Пока пусто.</p>') + "</section>");
    var button = document.getElementById("fmFollow");
    if (button) button.addEventListener("click", function () {
      var store = load();
      var self = userBy(store, session());
      var other = userBy(store, slug);
      if (!self || !other) return;
      self.following = self.following || [];
      other.followers = other.followers || [];
      var index = self.following.indexOf(other.slug);
      if (index === -1) {
        self.following.push(other.slug);
        if (other.followers.indexOf(self.slug) === -1) other.followers.push(self.slug);
      } else {
        self.following.splice(index, 1);
        other.followers = other.followers.filter(function (name) { return name !== self.slug; });
      }
      save(store);
      render();
    });
  }

  function renderTopic(data, author, pkg) {
    var key = author + "/" + pkg;
    document.title = key + " — VMcraft forum";
    var posts = data.posts.filter(function (post) { return post.topic === key; });
    var list = posts.map(function (post) {
      return '<div class="fm-row"><div><a href="/forum/' + encodeURIComponent(post.author) + "/" + post.num + '/">' + esc(post.title || "Отзыв") +
        '</a><div class="fm-body">' + md(post.body) + "</div></div></div>";
    }).join("") || '<p class="fm-note">Отзывов пока нет. Напишите первый — он получит свой адрес.</p>';
    var form = me(data)
      ? '<form class="fm-form" id="fmTopic"><input name="title" required placeholder="Заголовок отзыва" maxlength="140">' + editor("fmTopicBody") +
        '<button class="fm-btn fm-btn-green" type="submit">Опубликовать отзыв</button></form>'
      : '<p><a href="/forum/login">Войдите</a>, чтобы оставить отзыв.</p>';
    shell(data, '<section class="fm-card"><h1>' + esc(key) + '</h1><p class="fm-meta"><a href="/old-pe/' + encodeURIComponent(author) + "/" + encodeURIComponent(pkg) + '/">Карточка пакета</a></p>' +
      list + form + "</section>");
    bindEditor("fmTopicBody");
    var topicForm = document.getElementById("fmTopic");
    if (topicForm) topicForm.addEventListener("submit", function (event) {
      event.preventDefault();
      publish(load(), me(load()), { title: topicForm.title.value.trim(), body: topicForm.body.value, topic: key, channel: "vmcraftpe" }, null);
    });
  }

  function renderMods(data) {
    document.title = "Каталог модов — VMcraft forum";
    var game = new URLSearchParams(location.search).get("game") || "pe";
    var rows = data.mods.filter(function (mod) { return mod.game === game; });
    var list = rows.map(function (mod) {
      return '<div class="fm-row"><div><strong>' + esc(mod.title) + '</strong><div class="fm-meta">' + esc(mod.author) + "</div><p>" + esc(mod.body) +
        (mod.file ? ' <a href="' + esc(mod.file) + '" target="_blank" rel="noopener">Файл</a>' : "") + "</p></div></div>";
    }).join("") || '<p class="fm-note">В этом разделе пока нет своих модов.</p>';
    var form = me(data)
      ? '<form class="fm-form" id="fmMod"><h2>Поделиться модом</h2><input name="title" required placeholder="Название" maxlength="120">' +
        '<textarea name="body" required placeholder="Что делает мод"></textarea><input name="file" placeholder="Ссылка на файл">' +
        '<button class="fm-btn fm-btn-green" type="submit">Добавить</button></form>'
      : '<p><a href="/forum/login">Войдите</a>, чтобы добавить мод.</p>';
    shell(data, '<section class="fm-card"><h1>Каталог модов</h1><div class="fm-tabs">' +
      '<a class="fm-btn ' + (game === "pe" ? "fm-btn-green" : "fm-btn-line") + '" href="/forum/mods?game=pe">VMcraftPE</a>' +
      '<a class="fm-btn ' + (game === "mc" ? "fm-btn-green" : "fm-btn-line") + '" href="/forum/mods?game=mc">Minecraft</a></div>' +
      '<p class="fm-note">Пакеты VMcraftPE из общего каталога открываются в <a href="/old-pe/packages/">магазине</a>. Здесь игроки выкладывают свои файлы.</p>' +
      list + form + "</section>");
    var modForm = document.getElementById("fmMod");
    if (modForm) modForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var store = load();
      var person = me(store);
      if (!person) return;
      store.mods.push({
        game: game,
        title: modForm.title.value.trim(),
        body: modForm.body.value.trim(),
        file: modForm.file.value.trim(),
        author: person.nick,
        created: new Date().toISOString()
      });
      save(store);
      render();
    });
  }

  function renderChannels(data) {
    var person = me(data);
    var list = data.channels.map(function (ch) {
      return '<div class="fm-row"><div><a href="/forum/?channel=' + encodeURIComponent(ch.slug) + '">' + esc(ch.title) + "</a><div class=\"fm-meta\">/" + esc(ch.slug) + " · " + esc(ch.about || "") + "</div></div></div>";
    }).join("");
    var form = person
      ? '<form class="fm-form" id="fmCh"><h2>Новый канал</h2><input name="slug" required placeholder="адрес, латиницей" pattern="[a-z0-9][a-z0-9_-]{1,31}">' +
        '<input name="title" required placeholder="Название" maxlength="80"><input name="about" placeholder="О чём канал">' +
        '<button class="fm-btn fm-btn-green" type="submit">Создать</button></form>'
      : '<p><a href="/forum/login">Войдите</a>, чтобы создать канал.</p>';
    shell(data, '<section class="fm-card"><h1>Каналы</h1>' + list + form + "</section>");
    var channelForm = document.getElementById("fmCh");
    if (channelForm) channelForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var store = load();
      var slug = channelForm.slug.value.trim().toLowerCase();
      if (RESERVED[slug] || store.channels.some(function (ch) { return ch.slug === slug; })) {
        alert("Такой адрес канала уже занят.");
        return;
      }
      store.channels.push({ slug: slug, title: channelForm.title.value.trim(), about: channelForm.about.value.trim() });
      save(store);
      go("/forum/?channel=" + encodeURIComponent(slug));
    });
  }

  function renderLogin(data) {
    shell(data, '<section class="fm-card"><h1>Вход</h1><form class="fm-form" id="fmIn">' +
      '<input name="slug" required placeholder="Ваш адрес на форуме">' +
      '<input name="password" required type="password" placeholder="Пароль">' +
      '<button class="fm-btn fm-btn-green" type="submit">Войти</button></form><p><a href="/forum/register">Регистрация</a></p></section>');
    document.getElementById("fmIn").addEventListener("submit", function (event) {
      event.preventDefault();
      var form = event.target;
      var store = load();
      var person = userBy(store, form.slug.value.trim().toLowerCase());
      hashPass(person && person.salt, form.password.value).then(function (hash) {
        if (!person || hash !== person.hash) {
          alert("Ник или пароль не подошли.");
          return;
        }
        setSession(person.slug);
        go("/forum/");
      });
    });
  }

  function renderRegister() {
    shell(load(), '<section class="fm-card"><h1>Регистрация</h1><form class="fm-form" id="fmReg">' +
      '<input name="nick" required placeholder="Имя, как вас видеть" maxlength="40">' +
      '<input name="slug" required placeholder="Адрес: латиница, цифры, _ -" pattern="[a-z0-9][a-z0-9_-]{2,31}">' +
      '<input name="password" required type="password" minlength="6" placeholder="Пароль, от 6 знаков">' +
      '<textarea name="about" placeholder="Коротко о себе"></textarea>' +
      '<button class="fm-btn fm-btn-green" type="submit">Создать аккаунт</button></form></section>');
    document.getElementById("fmReg").addEventListener("submit", function (event) {
      event.preventDefault();
      var form = event.target;
      var slug = form.slug.value.trim().toLowerCase();
      var store = load();
      if (RESERVED[slug] || userBy(store, slug)) {
        alert("Этот адрес уже занят.");
        return;
      }
      var salt = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
      hashPass(salt, form.password.value).then(function (hash) {
        store.users.push({
          slug: slug,
          nick: form.nick.value.trim(),
          about: form.about.value.trim(),
          salt: salt,
          hash: hash,
          followers: [],
          following: [],
          nextNum: 1,
          created: new Date().toISOString()
        });
        save(store);
        setSession(slug);
        go("/forum/" + encodeURIComponent(slug) + "/");
      });
    });
  }

  function hashPass(salt, password) {
    var data = new TextEncoder().encode(String(salt || "") + ":" + String(password || ""));
    return crypto.subtle.digest("SHA-256", data).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (n) {
        return n.toString(16).padStart(2, "0");
      }).join("");
    });
  }

  function render() {
    var data = load();
    var page = route();
    if (page.name === "home") renderHome(data);
    else if (page.name === "mods") renderMods(data);
    else if (page.name === "login") renderLogin(data);
    else if (page.name === "register") renderRegister();
    else if (page.name === "new") renderNew(data);
    else if (page.name === "channels") renderChannels(data);
    else if (page.name === "topic") renderTopic(data, page.author, page.pkg);
    else if (page.name === "message") renderMessage(data, page.slug, page.num);
    else if (page.name === "profile") renderProfile(data, page.slug);
    else shell(data, '<section class="fm-card"><h1>Страница не найдена</h1><p><a href="/forum/">На форум</a></p></section>');
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest ? event.target.closest("a") : null;
    if (!link || link.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var url;
    try { url = new URL(link.href, location.origin); } catch (e) { return; }
    if (url.origin !== location.origin || url.pathname.indexOf("/forum") !== 0) return;
    event.preventDefault();
    go(url.pathname + url.search);
  });
  window.addEventListener("popstate", render);
  render();
})();
