const MODRINTH = "https://api.modrinth.com/v2/search";

let modType = "mod";
let lastHits = [];

function renderMods(hits) {
  const root = document.getElementById("modGrid");
  if (!root) return;
  const t = I18N[lang];
  lastHits = hits || lastHits;
  if (!lastHits.length) {
    root.innerHTML = '<p class="sub">' + t.modsEmpty + "</p>";
    return;
  }
  root.innerHTML = lastHits.map((hit) => {
    const icon = hit.icon_url || "images/modrinth.png";
    const url = "https://modrinth.com/" + (hit.project_type || "mod") + "/" + hit.slug;
    const desc = (hit.description || "").replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch]));
    return (
      '<article class="mod-card">' +
        '<img src="' + icon + '" alt="">' +
        "<div><h3>" + (hit.title || hit.slug) + "</h3><p>" + desc + "</p></div>" +
        '<a class="btn btn-ghost" href="' + url + '" target="_blank" rel="noopener">' + t.modsOpen + "</a>" +
      "</article>"
    );
  }).join("");
}

async function loadMods(query) {
  const root = document.getElementById("modGrid");
  const t = I18N[lang];
  if (root) root.innerHTML = '<p class="sub">…</p>';
  const params = new URLSearchParams({
    limit: "16",
    index: query ? "relevance" : "downloads",
    query: query || "",
    facets: JSON.stringify([["project_type:" + modType]])
  });
  try {
    const data = await tryJson(MODRINTH + "?" + params.toString());
    renderMods((data && data.hits) || []);
  } catch (_) {
    if (root) root.innerHTML = '<p class="sub">' + t.modsErr + "</p>";
  }
}

window.renderModCards = function () {
  renderMods(lastHits);
};

(function initMods() {
  const input = document.getElementById("modQuery");
  const chips = document.querySelectorAll(".chip[data-type]");
  if (input) {
    let timer;
    input.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => loadMods(input.value.trim()), 300);
    });
  }
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-on"));
      chip.classList.add("is-on");
      modType = chip.getAttribute("data-type");
      loadMods(input ? input.value.trim() : "");
    });
  });
  loadMods("");
})();
