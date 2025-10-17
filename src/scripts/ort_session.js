import * as ort from 'onnxruntime-web';
ort.env.wasm.wasmPaths = new URL('ort/', window.location.origin).toString();
ort.env.logLevel = 'error';
console.log("Loaded ORT")
const session = await ort.InferenceSession.create('/bible-rnn/model.onnx', {executionProviders: ['wasm']});
console.log("Started ORT Session")
export { session }