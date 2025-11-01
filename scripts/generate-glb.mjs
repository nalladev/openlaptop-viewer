import fs from 'fs';
import path from 'path';

// Create a minimal but valid GLB file (binary glTF)
function createSimpleGLB() {
  // glTF 2.0 JSON structure
  const gltfJson = {
    asset: { version: '2.0' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{
      primitives: [{
        attributes: { POSITION: 0 },
        indices: 1
      }]
    }],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126, // FLOAT
        count: 8,
        type: 'VEC3'
      },
      {
        bufferView: 1,
        componentType: 5125, // UNSIGNED_INT
        count: 36,
        type: 'SCALAR'
      }
    ],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: 96 },
      { buffer: 0, byteOffset: 96, byteLength: 144 }
    ],
    buffers: [{ byteLength: 240 }]
  };

  const jsonStr = JSON.stringify(gltfJson);
  const jsonBytes = Buffer.from(jsonStr, 'utf8');
  const jsonPadded = jsonBytes.length + ((4 - jsonBytes.length % 4) % 4);

  // Vertex positions for a unit cube
  const vertices = new Float32Array([
    -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
    -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1
  ]);
  const vertexBuffer = Buffer.from(vertices.buffer);

  // Indices for cube triangles
  const indices = new Uint32Array([
    0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6,
    0, 3, 7, 0, 7, 4, 1, 5, 6, 1, 6, 2,
    0, 4, 5, 0, 5, 1, 3, 2, 6, 3, 6, 7
  ]);
  const indexBuffer = Buffer.from(indices.buffer);

  const binaryData = Buffer.concat([vertexBuffer, indexBuffer]);

  // GLB file construction
  const glb = Buffer.alloc(12 + 8 + jsonPadded + 8 + binaryData.length);
  let offset = 0;

  // Header
  glb.writeUInt32LE(0x46546C67, offset); offset += 4; // magic 'glTF'
  glb.writeUInt32LE(2, offset); offset += 4;           // version
  glb.writeUInt32LE(glb.length, offset); offset += 4;  // file size

  // JSON chunk
  glb.writeUInt32LE(jsonPadded, offset); offset += 4;
  glb.writeUInt32LE(0x4E4F534A, offset); offset += 4;  // type 'JSON'
  jsonBytes.copy(glb, offset);
  offset += jsonPadded;

  // Binary chunk
  glb.writeUInt32LE(binaryData.length, offset); offset += 4;
  glb.writeUInt32LE(0x004E4942, offset); offset += 4;  // type 'BIN\0'
  binaryData.copy(glb, offset);

  return glb;
}

const glbData = createSimpleGLB();
const outPath = path.join(process.cwd(), 'public', 'models', 'sample-virgo.glb');

// Ensure directory exists
const dir = path.dirname(outPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outPath, glbData);
console.log(`[v0] Generated valid GLB file: ${outPath} (${glbData.length} bytes)`);
