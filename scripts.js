let entries = [];

window.addEventListener('load', async () => {
  try {
    const response = await fetch('datasets.bib');
    const text = await response.text();
    entries = bibtexParse.toJSON(text);
    renderTable(entries);
  } catch (error) {
    document.getElementById('status').innerText = 'Failed to load or parse datasets.bib'; console.error('Failed to load BibTeX:', error);
  }
});

function renderTable(entries) {
  const tbody = document.querySelector('#datasetTable tbody');
  tbody.innerHTML = '';
  entries.forEach(e => {
    let noteData = {};
    try {
      noteData = JSON.parse(e.entryTags.note);
    } catch {}
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${e.citationKey}</td>
      <td>${e.entryTags.title}</td>
      <td>${e.entryTags.year}</td>
      <td>${(noteData.tags || []).join(', ')}</td>
      <td>${(noteData.flags || []).join(', ')}</td>
      <td>${noteData.num_files || ''}</td>
      <td><a href="${e.entryTags.howpublished?.match(/\{\\url\{(.+?)\}\}/)?.[1] || '#'}" target="_blank">Link</a></td>
    `;
    tbody.appendChild(row);
  });
}

function exportCSV() {
  let csv = "ID,Title,Year,Tags,Flags,Files,Link\n";
  entries.forEach(e => {
    let noteData = {};
    try {
      noteData = JSON.parse(e.entryTags.note);
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
