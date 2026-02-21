# 📦 Extension Installation Guide

## ✅ Extension Package Created!

Your extension has been successfully packaged as:
**`ollama-copilot-1.0.0.vsix`**

Location: `/Users/ramanandc/Project/ollama-copilot/ollama-copilot-1.0.0.vsix`

## 🚀 Installation Methods

### Method 1: Install via VS Code UI (Recommended)

1. **Open VS Code**
2. **Open Extensions view**:
   - Click the Extensions icon in the Activity Bar (left side)
   - Or press `Cmd+Shift+X`
3. **Click the `...` menu** at the top of the Extensions view
4. **Select "Install from VSIX..."**
5. **Navigate to**: `/Users/ramanandc/Project/ollama-copilot/`
6. **Select**: `ollama-copilot-1.0.0.vsix`
7. **Click "Install"**
8. **Reload VS Code** when prompted

### Method 2: Install via Command Line

If you have the `code` command installed:

```bash
code --install-extension ollama-copilot-1.0.0.vsix
```

#### Setting up the `code` command (if not available):

1. Open VS Code
2. Press `Cmd+Shift+P`
3. Type: "Shell Command: Install 'code' command in PATH"
4. Press Enter
5. Then run the install command above

### Method 3: Drag and Drop

1. Open VS Code
2. Open the Extensions view (`Cmd+Shift+X`)
3. Drag `ollama-copilot-1.0.0.vsix` from Finder
4. Drop it onto the Extensions view
5. Click "Install"

## ✅ Verify Installation

After installation:

1. **Check Extensions**: Look for "Ollama Copilot" in your installed extensions
2. **Look for the status bar**: You should see **🤖 qwen2.5-coder:7b** in the bottom-right
3. **Open Command Palette** (`Cmd+Shift+P`) and search for "Ollama Copilot"

## 🎯 First Steps After Installation

### 1. Make Sure Ollama is Running

```bash
# Start Ollama
ollama serve

# In another terminal, pull a model
ollama pull qwen2.5-coder:7b
```

### 2. Open the Extension

- **Click** the 🤖 icon in the status bar, OR
- **Press** `Cmd+Shift+P` and type "Ollama Copilot: Open Panel"

### 3. Try Your First Feature

1. In the Ollama Copilot panel, type a feature request:
   ```
   Add a function to calculate factorial of a number
   ```
2. Click **"🚀 Implement Feature"**
3. Review the proposed changes
4. Click **"✓ Apply Patches"** to apply

## 🔧 Troubleshooting

### Extension Not Showing?

- **Restart VS Code** completely
- Check if any errors appear in Developer Console (`Help → Toggle Developer Tools`)

### "Ollama is not running" Error?

```bash
# Make sure Ollama is started
ollama serve

# Verify it's running
curl http://localhost:11434/api/version
```

### No Models Available?

```bash
# Pull a model
ollama pull qwen2.5-coder:7b

# Verify
ollama list
```

### Can't Find the Extension?

1. Open Extensions view (`Cmd+Shift+X`)
2. Click the `...` menu
3. Select "Show Installed Extensions"
4. Search for "Ollama Copilot"

## 📦 Sharing the Extension

You can share the `.vsix` file with others:

**File**: `ollama-copilot-1.0.0.vsix` (50.46 KB)

Anyone can install it using the same methods above.

## 🔄 Updating the Extension

If you make changes:

```bash
# 1. Make your changes
# 2. Compile
npm run compile

# 3. Package again
npx vsce package --allow-missing-repository

# 4. Uninstall old version first (in VS Code Extensions view)
# 5. Install new version
```

Or use the update script below.

## 🛠️ Quick Update Script

Create a file `update-extension.sh`:

```bash
#!/bin/bash
echo "🔨 Compiling..."
npm run compile

echo "📦 Packaging..."
npx vsce package --allow-missing-repository

echo "✅ Done! New package created:"
ls -lh *.vsix

echo ""
echo "To install:"
echo "1. Open VS Code"
echo "2. Uninstall old version of Ollama Copilot"
echo "3. Extensions → ... → Install from VSIX"
echo "4. Select: ollama-copilot-1.0.0.vsix"
```

Make it executable:
```bash
chmod +x update-extension.sh
./update-extension.sh
```

## 📊 Extension Info

- **Name**: Ollama Copilot
- **Version**: 1.0.0
- **Size**: 50.46 KB
- **Files**: 26 files included
- **Format**: .vsix (VS Code Extension Package)

## 🎉 You're All Set!

The extension is ready to install. Choose any installation method above and start coding with your local AI assistant!

---

**Need Help?** See the main [README.md](README.md) or [GETTING_STARTED.md](GETTING_STARTED.md)
