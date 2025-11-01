import struct
import json
import base64

def create_simple_gltf():
    """Create a minimal valid GLB file with a simple cube"""
    
    # Create minimal glTF structure
    gltf_data = {
        "asset": {"version": "2.0"},
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0}],
        "meshes": [{
            "primitives": [{
                "attributes": {"POSITION": 0},
                "indices": 1,
                "mode": 4
            }]
        }],
        "accessors": [
            {
                "bufferView": 0,
                "componentType": 5126,
                "count": 8,
                "type": "VEC3",
                "min": [-1, -1, -1],
                "max": [1, 1, 1]
            },
            {
                "bufferView": 1,
                "componentType": 5125,
                "count": 36,
                "type": "SCALAR"
            }
        ],
        "bufferViews": [
            {"buffer": 0, "byteOffset": 0, "byteLength": 96, "target": 34962},
            {"buffer": 0, "byteOffset": 96, "byteLength": 144, "target": 34963}
        ],
        "buffers": [{"byteLength": 240}]
    }
    
    # Cube vertices (8 vertices with positions)
    vertices = [
        -1, -1, -1,
        1, -1, -1,
        1, 1, -1,
        -1, 1, -1,
        -1, -1, 1,
        1, -1, 1,
        1, 1, 1,
        -1, 1, 1
    ]
    
    # Cube indices (6 faces, 2 triangles per face, 3 indices per triangle)
    indices = [
        0, 1, 2, 0, 2, 3,  # back
        4, 6, 5, 4, 7, 6,  # front
        0, 3, 7, 0, 7, 4,  # left
        1, 5, 6, 1, 6, 2,  # right
        0, 4, 5, 0, 5, 1,  # bottom
        3, 2, 6, 3, 6, 7   # top
    ]
    
    # Pack data as binary
    import struct
    vertex_data = struct.pack(f'{"f" * len(vertices)}', *vertices)
    index_data = struct.pack(f'{"I" * len(indices)}', *indices)
    binary_data = vertex_data + index_data
    
    # Create GLB file
    json_str = json.dumps(gltf_data)
    json_bytes = json_str.encode('utf-8')
    
    # Pad JSON to 4-byte boundary
    json_padding = (4 - (len(json_bytes) % 4)) % 4
    json_bytes += b' ' * json_padding
    
    # GLB header
    glb = struct.pack('<I', 0x46546C67)  # magic "glTF"
    glb += struct.pack('<I', 2)  # version
    glb += struct.pack('<I', 12 + 8 + len(json_bytes) + 8 + len(binary_data))  # total size
    
    # JSON chunk
    glb += struct.pack('<I', len(json_bytes))
    glb += struct.pack('<I', 0x4E4F534A)  # type "JSON"
    glb += json_bytes
    
    # Binary chunk
    glb += struct.pack('<I', len(binary_data))
    glb += struct.pack('<I', 0x004E4942)  # type "BIN\0"
    glb += binary_data
    
    return glb

if __name__ == "__main__":
    glb_data = create_simple_gltf()
    with open('/tmp/sample-virgo.glb', 'wb') as f:
        f.write(glb_data)
    print(f"[v0] Created valid GLB file: {len(glb_data)} bytes")
