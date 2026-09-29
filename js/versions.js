const RELEASES_API = "https://api.github.com/repos/VMRcompany/vmcraft-updates/releases";
const LOCAL_RELEASES_URL = "data/releases.json?v=20260929a";

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

function versionParts(tag) {
  return String(tag || "")
    .replace(/^v/i, "")
    .split(/[^\d]+/)
    .filter(Boolean)
    .map((n) => parseInt(n, 10));
}

function newerFirst(a, b) {
  const pa = versionParts(a.tag_name || a.name);
  const pb = versionParts(b.tag_name || b.name);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const d = (pb[i] || 0) - (pa[i] || 0);
    if (d) return d;
  }
  return Date.parse(b.published_at || 0) - Date.parse(a.published_at || 0);
}

function asList(value) {
  return Array.isArray(value) ? value : [];
}

function mergeReleases(...lists) {
  const map = new Map();
  lists.flat().forEach((rel) => {
    if (!rel || rel.draft) return;
    const key = rel.tag_name || rel.name;
    if (!key || map.has(key)) return;
    map.set(key, rel);
  });
  return [...map.values()].sort(newerFirst);
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

  const items = asList(cachedReleases).filter((rel) => !rel.draft && apkOf(rel)).sort(newerFirst);
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

async function fetchGithubNewestFirst() {
  const all = [];
  for (let page = 1; page <= 20; page++) {
    const data = await tryJson(RELEASES_API + "?per_page=100&page=" + page);
    if (!Array.isArray(data) || !data.length) break;
    all.push(...data);
    cachedReleases = mergeReleases(asList(cachedReleases), data);
    window.renderVersions();
    if (data.length < 100) break;
  }
  return all;
}

async function loadReleases() {
  if (cachedReleases) window.renderVersions();

  let githubOk = false;
  try {
    const github = await fetchGithubNewestFirst();
    githubOk = github.length > 0;
  } catch (_) { /* local fallback */ }

  try {
    const local = await tryJson(LOCAL_RELEASES_URL);
    if (Array.isArray(local) && local.length) {
      cachedReleases = mergeReleases(asList(cachedReleases), local);
      window.renderVersions();
    }
  } catch (_) { /* ignore */ }

  if (!asList(cachedReleases).length && !githubOk) {
    cachedReleases = "error";
    window.renderVersions();
  }
}

loadReleases();
