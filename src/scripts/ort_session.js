import * as ort from 'onnxruntime-web';
ort.env.wasm.wasmPaths = new URL('ort/', window.location.origin).toString();
const session = await ort.InferenceSession.create('/bible-rnn/model.onnx');
console.log("Loaded ORT")
export { session };