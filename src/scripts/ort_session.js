import * as ort from 'onnxruntime-web';
ort.env.wasm.wasmPaths = new URL('ort/', window.location.origin).toString();
console.log("Loaded ORT")
//TODO
//const session = await ort.InferenceSession.create('/bible-rnn/model.onnx');
const session = "foo"
export { session }