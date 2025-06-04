let allDatasets = [];
const selectedIDs = new Set();

async function loadDatasets(){
  const res = await fetch('datasets.json');
  allDatasets = await res.json();
  renderDatasetList(allDatasets);
}

function renderDatasetList(list){
  const ul = document.getElementById('datasetList');
  ul.innerHTML = '';
  list.forEach(ds => {
    const li = document.createElement('li');
    li.innerHTML = `
      <label>
        <input type="checkbox" class="select-entry" data-id="${ds.id}">
        <strong>${ds.title}</strong> (${ds.num_files}) – ${ds.description}
      </label>`;
    ul.appendChild(li);
  });
  document.querySelectorAll('.select-entry').forEach(cb => {
    cb.addEventListener('change', () => {
      cb.checked ? selectedIDs.add(cb.dataset.id) : selectedIDs.delete(cb.dataset.id);
    });
  });
}

function filterDatasets(){
  const q = document.getElementById('searchBox').value.toLowerCase();
  const filtered = allDatasets.filter(ds =>
    ds.title.toLowerCase().includes(q) ||
    ds.description.toLowerCase().includes(q) ||
    ds.tags.join(' ').toLowerCase().includes(q)
  );
  renderDatasetList(filtered);
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
