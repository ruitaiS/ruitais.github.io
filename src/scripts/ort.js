import * as ort from 'onnxruntime-web';
//ort.env.wasm.wasmPaths = `/ort/`;
//ort.env.wasm.wasmPaths = new URL('../ort/', import.meta.url).toString();
ort.env.wasm.wasmPaths =
  'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.0/dist/';
export { ort };