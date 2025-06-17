
let allEntries = [];

window.addEventListener("load", async () => {
  const text = await fetch("datasets.bib").then(r => r.text());
  const bibJSON = BibtexParser.parseToJSON(text);
  allEntries = bibJSON;
  updateFilters();
  renderTable(allEntries);
});

function safeParseNote(raw) {
  try {
    let cleaned = raw.trim();

    // Remove any leading \" and trailing quote
    if (cleaned.startsWith('\\\\\"') || cleaned.startsWith('\\"') || cleaned.startsWith('\"')) {
      cleaned = cleaned.replace(/^\\\\?\\"/, '');
    }

    // Remove trailing quotes
    cleaned = cleaned.replace(/\\\\?\\"$/, '').replace(/\"$/, '');

    // Wrap in curly braces if not already wrapped
    if (!cleaned.startsWith('{')) {
      cleaned = `{${cleaned}}`;
    }

    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("Note JSON parse failed:", e, raw);
    return {};
  }
}


function updateFilters() {
  const tagSet = new Set();
  const flagSet = new Set();
  allEntries.forEach(e => {
    const note = safeParseNote(e.note || "");
    (note.tags || []).forEach(t => tagSet.add(t));
    (note.flags || []).forEach(f => flagSet.add(f));
  });

  const tagFilter = document.getElementById("tagFilter");
  const flagFilter = document.getElementById("flagFilter");

  tagSet.forEach(tag => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagFilter.appendChild(option);
  });

  flagSet.forEach(flag => {
    const option = document.createElement("option");
    option.value = flag;
    option.textContent = flag;
    flagFilter.appendChild(option);
  });
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
      <td>${(noteData.tags || []).join(", ")}</td>
      <td>${(noteData.flags || []).join(", ")}</td>
      <td>${noteData.num_files || ""}</td>
      <td>${link ? `<a href="${link}" target="_blank">Link</a>` : ""}</td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

function filterTable() {
  const query = document.getElementById("search").value.toLowerCase();
  const selectedTag = document.getElementById("tagFilter").value;
  const selectedFlag = document.getElementById("flagFilter").value;

  const filtered = allEntries.filter(e => {
    const note = safeParseNote(e.note || "");
    const tagMatch = !selectedTag || (note.tags || []).includes(selectedTag);
    const flagMatch = !selectedFlag || (note.flags || []).includes(selectedFlag);
    const textMatch = e.id.toLowerCase().includes(query) ||
                      e.title.toLowerCase().includes(query) ||
                      (note.tags || []).some(tag => tag.toLowerCase().includes(query)) ||
                      (note.flags || []).some(flag => flag.toLowerCase().includes(query));
    return tagMatch && flagMatch && textMatch;
  });
  renderTable(filtered);
}

function exportCSV() {
  let csv = "ID,Title,Year,Tags,Flags,Files,Link\n";
  allEntries.forEach(e => {
    const noteData = safeParseNote(e.note || "");
    const link = e.url || e.howpublished || "";
    csv += `"${e.id}","${e.title}","${e.year}","${(noteData.tags||[]).join(';')}","${(noteData.flags||[]).join(';')}","${noteData.num_files||''}","${link}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'datasets.csv';
  a.click();
}

function exportBib() {
  const blob = new Blob([allEntries.map(e => e.original).join('\n\n')], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'datasets.bib';
  a.click();
}
