import * as ort from 'onnxruntime-web';
ort.env.wasm.wasmPaths = new URL('ort/', window.location.origin).toString();
console.log("Loaded ORT")
export { ort }