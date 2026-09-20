const MANIFEST_URL = "apk/manifest.json";

let cachedReleases = null;

function formatSize(bytes) {
  if (!bytes) return "";
  return (bytes / (1024 * 1024)).toFixed(1).replace(".", ",") + " МБ";
}

function formatSizeEn(bytes) {
  if (!bytes) return "";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function toItems(manifest) {
  return (manifest.releases || []).filter((rel) => rel.path);
}

window.renderVersions = function renderVersions() {
  const root = document.getElementById("versionList");
  if (!root) return;
  const t = I18N[lang];

  if (cachedReleases === "error") {
    root.innerHTML = '<p class="sub">' + t.verError + "</p>";
    return;
  }
  if (!cachedReleases) {
    root.innerHTML = '<p class="sub">…</p>';
    return;
  }

  const items = toItems(cachedReleases);
  if (!items.length) {
    root.innerHTML = '<p class="sub">' + t.verEmpty + "</p>";
    return;
  }

  const latest = cachedReleases.latest;
  root.innerHTML = items.map((rel) => {
    const version = rel.version || "";
    const size = lang === "ru" ? formatSize(rel.size) : formatSizeEn(rel.size);
    const badge = rel.version === latest
      ? '<span class="ver-badge">' + t.verLatest + "</span>"
      : "";
    const notes = (rel.body || "").trim();
    const notesHtml = notes
      ? '<p class="ver-notes">' + notes.replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch])) + "</p>"
      : "";
    const href = rel.path;
    const fileName = rel.file || ("VMcraft-" + version + "-release.apk");
    return (
      '<article class="ver-row">' +
        '<div class="ver-main">' +
          '<img src="images/icon.png" alt="">' +
          "<div>" +
            '<div class="ver-title"><strong>VMcraft ' + version + "</strong>" + badge + "</div>" +
            '<div class="ver-meta">' + formatDate(rel.published) + (size ? " · " + size : "") + "</div>" +
            notesHtml +
          "</div>" +
        "</div>" +
        '<a class="btn btn-play" href="' + href + '" download="' + fileName + '">' + t.play + "</a>" +
      "</article>"
    );
  }).join("");
};

(async function loadReleases() {
  try {
    const data = await tryJson(MANIFEST_URL + "?t=" + Date.now());
    cachedReleases = data && data.releases ? data : "error";
  } catch (_) {
    cachedReleases = "error";
  }
  window.renderVersions();
})();
