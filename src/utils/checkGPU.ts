const getAdapter = async (gpu) => {
    return await gpu.requestAdapter();
}
  
const checkGPU = async (canvas) => {

    const rendererPromise = await new Promise((resolve) => {
        if ( "gpu" in navigator === false ) return null;

            resolve(
            import('three/examples/jsm/renderers/webgpu/WebGPURenderer.js')
                .then(({default: WebGPURenderer}) => {
                    return new WebGPURenderer({ canvas });
                })
            ).catch((error) => {
                console.error('WebGPU is disabled by blocklist: ', error);
                return null;
                // Perform fallback actions here, such as switching to a different renderer
            });
    })

    const adapter = await getAdapter(navigator.gpu);
    if ( !adapter ) return null;
    const device = await adapter.requestDevice();

    const isGPUReady = adapter && device && rendererPromise;
    return isGPUReady ? rendererPromise : null;
}

export default checkGPU