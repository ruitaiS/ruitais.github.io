import * as ort from 'onnxruntime-web';

export const getSession = (async () => {
	ort.env.wasm.wasmPaths = new URL('ort/', window.location.origin).toString();
	ort.env.logLevel = 'error';
	return ort.InferenceSession.create('/bible-rnn/model.onnx', {executionProviders: ['wasm']});
})()
