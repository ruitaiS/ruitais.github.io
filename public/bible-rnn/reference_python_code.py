def init_hidden(self, batch_size):
    #if device is None:
    #    device = next(self.parameters()).device
    device='cpu'
    h = torch.zeros(self.lstm_layers, batch_size, self.hidden_dim, device=device)
    c = torch.zeros(self.lstm_layers, batch_size, self.hidden_dim, device=device)
    return (h, c)


def next_token_idx(model, token_idx, hidden, top_k=None, temperature=1.0):
    model.eval()
    h, c = hidden
    hidden = (h.detach(), c.detach())
    logits, hidden = model(torch.tensor([[token_idx]]), hidden)
    logits = logits[:, -1, :] / max(temperature, 1e-8)

    if top_k is not None and 0 < top_k < logits.size(-1):
        vals, idxs = torch.topk(logits, k=top_k, dim=-1)
        mask = torch.full_like(logits, float('-inf'))
        mask.scatter_(1, idxs, vals)
        logits = mask
    probs = F.softmax(logits, dim=1)
    next_idx = torch.multinomial(probs, num_samples=1).item()
    return next_idx, hidden

def sample(model, stop_token='\n', response_length=None, prime='\n', top_k=None, temperature=1.0):
    model.cpu()
    model.eval()
	delimiter = ''
	idx2token = model.idx2token # Export
	priming_indices = [model.token2idx[char] for char in prime]
    #print(f"Priming Tokens: {[idx2token[idx] for idx in priming_indices]}")
    #print(f"Priming Indices: {priming_indices}")
    hidden = model.init_hidden(batch_size = 1) # Export (Probably as pre-generated initial static value)
    # Iterate over priming chars to build up hidden state
    for token_idx in priming_indices:
        next_idx, hidden = next_token_idx(model, token_idx, hidden, top_k, temperature)

    # Start generating response:
    response_indices = [next_idx]
    if stop_token:
        # Export model.token2idx
        while response_indices[-1] != model.token2idx[stop_token] and len(response_indices) < 500:
            last_idx = response_indices[-1]
            next_idx, hidden = next_token_idx(model, last_idx, hidden, top_k, temperature)
            response_indices.append(next_idx)
    else:
        assert response_length is not None
        for _ in range(response_length):
            last_idx = response_indices[-1]
            next_idx, hidden = next_token_idx(model, last_idx, hidden, top_k, temperature)
            response_indices.append(next_idx)

    print(f'Response Indices: {response_indices}')

    return prime + delimiter.join([idx2token[idx] for idx in response_indices])

initial_hidden
idx2token
token2idx
