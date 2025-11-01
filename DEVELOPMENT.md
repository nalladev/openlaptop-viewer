# Development Guide

## Local Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- (Optional) Blender CLI for testing CAD conversion locally

### Installation

\`\`\`bash
git clone https://github.com/yourusername/openlaptop-viewer.git
cd openlaptop-viewer
npm install
\`\`\`

### Running Locally

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000 to see the app.

### Environment Variables

Copy \`.env.example\` to \`.env.local\`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update with your actual values:
- \`NEXT_PUBLIC_ADMIN_TOKEN\`: Any secure string for admin access
- \`NEXT_PUBLIC_GITHUB_TOKEN\`: GitHub Personal Access Token (optional)
- \`NEXT_PUBLIC_GITHUB_REPO_OWNER\`: Your GitHub username
- \`NEXT_PUBLIC_GITHUB_REPO_NAME\`: Your repository name

## Project Structure

\`\`\`
openlaptop-viewer/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main viewer page
│   ├── globals.css         # Global styles
│   ├── admin/
│   │   └── page.tsx        # Admin panel
│   └── api/
│       └── refresh/
│           └── route.ts    # Manifest refresh endpoint
├── components/
│   ├── model-viewer.tsx    # 3D viewer using React Three Fiber
│   ├── tab-navigation.tsx  # Tab switcher
│   ├── model-metadata.tsx  # Model info display
│   └── workflow-status.tsx # Workflow run status
├── public/
│   └── models/
│       ├── manifest.json   # Model catalog
│       └── *.glb           # Converted model files
├── .github/
│   └── workflows/
│       └── convert-and-publish.yml  # GitHub Actions workflow
├── scripts/
│   └── test-local-model.sh # Testing helper
├── README.md               # Main documentation
└── DEVELOPMENT.md          # This file
\`\`\`

## Working with the 3D Viewer

### Adding Sample Models

1. Place a `.glb` file in \`public/models/\`:
   \`\`\`bash
   cp your-model.glb public/models/sample-model.glb
   \`\`\`

2. Update \`public/models/manifest.json\`:
   \`\`\`json
   {
     "models": [
       {
         "id": "sample-1",
         "project": "virgo",
         "filename": "sample-model.glb",
         "url": "/models/sample-model.glb",
         "sourceRepo": "system76/virgo",
         "commitSha": "abc123...",
         "publishedAt": "2024-01-15T00:00:00Z",
         "status": "success"
       }
     ]
   }
   \`\`\`

3. Refresh your browser at http://localhost:3000

### Testing CAD Conversion Locally

To test the conversion workflow without GitHub Actions:

1. Install Blender:
   \`\`\`bash
   sudo apt-get install blender  # Ubuntu/Debian
   brew install blender          # macOS
   \`\`\`

2. Create a Python conversion script:
   \`\`\`python
   import subprocess
   import os
   
   input_file = "model.step"
   output_file = "model.glb"
   
   # Blender CLI conversion
   subprocess.run([
       "blender", "--background", "--python-expr",
       f"""
       import bpy
       bpy.ops.import_mesh.stl(filepath='{input_file}')
       bpy.ops.export_scene.gltf(filepath='{output_file}', export_format='GLB')
       """
   ])
   
   print(f"Converted {input_file} to {output_file}")
   \`\`\`

## Admin Panel

The admin panel at \`/admin\` allows manual workflow dispatch without accessing GitHub:

1. Visit http://localhost:3000/admin
2. Enter your admin token (from .env.local)
3. Click "Trigger CAD Conversion Workflow"
4. Check GitHub Actions logs for progress

**Note**: GitHub Token is required in .env.local to trigger workflows.

## GitHub Workflow Testing

### Manual Workflow Dispatch

1. Push your changes to GitHub
2. Go to **Actions** tab
3. Select **Convert and Publish CAD Models**
4. Click **Run workflow**
5. Monitor logs in real-time

### Checking Workflow Logs

After a workflow run:

1. Go to **Actions** → **Convert and Publish CAD Models** → **latest run**
2. Click a job to see detailed logs
3. Check for conversion errors, API rate limits, or missing files

### Debugging Workflow Issues

Common issues and solutions:

**Issue**: "Blender not found"
- Solution: Ensure \`sudo apt-get install blender\` runs in the workflow

**Issue**: "Failed to fetch from GitHub API"
- Solution: Rate limits hit. Increase cron interval or add GITHUB_TOKEN

**Issue**: "No CAD files found"
- Solution: Update REPOS array in workflow to check correct directories

## Building for Production

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - \`NEXT_PUBLIC_ADMIN_TOKEN\`
   - \`NEXT_PUBLIC_GITHUB_TOKEN\`
3. Vercel auto-deploys on git push

### Using GitHub Pages for Assets

Modify \`.github/workflows/convert-and-publish.yml\`:

\`\`\`yaml
- name: Deploy models to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: \${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./converted
    destination_dir: models
\`\`\`

Models become available at:
\`https://yourusername.github.io/openlaptop-viewer/models/\`

## Performance Optimization

### Compressing GLB Files

Use gltf-transform to reduce file sizes:

\`\`\`bash
npm install @gltf-transform/cli @gltf-transform/extensions

# Optimize a GLB file
gltf-transform optimize input.glb output.glb
\`\`\`

Add to workflow:

\`\`\`yaml
- name: Optimize GLB files
  run: |
    npm install @gltf-transform/cli
    gltf-transform optimize converted/**/*.glb
\`\`\`

## Troubleshooting

### Models not loading

1. Check browser console for CORS errors
2. Verify manifest.json has correct URLs
3. Test GLB file is valid: \`file public/models/model.glb\`

### Workflow not running

1. Check cron syntax at https://crontab.guru
2. Verify workflow file syntax: \`npm install -g yamllint && yamllint .github/workflows/\`
3. Check GitHub API rate limits in workflow logs

### Admin panel not working

1. Verify \`NEXT_PUBLIC_ADMIN_TOKEN\` is set
2. Check browser console for fetch errors
3. Verify \`NEXT_PUBLIC_GITHUB_TOKEN\` is valid (if using workflow dispatch)

## Contributing

When adding features:

1. Test locally with \`npm run dev\`
2. Verify 3D viewer interactions work smoothly
3. Test workflow dispatch from admin panel
4. Update README with new features
5. Create a pull request with clear description

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Blender Python API](https://docs.blender.org/api/current/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [gltf-transform CLI](https://gltf-transform.donmccurdy.com/cli)
