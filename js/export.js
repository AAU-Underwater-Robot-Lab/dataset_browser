function getSelected() {
  return allDatasets.filter(ds => selectedIDs.has(ds.id));
}

function download(content, filename, type){
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

document.getElementById('exportCSV').addEventListener('click', () => {
  const rows = getSelected().map(e =>
    [e.id, e.title, e.description, e.num_files, e.tags.join(';'), e.flags.join(';')]
      .map(v => `"${v}"`).join(',')
  );
  const header = ['id','title','description','num_files','tags','flags'].join(',') + '\n';
  download(header + rows.join('\n'), 'selected.csv', 'text/csv');
});

document.getElementById('exportBib').addEventListener('click', () => {
  const entries = getSelected().map((e, i) => {
    return "@misc{" + e.id + ",\n" +
           "  title = {" + e.title + "},\n" +
           "  note = {" + e.description + "},\n" +
           "  howpublished = {\\url{" + (e.links?.data || '') + "}}\n" +
           "}";
  }).join('\n\n');
  download(entries, 'selected.bib', 'text/plain');
});

document.getElementById('exportLaTeX').addEventListener('click', () => {
  const rows = getSelected().map(e =>
    e.title.replace(/_/g,'\\_') + " & " + e.description.replace(/_/g,'\\_') + " \\"
  );
  const content = "\\begin{tabular}{ll}\n" +
                  "\\toprule\n" +
                  "Title & Description \\\n" +
                  "\\midrule\n" +
                  rows.join('\n') + "\n" +
                  "\\bottomrule\n" +
                  "\\end{tabular}";
  download(content, 'selected.tex', 'text/plain');
});
