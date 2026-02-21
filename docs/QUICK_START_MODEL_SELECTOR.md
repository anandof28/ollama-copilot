# Model Selector - Quick Start

## 🚀 Quick Access

### Method 1: Status Bar (Fastest)
Click the **🤖** icon in the bottom-right corner of VS Code.

### Method 2: Command Palette
1. `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type: **"select model"**
3. Choose **"Ollama Copilot: Select Model"**

## 📋 What You'll See

```
┌─────────────────────────────────────────────────┐
│ Select Ollama Model                             │
├─────────────────────────────────────────────────┤
│ > qwen2.5-coder:7b              ✓ Current       │
│   4.7 GB • Modified: 2/15/2024                  │
│                                                 │
│   deepseek-coder:6.7b                          │
│   3.8 GB • Modified: 2/10/2024                  │
│                                                 │
│   codellama:13b                                │
│   7.4 GB • Modified: 2/8/2024                   │
│                                                 │
│   ✏️ Enter custom model name                    │
│   Manually specify a model name                 │
└─────────────────────────────────────────────────┘
```

## ⚡ Common Tasks

### Switch to a Different Model
1. Click 🤖 in status bar
2. Select new model
3. Done! Next request uses new model

### Use a Custom Model
1. Click 🤖 in status bar
2. Select "Enter custom model name"
3. Type model name (e.g., `mixtral:8x7b`)
4. Press Enter

### Check Current Model
Look at the status bar: **🤖 qwen2.5-coder:7b**

## 🔧 Settings

Open VS Code Settings and search for "ollama":

- **Model**: The model to use
- **Temperature**: Randomness (0 = deterministic, 2 = creative)
- **Max Tokens**: Maximum output length
- **API URL**: Ollama endpoint (default: localhost:11434)

## ❗ Troubleshooting

### "Ollama is not running"
```bash
# Start Ollama first:
ollama serve
```

### "No models found"
```bash
# Pull a model:
ollama pull qwen2.5-coder:7b
```

### Model not in list?
Use "Enter custom model name" option and type it manually.

## 📊 Recommended Models

| Model | Size | Best For |
|-------|------|----------|
| qwen2.5-coder:1.5b | 1 GB | Quick edits, fast |
| qwen2.5-coder:7b ⭐ | 4.7 GB | **Default - best balance** |
| deepseek-coder:6.7b | 3.8 GB | Code understanding |
| codellama:13b | 7.4 GB | Complex features |
| qwen2.5-coder:32b | 19 GB | Maximum quality |

## 💡 Tips

- **Start with default** (qwen2.5-coder:7b)
- **Smaller models** = faster responses
- **Larger models** = better quality
- **Lower temperature** (0-0.3) = more consistent code
- **You can switch anytime** - no restart needed!

---

For detailed documentation, see [MODEL_SELECTOR.md](MODEL_SELECTOR.md)
