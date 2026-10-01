const PE_RELEASES_API = "https://api.github.com/repos/VMRcompany/VMcraftPE/releases";
const PE_LOCAL_RELEASES_URL = "data/pe-releases.json?v=20261001c";

let peCachedReleases = Array.isArray(window.VMCRAFTPE_RELEASES) ? window.VMCRAFTPE_RELEASES : null;

function peFormatSize(bytes) {
  if (!bytes) return "";
  return (bytes / (1024 * 1024)).toFixed(1).replace(".", ",") + " МБ";
}

function peFormatSizeEn(bytes) {
  if (!bytes) return "";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function peFormatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function peApkOf(release) {
  return (release.assets || []).find((asset) => /\.apk$/i.test(asset.name));
}

function peVersionParts(tag) {
  return String(tag || "")
    .replace(/^v/i, "")
    .split(/[^\d]+/)
    .filter(Boolean)
    .map((n) => parseInt(n, 10));
}

function peLabel(rel) {
  const name = (rel.name || "").trim();
  if (/^\d+\.\d+/.test(name)) return name;
  return (rel.tag_name || name || "").replace(/^v/i, "");
}

function peNewerFirst(a, b) {
  const pa = peVersionParts(peLabel(a));
  const pb = peVersionParts(peLabel(b));
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const d = (pb[i] || 0) - (pa[i] || 0);
    if (d) return d;
  }
  return Date.parse(b.published_at || 0) - Date.parse(a.published_at || 0);
}

function peAsList(value) {
  return Array.isArray(value) ? value : [];
}

function peMerge(...lists) {
  const map = new Map();
  lists.flat().forEach((rel) => {
    if (!rel || rel.draft) return;
    const key = rel.tag_name || rel.name;
    if (!key || map.has(key)) return;
    map.set(key, rel);
  });
  return [...map.values()].sort(peNewerFirst);
}

window.renderPeVersions = function renderPeVersions() {
  const root = document.getElementById("peVersionList");
  if (!root) return;
  const t = I18N[lang];

  if (peCachedReleases === "error") {
    root.innerHTML = '<p class="sub">' + t.verError + "</p>";
    return;
  }
  if (!peCachedReleases) return;

  const items = peAsList(peCachedReleases).filter((rel) => !rel.draft && peApkOf(rel)).sort(peNewerFirst);
  if (!items.length) {
    root.innerHTML = '<p class="sub">' + t.verEmpty + "</p>";
    return;
  }

  root.innerHTML = items.map((rel, index) => {
    const apk = peApkOf(rel);
    const version = peLabel(rel);
    const size = lang === "ru" ? peFormatSize(apk.size) : peFormatSizeEn(apk.size);
    const latest = index === 0 ? '<span class="ver-badge">' + t.verLatest + "</span>" : "";
    const notes = (rel.body || "").trim();
    const notesHtml = notes
      ? '<p class="ver-notes">' + notes.replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch])) + "</p>"
      : "";
    return (
      '<article class="ver-row">' +
        '<div class="ver-main">' +
          '<img src="images/pe/icon.png" alt="">' +
          "<div>" +
            '<div class="ver-title"><strong>VMcraftPE ' + version + "</strong>" + latest + "</div>" +
            '<div class="ver-meta">' + peFormatDate(rel.published_at) + (size ? " · " + size : "") + "</div>" +
            notesHtml +
          "</div>" +
        "</div>" +
        '<a class="btn btn-play" href="' + apk.browser_download_url + '">' + t.play + "</a>" +
      "</article>"
    );
  }).join("");
};

async function fetchPeGithubNewestFirst() {
  const all = [];
  for (let page = 1; page <= 20; page++) {
    const data = await tryJson(PE_RELEASES_API + "?per_page=100&page=" + page);
    if (!Array.isArray(data) || !data.length) break;
    all.push(...data);
    peCachedReleases = peMerge(peAsList(peCachedReleases), data);
    window.renderPeVersions();
    if (data.length < 100) break;
  }
  return all;
}

async function loadPeReleases() {
  if (peCachedReleases) window.renderPeVersions();

  let githubOk = false;
  try {
    const github = await fetchPeGithubNewestFirst();
    githubOk = github.length > 0;
  } catch (_) { /* local fallback */ }

  try {
    const local = await tryJson(PE_LOCAL_RELEASES_URL);
    if (Array.isArray(local) && local.length) {
      peCachedReleases = peMerge(peAsList(peCachedReleases), local);
      window.renderPeVersions();
    }
  } catch (_) { /* ignore */ }

  if (!peAsList(peCachedReleases).length && !githubOk) {
    peCachedReleases = "error";
    window.renderPeVersions();
  }
}

loadPeReleases();
