[TODO]
- Time to load
- Time per token
- Training eval metrics

### Model Architecture

### Dataset

[fixed length sequences >> right-aligned verses >> (still need to retrain this) left-aligned verses]

- left aligned verses
- Remove unnecessary characters (eg. remove `<` entirely at the start, and `>\t` should be shortened to `\t`)
	- consistent start tokens are valuable for cross sequence sampling, but if we assume we're always going to generate a single sequence, it is basically noise the model has to learn to ignore. 
	- using `>\t` as a boundary instead of `\t` takes up space in the context window without giving learnable content

### Finetuning

### 



 exported to the [] `.onnx` format, where it is served client-side written in pytorch and served clientside within the web browser via ONNX web runtime.

The original text starts with the book name, followed by a tab character, and ending with the newline character, which proved to be very useful as it allowed clear delineations between the start of each verse, the book and verse strings, and the end of the verse.

the model uses an embedding layer to convert the vocabulary (characters or tokens) into embedding tensors of length defined by hidden dimension, followed by a dropout layer, several lstm layers, another dropout layer, and lastly a fully connected layer, outputting logits and the updated hidden state. softmax was done as a seperate step during the model development phase to allow for temperature experimentation, but for model export, the model was placed in a wrapper which included the softmax layer (with temperature = 1 baked in) and unpacked the hidden state pair into a (hidden, cell) state tuple to simplify feeding onnx-web runtime tensors through the model.

initial models used one-hot encoding, and were later switched to token embeddings which substantially improved the results. After training for 20ish epochs, the results are decent [insert an example of output], but obviously had room for improvement. in the course of training i used the validation set to tweak my training parameters to make sure i wasn't overfitting. on some of the earlier models you can see the validation loss plateau well while the training loss continues to decrease, indicating overfitting.

text generation is handled recurrently by feeding the hidden state and previously generated token back into the model. the hidden state consists of two tensors, a hidden and a cell state, with dimensions [# of lstm layers, batch size, hidden dimension], both initialized with zero vectors. during training, batch size > 1 allows for multiple sequences to be processed in parallel [not totally sure about correctness of this fact] but during generation batch size was set to 1 to force token by token generation. during generation the hidden state is primed by running a predetermined sequence of tokens through the model, updating the hidden state in-place and discarding the generated token, replacing it with the next token in the predetermined sequence, until the priming sequence is exhausted. the final generated token at the end of the priming process is then used as the first true output token, and the model is then allowed to run recurrently, using its own outputs to generate new ones

several priming sequences were experimented with, such as the tab character (which in our corpus starts the verse string), the book name in full, as well as the `<` character, which is the character leading the book title ( eg. `<Genesis>`)

i also experimented with leaving the book title in vs. simply starting each verse with the tab characters; ultimately the model performed quite well with the book titles included, even being able to select and generate book names when primed with only `<`, so i kept them.

for training, hidden states are reset at the end of each batch to ensure that we're not carrying data over between verses. for the "full text string" versions of the model, which chunked up the entire text into fixed length sequence, i did experiment with resetting the hidden state each epoch, but this did not make a huge difference, presumably because the sequences weren't starting or terminating on verses, but were all arbitrary sections of verses.

the biggest jump in performance came after splitting sequences along verses, and allowing for arbitrary length training sequences (ensuring all verses are one continous sequence, and never split) by taking a batch of sequences, and right padding with the `<>` pad token, and resetting the hidden state each batch. this method of batching allowed i believe for true full sequence learning, with hidden states initialized at 0 and resetting at the end of each sequence, as opposed to previously, where the model was merely seeing snippets of sequences out of context (which actually performed surprisingly well for what it was)

porting to the onnx web runtime was a fairly straightfoward, though fairly involved process. becuase onnx only saves the network graph [i'm not sure the word for this], the entirety of the text generation code needed to be ported over to javascript. this included carrying over the model vocabulary to create index to token and token to index lookup tables, as well as the model dimensions needed to initialize the hidden states (# of lstm layers and hidden dimension). for memory optimization i compressed the vocabulary down into a single string of characters in the same order as their respective indices, and seperately stored the special `<>`, `\t`, and `\n` tokens; these two lists allowed me to rebuild the idx2token and token2idx tables within javascript client-side. to simplify runtime, the hidedn state tuple was expanded to the hidden and cell state tensors rather than paired, and the softmax calculation was packaged with the model with a temperature setting of 1, so that the exported model accepts [token index, hidden state, cell state] as inputs and outputs [softmaxed probabilities across the vocabulary of tokens, hidden state, cell state] directly. i wrote a basic multinomial sampling function to grab the token index from the probability vector outputted by the model, and, just as in the pytorch script, converted this back into a character via the idx2token lookup table,

future developments will be gpu support (the current model is trained entirely on cpu, as i did not have a gpu at the time, but having recently purchased one, i'm eager to try it out) as well as word-level or byte-pair tokenization. i did briefly experiment with word-level tokenization, but because of the increase in vocabulary size as a result of cataloguing individual words rather than unique characters, it created substantially larger models than the character level ones (\>100mb) and were larger than github would allow hosting, so this idea was abandoned as it would be too large to allow for in-browser inference on a hosted github pages site. however, it seems that because converting into onnx strips out the optimizer, the onnx models are about half the size of the pytorch models, so this has resurfaced as an avenue worth exploring.

all in all this was an incredibly informative experience during which i got to touch all aspects of ml model deployment, from data cleaning and preparation, model architecture implementation, training finetuning, model export, and porting generation code for client-side inference.