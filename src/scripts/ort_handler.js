import * as ort from 'onnxruntime-web';

export async function initialize_ort () {
	try {
		ort.env.wasm.wasmPaths = new URL('ort/', window.location.origin).toString();
		ort.env.logLevel = 'error';
		const session = await ort.InferenceSession.create('/bible-rnn/model.onnx', {executionProviders: ['wasm']});
		return { ort, session }

	} catch (err) {
		console.error("Failed to initialize ONNX Runtime:", err);
		throw new Error("Model Initialization Error");
	}
}