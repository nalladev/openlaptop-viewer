#!/bin/bash

# Simple test script to verify a local GLB file renders correctly
# Usage: ./scripts/test-local-model.sh public/models/sample-virgo.glb

GLB_FILE="${1:-.public/models/sample-virgo.glb}"

if [ ! -f "$GLB_FILE" ]; then
  echo "Error: GLB file not found at $GLB_FILE"
  exit 1
fi

echo "Testing local GLB model: $GLB_FILE"
echo "File size: $(du -h "$GLB_FILE" | cut -f1)"
echo "Model is ready for testing in the viewer."
echo ""
echo "Steps to test:"
echo "1. Run: npm run dev"
echo "2. Visit: http://localhost:3000"
echo "3. Check that the 3D model loads in the viewer"
echo "4. Try rotating, zooming, and toggling exploded view"
