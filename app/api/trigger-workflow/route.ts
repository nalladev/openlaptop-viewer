import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const token = process.env.GITHUB_TOKEN
    const repo = process.env.GITHUB_REPOSITORY || process.env.VERCEL_GIT_REPO_SLUG || 'yourusername/openlaptop-viewer'R + '/' + process.env.VERCEL_GIT_REPO_SLUG
    
    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not configured. Add GITHUB_TOKEN environment variable.' },t GITHUB_TOKEN environment variable.' },
        { status: 500 }
      )
    }

    const [owner, repoName] = repo.split('/')
      return NextResponse.json(
    if (!owner || !repoName) {configured. Set GITHUB_REPOSITORY environment variable.' },
      return NextResponse.json(
        { error: 'Invalid repository format. Expected: owner/repo' },
        { status: 500 }
      )
    }
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/actions/workflows/convert-and-publish.yml/dispatches`,ps://api.github.com/repos/${owner}/${repoName}/actions/workflows/convert-and-publish.yml/dispatches`,
      {
        method: 'POST',',
        headers: {aders: {
          'Authorization': `Bearer ${token}`,   'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',     'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',          'Content-Type': 'application/json',
          'User-Agent': 'openlaptop-viewer/1.0' 'openlaptop-viewer'
        },
        body: JSON.stringify({
          ref: 'main'
        })
      }
    )

    if (!response.ok) {    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API Error:', response.status, errorText)('GitHub API Error:', response.status, errorText)
      return NextResponse.json(
        { error: `GitHub API error: ${response.status} - ${errorText}` },error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    return NextResponse.json({    return NextResponse.json({ 
      success: true,       success: true, 











}  }    )      { status: 500 }      { error: 'Internal server error' },    return NextResponse.json(    console.error('Error triggering workflow:', error)  } catch (error) {    })      message: 'Workflow triggered successfully'       message: 'Workflow triggered successfully' 
    })
  } catch (error) {
    console.error('Error triggering workflow:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    error: 'Method not allowed. Use POST to trigger workflow.' 
  }, { status: 405 })
}
