### Intro

This is a lightweight character level [LSTM](https://en.wikipedia.org/wiki/Long_short-term_memory) Recurrent Neural Network trained on the Bible as a text corpus. Data processing, model implementation, and model training are done in Python using Pandas and PyTorch. Matplotlib was used for initial data exploration and visualization of training metrics as part of model fine-tuning. After several development iterations, the final computation graph was exported to [ONNX](https://docs.pytorch.org/docs/stable/onnx.html) format, allowing the model to be served to the client for in-browser inference via the [`onnxruntime-web`](https://onnxruntime.ai/docs/) Javascript library.

The entire deployed model package (consisting of the `.onnx` model file and auxiliary assets, the ONNX Runtime WebAssembly module, and the Javascript sampling logic), has a minimal footprint of only 25 MB. Load time is typically `<1s` for desktop<a href="/bible-rnn/desktop_performance.html" class="cite">[1]</a> and `~3s` on mobile.<a href="/bible-rnn/mobile_performance.html" class="cite">[2]</a>

For implementation details, including the full PyTorch source code and related language modeling projects, feel free to visit my [GitHub repository](https://github.com/ruitaiS/language_models).



### Data Preparation

The source text for this model is the American King James Version of the Bible, which can be found on [OpenBible](https://openbible.com/textfiles/akjv.txt).

A driving factor for the selection of this source material (aside from its incredible cultural and spiritual value) is the consistency of its formatting. Each line begins with the book name, followed by the chapter and the verse numbers, then a tab, and finally the full verse text as one unbroken string. This allows each verse to be treated as its own self-contained unit of text, with clear delineating characters for where the verse starts (`\t`) and ends (`\n`).

I made the decision early on to strip the chapter and verse numbers since they are unnecessarily specific, but I was conflicted whether to keep the book names. I reasoned that without the book names, the output would be more generalized 

