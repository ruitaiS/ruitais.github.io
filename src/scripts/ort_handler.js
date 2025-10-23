import * as ort from 'onnxruntime-web';

export async function initialize_ort () {
	ort.env.wasm.wasmPaths = new URL('ort/', window.location.origin).toString();
	ort.env.logLevel = 'error';
	const session = await ort.InferenceSession.create('/bible-rnn/model.onnx', {executionProviders: ['wasm']});
	return { ort, session }
}