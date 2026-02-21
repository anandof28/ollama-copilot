# Model Selector - User Guide

The Ollama Copilot extension includes a comprehensive model selection system that allows you to easily switch between different Ollama models.

## Features

✅ **Auto-detect installed models** - Fetches models from your local Ollama installation  
✅ **Quick selection** - Simple dropdown to choose models  
✅ **Status bar indicator** - Always see which model is active  
✅ **Manual entry** - Add models not yet installed locally  
✅ **Connection testing** - Detects when Ollama is not running  
✅ **Persistent settings** - Your selection is saved globally

## How to Use

### Method 1: Command Palette

1. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. Type: `Ollama Copilot: Select Model`
3. Choose from the list of installed models
4. Or select "Enter custom model name" to type manually

### Method 2: Status Bar

1. Look for the robot icon in the status bar (bottom right): `🤖 qwen2.5-coder:7b`
2. Click on it
3. The model selector will open

## Available Settings

Configure in VS Code settings (`Cmd+,` or `Ctrl+,`):

### `ollamaCopilot.model`
- **Type**: `string`
- **Default**: `"qwen2.5-coder:7b"`
- **Description**: The Ollama model to use for code generation

### `ollamaCopilot.apiUrl`
- **Type**: `string`
- **Default**: `"http://localhost:11434"`
- **Description**: Ollama API endpoint (change if running remotely)

### `ollamaCopilot.temperature`
- **Type**: `number`
- **Default**: `0.1`
- **Range**: `0` to `2`
- **Description**: Controls randomness (0 = deterministic, 2 = very creative)

### `ollamaCopilot.maxTokens`
- **Type**: `number`
- **Default**: `4000`
- **Range**: `100` to `32000`
- **Description**: Maximum tokens the model can generate

## Recommended Models

### For Code Generation (Recommended)

**qwen2.5-coder:7b** ⭐ (Default)
- Best balance of speed and quality
- Excellent for most coding tasks
- ~4.7 GB

**deepseek-coder:6.7b**
- Very good code understanding
- Fast inference
- ~3.8 GB

**codellama:13b**
- Larger model, better quality
- Slower but more accurate
- ~7.4 GB

### For Smaller Systems

**qwen2.5-coder:1.5b**
- Very fast
- Lower quality but usable
- ~1 GB

**starcoder2:3b**
- Good for simple tasks
- Fast inference
- ~1.7 GB

### For Maximum Quality

**qwen2.5-coder:32b**
- Best quality
- Very slow
- Requires powerful hardware
- ~19 GB

**codellama:70b**
- Excellent results
- Extremely slow
- High-end GPU required
- ~39 GB

## Installing New Models

If a model isn't listed, install it first:

```bash
# View available models
ollama list

# Pull a new model
ollama pull qwen2.5-coder:7b

# Pull specific size
ollama pull codellama:13b
```

Then refresh the extension's model list by running the select command again.

## Troubleshooting

### "Ollama is not running"

**Solution**: Start Ollama first
```bash
ollama serve
```

Or launch the Ollama app (if using desktop version).

### "No models found"

**Solution**: Pull at least one model
```bash
ollama pull qwen2.5-coder:7b
```

### Model not appearing in list

**Solution**: 
1. Verify it's installed: `ollama list`
2. Use "Enter custom model name" option
3. Type the exact model name (e.g., `qwen2.5-coder:7b`)

### Connection refused

**Solution**: Check your `apiUrl` setting
- Default: `http://localhost:11434`
- If Ollama runs elsewhere, update the setting
- Verify with: `curl http://localhost:11434/api/version`

### Model is slow

**Solutions**:
1. Switch to a smaller model (qwen2.5-coder:1.5b)
2. Check system resources
3. Ensure Ollama is using GPU acceleration
4. Reduce `maxTokens` setting

### Responses are too creative/random

**Solution**: Lower the `temperature` setting
- Set to `0` for deterministic output
- Default `0.1` is already quite low
- Good range: `0` to `0.3` for code

### Responses are too conservative

**Solution**: Increase the `temperature` setting
- Try `0.3` to `0.5` for more creativity
- Don't go above `1.0` for code generation

## Tips

### Best Practices

1. **Start with the default** (`qwen2.5-coder:7b`)
2. **Match model to task**:
   - Simple edits → smaller model (1.5b, 3b)
   - Complex features → larger model (13b, 32b)
3. **Adjust temperature** based on task:
   - Bug fixes → 0 (deterministic)
   - Feature ideas → 0.3-0.5 (creative)
4. **Monitor performance** via status bar

### Switching Models Mid-Session

You can change models anytime:
1. Click status bar icon
2. Select new model
3. Next request will use the new model
4. Previous chat history is preserved

### Testing Models

Try the same prompt with different models:
1. Note current model
2. Try the request
3. Switch model (via status bar)
4. Try again
5. Compare results

## Advanced Configuration

### Remote Ollama Server

If Ollama runs on another machine:

```json
{
  "ollamaCopilot.apiUrl": "http://192.168.1.100:11434"
}
```

### Custom Model Parameters

The extension automatically uses appropriate parameters per agent:

- **Planner**: `temperature: 0.2`, `num_predict: 2000`
- **Coder**: `temperature: 0.1`, `num_predict: 4000`
- **Tester**: `temperature: 0.1`, `num_predict: 3000`

These are optimized defaults but respect your global `temperature` setting when specified.

### Performance Optimization

For faster responses:

```json
{
  "ollamaCopilot.model": "qwen2.5-coder:1.5b",
  "ollamaCopilot.temperature": 0,
  "ollamaCopilot.maxTokens": 2000
}
```

For best quality (slow):

```json
{
  "ollamaCopilot.model": "qwen2.5-coder:32b",
  "ollamaCopilot.temperature": 0.1,
  "ollamaCopilot.maxTokens": 8000
}
```

## Status Bar States

The status bar shows different states:

- `🤖 qwen2.5-coder` - Normal, model ready
- `🤖 Loading...` - Fetching model list
- `🤖 Error` - Connection issue (click to retry)

## Keyboard Shortcuts

You can add a custom keybinding:

1. Open Keyboard Shortcuts (`Cmd+K Cmd+S`)
2. Search: "Ollama Copilot: Select Model"
3. Assign your preferred key (e.g., `Cmd+Shift+M`)

Or edit `keybindings.json`:

```json
{
  "key": "cmd+shift+m",
  "command": "ollama-copilot.selectModel"
}
```

---

**Questions?** See the main README or open an issue on GitHub.
