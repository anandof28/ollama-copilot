#!/bin/bash

# Ollama Copilot Extension Installer
# This script helps install the extension in VS Code

echo "🤖 Ollama Copilot Extension Installer"
echo "======================================"
echo ""

# Find the latest .vsix file
VSIX_FILE=$(ls -t ollama-copilot-*.vsix 2>/dev/null | head -1)

# Check if .vsix file exists
if [ -z "$VSIX_FILE" ] || [ ! -f "$VSIX_FILE" ]; then
    echo "❌ Error: No ollama-copilot-*.vsix file found!"
    echo "Run 'npm run compile && npx vsce package --allow-missing-repository' first"
    exit 1
fi

echo "✅ Found: $VSIX_FILE"
echo ""

# Try method 1: code command
if command -v code &> /dev/null; then
    echo "📦 Installing via 'code' command..."
    code --install-extension "$VSIX_FILE"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully installed!"
        echo ""
        echo "Next steps:"
        echo "1. Reload VS Code window (Cmd+Shift+P → 'Reload Window')"
        echo "2. Look for 🤖 icon in the status bar"
        echo "3. Click it to select a model"
        echo "4. Open panel: Cmd+Shift+P → 'Ollama Copilot: Open Panel'"
        exit 0
    else
        echo "❌ Installation failed via code command"
        echo ""
    fi
fi

# Method 2: Manual instructions
echo "📖 Manual Installation Instructions:"
echo ""
echo "Since the 'code' command is not available, please:"
echo ""
echo "1. Open VS Code"
echo "2. Press Cmd+Shift+X to open Extensions"
echo "3. Click the '...' menu at the top"
echo "4. Select 'Install from VSIX...'"
echo "5. Navigate to: $(pwd)"
echo "6. Select: $VSIX_FILE"
echo "7. Click 'Install'"
echo "8. Reload VS Code when prompted"
echo ""
echo "Or drag and drop the .vsix file into VS Code's Extensions view!"
echo ""
echo "📁 Full path to installer:"
echo "   $(pwd)/$VSIX_FILE"
echo ""

# Try to open VS Code with the file
echo "Attempting to open in VS Code..."
open -a "Visual Studio Code" "$VSIX_FILE" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Opened in VS Code! VS Code should prompt you to install."
else
    echo ""
    echo "💡 To set up the 'code' command for future use:"
    echo "   1. Open VS Code"
    echo "   2. Press Cmd+Shift+P"
    echo "   3. Type: 'Shell Command: Install code command in PATH'"
    echo "   4. Press Enter"
    echo "   5. Then you can run: code --install-extension $VSIX_FILE"
fi

echo ""
