const RELEASES_URL = "https://api.github.com/repos/VMRcompany/vmcraft-updates/releases?per_page=100";
const LOCAL_RELEASES_URL = "data/releases.json";

let cachedReleases = Array.isArray(window.VMCRAFT_RELEASES) ? window.VMCRAFT_RELEASES : null;

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

function apkOf(release) {
  return (release.assets || []).find((asset) => /\.apk$/i.test(asset.name));
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
    return;
  }

  const items = cachedReleases.filter((rel) => !rel.draft && apkOf(rel));
  if (!items.length) {
    root.innerHTML = '<p class="sub">' + t.verEmpty + "</p>";
    return;
  }

  root.innerHTML = items.map((rel, index) => {
    const apk = apkOf(rel);
    const version = rel.tag_name || rel.name || "";
    const size = lang === "ru" ? formatSize(apk.size) : formatSizeEn(apk.size);
    const latest = index === 0
      ? '<span class="ver-badge">' + t.verLatest + "</span>"
      : "";
    const notes = (rel.body || "").trim();
    const notesHtml = notes
      ? '<p class="ver-notes">' + notes.replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch])) + "</p>"
      : "";
    return (
      '<article class="ver-row">' +
        '<div class="ver-main">' +
          '<img src="images/icon.png" alt="">' +
          "<div>" +
            '<div class="ver-title"><strong>VMcraft ' + version + "</strong>" + latest + "</div>" +
            '<div class="ver-meta">' + formatDate(rel.published_at) + (size ? " · " + size : "") + "</div>" +
            notesHtml +
          "</div>" +
        "</div>" +
        '<a class="btn btn-play" href="' + apk.browser_download_url + '">' + t.play + "</a>" +
      "</article>"
    );
  }).join("");
};

async function loadReleases() {
  if (cachedReleases) window.renderVersions();

  const sources = [LOCAL_RELEASES_URL + "?v=20260920c", RELEASES_URL];
  for (const url of sources) {
    try {
      const data = await tryJson(url);
      if (Array.isArray(data) && data.length) {
        cachedReleases = data;
        window.renderVersions();
      }
    } catch (_) { /* next source */ }
  }

  if (!cachedReleases) {
    cachedReleases = "error";
    window.renderVersions();
  }
}

loadReleases();
