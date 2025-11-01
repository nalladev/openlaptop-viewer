# OpenLaptop Viewer

Interactive 3D viewer for open-source laptop CAD models. Automatically fetches and converts CAD files from upstream GitHub repositories, publishes them as GLB models, and displays them in a web-based 3D viewer.

## Features

- 🔄 **Automatic Conversion**: GitHub Actions workflow detects changes in upstream repos and converts CAD files to GLB
- 🔍 **Interactive 3D Viewer**: Rotate, zoom, pan, and toggle exploded view using React Three Fiber
- 📊 **Manifest System**: JSON-based tracking of all published models
- 🚀 **Free Hosting**: Uses GitHub Pages + Vercel for free deployment
- ⚡ **Smart Caching**: Checks commit SHAs to avoid unnecessary conversions

## Supported Projects

- **System76 Virgo**: https://github.com/system76/virgo
- **Framework anyon_e**: https://github.com/byrantech/laptop

## Local Development

### Prerequisites

- Node.js 18+ and npm
- (Optional) Blender and FreeCAD for local CAD conversion testing

### Setup

\`\`\`bash
# Clone and install dependencies
git clone https://github.com/yourusername/openlaptop-viewer.git
cd openlaptop-viewer
npm install

# Run development server
npm run dev
\`\`\`

Visit http://localhost:3000 to see the app running locally.

### Testing with Sample Model

The app includes a sample manifest at `public/models/manifest.json`. To test with a local GLB:

1. Place a `.glb` file in `public/models/sample.glb`
2. Update the manifest URL in `public/models/manifest.json` to point to your model
3. Refresh the app

## GitHub Actions Workflow

### How It Works

The `.github/workflows/convert-and-publish.yml` workflow:

1. **Triggers**:
   - Manual dispatch via GitHub UI (workflow_dispatch)
   - Hourly schedule (cron: '0 * * * *')

2. **Process**:
   - Fetches latest commit SHA from each upstream repo (system76/virgo, byrantech/laptop)
   - Compares with stored SHA to detect changes
   - If changed, downloads candidate CAD files (.step, .stp, .stl, .obj, .iges, .wrl)
   - Converts CAD files to GLB using Blender CLI with FreeCAD fallback
   - Updates `public/models/manifest.json` with new models and metadata
   - Commits and pushes changes to the repo

3. **Output**:
   - GLB files are stored in `public/models/<owner>-<repo>/`
   - Manifest is updated at `public/models/manifest.json`
   - Commit SHA and timestamps are tracked for future comparisons

### Manual Workflow Dispatch

To manually trigger a conversion run:

1. Go to **Actions** tab in your GitHub repo
2. Select **Convert and Publish CAD Models**
3. Click **Run workflow**
4. Check the workflow logs for progress

### Changing the Schedule

Edit `.github/workflows/convert-and-publish.yml`:

\`\`\`yaml
schedule:
  - cron: '0 */6 * * *'  # Run every 6 hours
\`\`\`

Use [crontab.guru](https://crontab.guru) to generate cron expressions.

### Adding More Repositories

Edit the `REPOS` environment variable in `.github/workflows/convert-and-publish.yml`:

\`\`\`yaml
env:
  REPOS: |
    [
      {"owner": "system76", "repo": "virgo", "project": "virgo"},
      {"owner": "byrantech", "repo": "laptop", "project": "anyon_e"},
      {"owner": "new-owner", "repo": "new-laptop", "project": "new_project"}
    ]
\`\`\`

## Deployment

### Deploy to Vercel

1. **Connect your repository** to Vercel
2. **Set environment variables** (if using GitHub API authentication):
   - `GITHUB_TOKEN` (optional, for higher rate limits)
3. **Deploy**:
   - Vercel automatically deploys on git push
   - Or manually trigger from Vercel dashboard

### Use GitHub Pages for Assets

Alternatively, publish converted models to GitHub Pages:

1. Modify `.github/workflows/convert-and-publish.yml` to use `peaceiris/actions-gh-pages`:

\`\`\`yaml
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./converted
          destination_dir: models
\`\`\`

2. Enable GitHub Pages in repo settings
3. Models will be available at: `https://yourusername.github.io/openlaptop-viewer/models/`

## Manifest File Format

`public/models/manifest.json` structure:

\`\`\`json
{
  "lastUpdated": "2024-01-15T14:30:00Z",
  "models": [
    {
      "id": "virgo-main",
      "project": "virgo",
      "filename": "virgo-keyboard.glb",
      "url": "/models/system76-virgo/model.glb",
      "sourceRepo": "system76/virgo",
      "commitSha": "abc123def456...",
      "publishedAt": "2024-01-15T14:30:00Z",
      "status": "success"
    }
  ]
}
\`\`\`

## Admin Panel

An optional admin panel at `/admin` allows manual workflow dispatch without leaving GitHub:

- Requires `NEXT_PUBLIC_ADMIN_TOKEN` environment variable
- Trigger workflow runs directly from the web UI
- View last conversion results

(Coming in future update)

## Rate Limiting

The workflow respects GitHub API rate limits:

- Checks only once per hour by default (configurable via cron)
- Uses SHA comparison to avoid redundant downloads
- Suitable for free GitHub tier (5,000 requests/hour)

## Troubleshooting

### Workflow fails with "Blender not found"

Ensure Blender is installed in the workflow:

\`\`\`yaml
- name: Install dependencies
  run: |
    sudo apt-get update
    sudo apt-get install -y blender
\`\`\`

### No models appearing in the viewer

1. Check workflow logs: **Actions** → **Convert and Publish CAD Models** → **latest run**
2. Verify `public/models/manifest.json` exists and has valid JSON
3. Check browser console for fetch errors

### CAD file conversion fails

- Ensure the CAD file format is supported (.step, .stl, .obj, .iges)
- Check workflow logs for conversion errors
- Verify the file is not corrupted

## Technical Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **3D Rendering**: React Three Fiber, @react-three/drei
- **Automation**: GitHub Actions, Blender CLI, Python
- **Deployment**: Vercel (frontend), GitHub Pages (assets)

## Future Enhancements

- [ ] Admin dashboard with conversion history
- [ ] gltf-transform optimization for faster web delivery
- [ ] Support for private repos with GitHub PAT
- [ ] Activity log showing conversion results
- [ ] Badge with last publish timestamp

## License

MIT - Feel free to use and modify for your own projects.

## Contributing

Contributions welcome! Please open an issue or submit a pull request.
