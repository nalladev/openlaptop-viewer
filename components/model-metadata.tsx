interface ModelData {
  id: string
  project: "virgo" | "anyon_e"
  filename: string
  url: string
  sourceRepo: string
  commitSha: string
  publishedAt: string
  status: "success" | "failed"
}

interface ModelMetadataProps {
  model: ModelData
}

export default function ModelMetadata({ model }: ModelMetadataProps) {
  const commitUrl = `https://github.com/${model.sourceRepo}/commit/${model.commitSha}`
  const publishedDate = new Date(model.publishedAt).toLocaleDateString()

  return (
    <div className="bg-slate-800 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">Model Details</h3>
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-slate-400">Repository</p>
          <a
            href={`https://github.com/${model.sourceRepo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            {model.sourceRepo}
          </a>
        </div>
        <div>
          <p className="text-slate-400">Commit</p>
          <a
            href={commitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-mono text-xs"
          >
            {model.commitSha.slice(0, 7)}
          </a>
        </div>
        <div>
          <p className="text-slate-400">Published</p>
          <p className="text-white">{publishedDate}</p>
        </div>
      </div>
    </div>
  )
}
