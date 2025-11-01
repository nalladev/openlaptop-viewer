import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    const adminToken = process.env.ADMIN_TOKEN

    if (!adminToken) {
      return NextResponse.json({ error: "Admin token not configured" }, { status: 500 })
    }

    if (token === adminToken) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
