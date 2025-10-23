import * as ort from 'onnxruntime-web';
ort.env.wasm.wasmPaths = new URL('ort/', self.location.origin).toString();
ort.env.logLevel = 'error';

const session = ort.InferenceSession.create('/bible-rnn/model.onnx', {executionProviders: ['wasm']});
const model_assets = fetch('/bible-rnn/model_assets.json').then(r => r.json());
const idx2token = [...model_assets.specials, ...model_assets.chars];
const token2idx = {};
for (let i = 0; i < idx2token.length; i++) {
token2idx[idx2token[i]] = i;
}

console.log(`Load Time: ${performance.now().toFixed(2)} ms`);
postMessage({ type: "ready" });









// Posts batched chunks to reduce postMessage overhead.
// Optionally increases batch size when the UI's buffer grows (rudimentary backpressure).

let dynamicBatch = 256; // characters per post; tuned for fewer messages
let slowDown = false;

self.onmessage = (e) => {
  const { type, text, value } = e.data || {};
  if (type === "slowDown") {
    // If main thread buffer is growing too large, coarsen batching to reduce traffic.
    slowDown = !!value;
    dynamicBatch = slowDown ? 1024 : 256;
    return;
  }
  if (type !== "start") return;

  const src = text || "";
  const n = src.length;

  //breakpoints
  //if ([" ", ".", "!", "?", ",", ";", ":"].includes(char))


  // Tight loop: no awaits, no timers. Runs at full worker speed.
  // Only overhead here is occasional postMessage with batched slices.
  for (let i = 0; i < n; i += dynamicBatch) {
    const chunk = src.slice(i, i + dynamicBatch);
    // (Optional) insert heavy local compute here if you actually have it:
    // e.g., hashing, decoding, search — all stays off the UI thread.

    // Stream the batch out. Keep calls relatively infrequent to reduce overhead.
    postMessage({ type: "chunk", data: chunk });
  }

  postMessage({ type: "done" });
};
