# Getting Started with Ollama Copilot

This guide will help you set up and run the Ollama Copilot extension.

## Prerequisites

### 1. Install Ollama
```bash
# macOS
brew install ollama

# Or download from https://ollama.ai
```

### 2. Start Ollama Service
```bash
# Start the Ollama service
ollama serve
```

### 3. Pull a Model
In a new terminal:
```bash
# Pull the recommended model (default)
ollama pull qwen2.5-coder:7b

# Or try other models:
# ollama pull deepseek-coder:6.7b
# ollama pull codellama:13b
```

## Installation

### 1. Install Dependencies
```bash
cd /Users/ramanandc/Project/ollama-copilot
npm install
```

This will install:
- TypeScript compiler
- VS Code extension API types
- Node.js type definitions
- ESLint and related tools

### 2. Compile the Extension
```bash
npm run compile
```

Or for continuous compilation:
```bash
npm run watch
```

## Running the Extension

### Method 1: Press F5 (Recommended)
1. Open this project in VS Code
2. Press `F5`
3. A new "Extension Development Host" window will open
4. The extension will be automatically activated

### Method 2: Command Line
```bash
# Compile first
npm run compile

# Then press F5 in VS Code
```

## Using the Extension

### 1. Open the Panel
- Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
- Type: `Ollama Copilot: Open Panel`
- Press Enter

### 2. Implement a Feature
In the panel:
1. Type your feature request in the text area
   - Example: "Add a function to calculate factorial"
   - Example: "Create a REST API endpoint for user login"
2. Click **"🚀 Implement Feature"**
3. Wait for the planner and coder agents to work
4. Review the proposed changes in the diff preview
5. Click **"✓ Apply Patches"** to apply the changes
6. (Optional) Click **"🧪 Run Tests"** to verify

### 3. Example Requests

Try these example requests:

**Simple Function:**
```
Add a function called 'isPrime' that checks if a number is prime
```

**API Endpoint:**
```
Create a GET /api/users endpoint that returns a list of users
```

**Bug Fix:**
```
Fix the off-by-one error in the loop at line 42
```

**Refactoring:**
```
Extract the validation logic into a separate function
```

**Testing:**
```
Add unit tests for the calculator module
```

## Configuration

Open VS Code settings (`Cmd+,` or `Ctrl+,`) and search for "Ollama Copilot":

```json
{
  // Ollama API endpoint
  "ollamaCopilot.apiUrl": "http://localhost:11434",
  
  // Model to use
  "ollamaCopilot.model": "qwen2.5-coder:7b",
  
  // Allowed commands (security whitelist)
  "ollamaCopilot.allowedCommands": [
    "npm test",
    "npm run build",
    "npm run lint",
    "pnpm test",
    "pytest"
  ]
}
```

## Troubleshooting

### Extension doesn't activate
- Make sure you have a workspace folder open
- Check the Output panel (View → Output → Select "Ollama Copilot")

### "Cannot connect to Ollama"
- Verify Ollama is running: `curl http://localhost:11434/api/version`
- Check the API URL in settings
- Make sure the model is pulled: `ollama list`

### Code generation is slow
- Smaller models are faster: try `qwen2.5-coder:1.5b`
- Check your system resources
- Ensure Ollama isn't using CPU-only mode on GPU-capable systems

### JSON parsing errors
- The extension automatically retries with a fix prompt
- If persistent, try a different model
- Check Ollama logs for issues

### Patches won't apply
- Review the diff carefully
- The file may have changed since context was gathered
- Try implementing smaller changes

## Development

### Watch Mode
For development, run the compiler in watch mode:
```bash
npm run watch
```

Then press `F5` to start debugging. Hot reload is supported.

### Debugging
- Set breakpoints in TypeScript files
- Use `console.log()` - output appears in Debug Console
- Check VS Code's Developer Tools: `Help → Toggle Developer Tools`

### Testing Manual Changes
You can test the extension by:
1. Creating a test workspace
2. Opening the Ollama Copilot panel
3. Making feature requests
4. Observing the behavior

## Architecture Quick Reference

```
User Request
    ↓
Planner Agent (analyzes, plans)
    ↓
workspace.scan() + search.findFiles()
    ↓
Coder Agent (generates patches)
    ↓
Diff Preview (user reviews)
    ↓
patch.apply() (if approved)
    ↓
Tester Agent (runs tests, fixes if needed)
```

## Next Steps

1. **Customize prompts**: Edit `src/protocol/prompts.ts`
2. **Add tools**: Create new tools in `src/tools/`
3. **Add agents**: Create new agents in `src/agents/`
4. **Improve UI**: Modify `src/ui/panel.ts`
5. **Extend security**: Modify allowed commands in settings

## Support

For issues or questions:
1. Check the Output panel in VS Code
2. Review the console in Developer Tools
3. Check Ollama logs: `ollama logs`
4. Open an issue on GitHub

---

**Happy Coding with Ollama Copilot! 🤖**
