let cachedServers = null;

window.renderServers = function renderServers() {
  const root = document.getElementById("serverList");
  if (!root) return;
  const t = I18N[lang];
  if (cachedServers === "error") {
    root.innerHTML = '<p class="sub">' + t.srvEmpty + "</p>";
    return;
  }
  if (!cachedServers) {
    root.innerHTML = '<p class="sub">…</p>';
    return;
  }
  const list = cachedServers.servers || [];
  if (!list.length) {
    root.innerHTML = '<p class="sub">' + t.srvEmpty + "</p>";
    return;
  }
  root.innerHTML = list.map((srv, i) => {
    const name = srv.name || "Server";
    const ip = srv.ip || "";
    const ver = srv.version || "";
    const desc = srv.description || "";
    return (
      '<article class="ver-row">' +
        '<div class="ver-main">' +
          '<img src="images/icon.png" alt="">' +
          "<div>" +
            '<div class="ver-title"><strong>' + name + "</strong></div>" +
            '<div class="ver-meta">' + ip + (ver ? " · " + ver : "") + "</div>" +
            (desc ? '<p class="ver-notes">' + desc + "</p>" : "") +
          "</div>" +
        "</div>" +
        '<button type="button" class="btn btn-play" data-copy="' + i + '">' + t.srvCopy + "</button>" +
      "</article>"
    );
  }).join("");
  root.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const srv = list[Number(btn.getAttribute("data-copy"))];
      if (!srv || !srv.ip) return;
      try {
        await navigator.clipboard.writeText(srv.ip);
        btn.textContent = t.srvCopied;
        setTimeout(() => { btn.textContent = t.srvCopy; }, 1200);
      } catch (_) {
        window.prompt(t.srvCopy, srv.ip);
      }
    });
  });
};

(async function loadServers() {
  try {
    const data = await tryJson("data/servers.json?v=20260920e");
    cachedServers = data && typeof data === "object" ? data : "error";
  } catch (_) {
    cachedServers = "error";
  }
  window.renderServers();
})();
