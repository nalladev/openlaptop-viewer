export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get("path")

  if (!path || !path.startsWith("/models/")) {
    return Response.json({ error: "Invalid path" }, { status: 400 })
  }

  try {
    const filePath = `public${path}`
    const response = await fetch(`file://${process.cwd()}/${filePath}`)

    if (!response.ok) {
      return Response.json({ error: "File not found", exists: false }, { status: 404 })
    }

    const buffer = await response.arrayBuffer()

    // Check if it's a valid GLB file (starts with glTF magic number)
    const view = new DataView(buffer)
    const magic = view.getUint32(0, true)
    const isValid = magic === 0x46546c67 // 'glTF' in little-endian

    return Response.json({
      exists: true,
      isValid,
      size: buffer.byteLength,
      error: isValid ? null : "Invalid GLB format",
    })
  } catch (error) {
    return Response.json({ error: "Failed to load model", details: String(error) }, { status: 500 })
  }
}
