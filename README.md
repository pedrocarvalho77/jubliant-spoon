# Config Syntax Validator & Evaluator

Web UI to edit a configuration (YAML), load bundled samples, and dry-run it against a pull request.

## Requirements

- Node.js 20.19+ or 22.12+
- The [jubilant-api](https://github.com/pedrocarvalho77/jubilant-api) backend (Go) running on `http://localhost:8080` (`go run .`)
- A GitHub token with read access to the target pull request

## Usage

```bash
npm install
npm start        # http://localhost:3000
```

Set `VITE_RUNNER_URL` to point at a runner that is not on localhost.

1. Pick a sample, upload a `.yml` file, or write the configuration in the editor.
2. Run without a PR URL and token to only validate the syntax. To evaluate it, add a pull request URL and a GitHub token (sent only to the API).
3. Click **Run**. Results (or the error) show in the bottom pane. **Save** downloads the config as `config.yml`.

## Demo mode

`npm run start:demo` (or building with `VITE_DEMO=true`) simulates the API in the browser:
Run returns the actions found in the configuration, with no backend. This is what the GitHub Pages
workflow (`.github/workflows/pages.yml`) deploys; enable it in Settings > Pages > Source: GitHub Actions.

## Scripts

`npm start` (Vite on http://localhost:3000), `npm run build` (type-check + production build in `dist/`), `npm run preview`, `npm run typecheck`
