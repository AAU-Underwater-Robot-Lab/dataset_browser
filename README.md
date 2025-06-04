# Dataset Browser

This repository contains a static, client-side browser for exploring structured datasets. It is intended to serve synthetic datasets related to underwater sensing, segmentation, and AI-based scene analysis.

## Features

- Live keyword search and tag filtering
- Selection and export of datasets to:
  - CSV
  - BibTeX
  - LaTeX tabular format
- Lightweight, fast, and deployable via GitHub Pages
- Structured JSON dataset catalog
- No backend or server required

## Usage

1. Clone or fork this repository.
2. Enable GitHub Pages in the repository settings.
3. Visit the GitHub Pages URL (e.g., `https://orgname.github.io/reponame/`).

## File Structure

| File               | Description                            |
|--------------------|----------------------------------------|
| `index.html`       | Main entry point of the web interface  |
| `datasets.json`    | Dataset metadata in JSON format        |
| `js/search.js`     | Handles filtering and rendering        |
| `js/export.js`     | Handles export functions               |
| `css/style.css`    | Basic styling                          |

## Data Format

Each dataset entry in `datasets.json` includes:

```json
{
  "id": "DS001",
  "title": "Clear Pool Scenes",
  "description": "Synthetic images...",
  "tags": ["synthetic", "benchmark"],
  "flags": ["rgb", "fls"],
  "num_files": 124,
  "links": {
    "data": "https://example.com/clear.zip",
    "info": "https://example.com/clear-doc"
  }
}
```

## License

This project is open under a permissive license. Feel free to adapt it to your own dataset catalogs.
