const models: Record<string, string> = {
  'system76-virgo': '/models/system76-virgo.glb',
  'framework-anyon-e': '/models/framework-anyon-e.glb'
};

const ModelViewer = ({ modelId }: { modelId: string }) => {
  const model = models[modelId];
  if (!model) {
    return <div>Model not found</div>;
  }

  return (
    <div>
      <canvas id="model-canvas" />
      <div>Model Viewer</div>
    </div>
  );
};

export default ModelViewer;