const checkGPU = async (canvas) => {

    if ("gpu" in navigator === false) return null
    const adapter = await navigator.gpu.requestAdapter().catch((err) => {
        console.log(err)
        return null;
    });
    if ( !adapter ) return null;
    const device = await adapter.requestDevice();
    if ( !device ) return null;

    const rendererPromise = await new Promise((resolve) => {
        resolve(
        import('three/examples/jsm/renderers/webgpu/WebGPURenderer.js')
            .then(({default: WebGPURenderer}) => {
                return new WebGPURenderer({ canvas });
            })
        )
    }).catch((error) => {
        console.log(error);
        return null;
    });

    return rendererPromise;
}

export default checkGPU