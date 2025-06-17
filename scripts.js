let entries = [];

window.addEventListener('load', async () => {
  try {
    const response = await fetch('datasets.bib');
    const text = await response.text();
    entries = BibtexParser.parseToJSON(text);
    renderTable(entries);
  } catch (error) {
    document.getElementById('status').innerText = error.message; console.error('Failed to load BibTeX:', error);
  }
});

function safeParseNote(raw) {
  let jsonPart = raw.trim();
  // If wrapped in braces, remove them
  if (jsonPart.startsWith("{") && jsonPart.endsWith("}")) {
    jsonPart = jsonPart.slice(1, -1);
  }
  // Try to parse; otherwise return empty object
  try {
    return JSON.parse(jsonPart);
  } catch(e) {
    console.warn("Note JSON parse failed:", e, raw);
    return {};
  }
}
function renderTable(entries) {
  const tbody = document.querySelector("#datasetTable tbody");
  tbody.innerHTML = "";
  entries.forEach(e => {
    const noteData = safeParseNote(e.note || "");
    const link = e.url || e.howpublished || "";
    const row = `<tr>
      <td>${e.id}</td>
      <td>${e.title}</td>
      <td>${e.year}</td>
      <td>${(noteData.tags||[]).join(", ")}</td>
      <td>${(noteData.flags||[]).join(", ")}</td>
      <td>${noteData.num_files||""}</td>
      <td>${link ? `<a href="${link}" target="_blank">Link</a>` : ""}</td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

function exportCSV() {
  let csv = "ID,Title,Year,Tags,Flags,Files,Link\n";
  entries.forEach(e => {
    let noteData = {};
    try {
      noteData = safeParseNote(e.note || "");
    } catch {}
    const link = e.entryTags.howpublished?.match(/\{\\url\{(.+?)\}\}/)?.[1] || '';
    csv += `"${e.citationKey}","${e.entryTags.title}","${e.entryTags.year}","${(noteData.tags || []).join(';')}","${(noteData.flags || []).join(';')}","${noteData.num_files || ''}","${link}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'datasets.csv';
  a.click();
}

function exportBib() {
  let bib = entries.map(e => e.original).join('\n\n');
  const blob = new Blob([bib], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'datasets.bib';
  a.click();
}
