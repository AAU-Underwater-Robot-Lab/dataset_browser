let allDatasets = [];
const selectedIDs = new Set();

async function loadDatasets() {
  const res = await fetch('datasets.json');
  allDatasets = await res.json();
  renderDatasetTable(allDatasets);
}

function renderDatasetTable(list) {
  const tbody = document.getElementById('datasetTableBody');
  tbody.innerHTML = '';
  list.forEach(ds => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="checkbox" class="select-entry" data-id="${ds.id}"></td>
      <td><strong>${ds.title}</strong></td>
      <td>${ds.description}</td>
      <td>${ds.tags.join(', ')}</td>
      <td>${ds.flags.join(', ')}</td>
      <td>${ds.num_files}</td>
      <td>
        ${ds.links?.data ? `<a href="${ds.links.data}" target="_blank">Data</a>` : ''}
        ${ds.links?.info ? ` | <a href="${ds.links.info}" target="_blank">Info</a>` : ''}
      </td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll('.select-entry').forEach(cb => {
    cb.addEventListener('change', () => {
      cb.checked ? selectedIDs.add(cb.dataset.id) : selectedIDs.delete(cb.dataset.id);
    });
  });
}

function filterDatasets() {
  const q = document.getElementById('searchBox').value.toLowerCase();
  const filtered = allDatasets.filter(ds =>
    ds.title.toLowerCase().includes(q) ||
    ds.description.toLowerCase().includes(q) ||
    ds.tags.join(' ').toLowerCase().includes(q)
  );
  renderDatasetTable(filtered);
}

document.getElementById('searchBox').addEventListener('input', filterDatasets);
document.getElementById('selectAll').addEventListener('click', () => {
  allDatasets.forEach(ds => selectedIDs.add(ds.id));
  document.querySelectorAll('.select-entry').forEach(cb => cb.checked = true);
});
document.getElementById('deselectAll').addEventListener('click', () => {
  selectedIDs.clear();
  document.querySelectorAll('.select-entry').forEach(cb => cb.checked = false);
});

loadDatasets();
