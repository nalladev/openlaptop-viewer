import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const adminToken = process.env.ADMIN_TOKEN
    const providedToken = request.headers.get("x-admin-token")

    if (!adminToken || providedToken !== adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    revalidatePath("/")
    return NextResponse.json({ success: true, message: "Manifest refreshed" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to refresh" }, { status: 500 })
  }
}
