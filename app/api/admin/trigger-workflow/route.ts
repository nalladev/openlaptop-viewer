import { NextResponse } from "next/server"

export async function POST() {
  try {
    const githubToken = process.env.GITHUB_TOKEN

    if (!githubToken) {
      return NextResponse.json({ error: "GitHub token not configured" }, { status: 500 })
    }

    const response = await fetch(
      "https://api.github.com/repos/yourusername/openlaptop-viewer/actions/workflows/convert-and-publish.yml/dispatches",
      {
        method: "POST",
        headers: {
          Authorization: "token " + githubToken,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          ref: "main",
        }),
      },
    )

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Workflow triggered successfully!" })
    } else {
      return NextResponse.json({ error: response.statusText }, { status: response.status })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to trigger workflow" }, { status: 500 })
  }
}
