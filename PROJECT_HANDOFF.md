# Ollama Copilot - Project Handoff Document

**Date**: February 21, 2026  
**Version**: 1.1.0  
**Status**: Production Ready - Open Source Ready

---

## 📋 Project Overview

**Ollama Copilot** is a fully-featured VS Code extension that provides an intelligent AI coding assistant powered by local Ollama models. It's designed to work like GitHub Copilot but runs entirely on your local machine.

### What It Does

- **Code Mode**: Full implementation workflow (plan → generate → preview → apply)
- **Plan Mode**: Create implementation plans without generating code
- **Ask Mode**: Answer questions about your codebase with context awareness
- Multi-file editing with safe unified diff previews
- Chat history that persists across VS Code sessions
- Model selection and switching
- Cancellable long-running operations

### Technology Stack

- **Language**: TypeScript (strict mode)
- **Platform**: VS Code Extension API 1.75+
- **AI Backend**: Ollama (local HTTP API at localhost:11434)
- **Architecture**: Multi-agent system with tools
- **UI**: Webview-based sidebar chat (similar to GitHub Copilot)

---

## 🏗️ Architecture Overview

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                      VS Code Extension                       │
│                     (extension.ts)                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Planner    │  │    Coder     │  │    Tester    │      │
│  │    Agent     │→ │    Agent     │→ │    Agent     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            ↓                                  │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Ollama Client                          │     │
│  │         (HTTP API: localhost:11434)                 │     │
│  └────────────────────────────────────────────────────┘     │
│                            ↓                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Workspace │  │  Search  │  │   Patch  │  │ Terminal │   │
│  │   Tool   │  │   Tool   │  │   Tool   │  │   Tool   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                            ↓                                  │
│  ┌────────────────────────────────────────────────────┐     │
│  │           Chat View (Webview Sidebar)               │     │
│  │    - Mode selector (Code/Plan/Ask)                  │     │
│  │    - Model selector dropdown                        │     │
│  │    - Chat history with persistence                  │     │
│  │    - Stop button for cancellation                   │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
ollama-copilot/
├── src/
│   ├── extension.ts              # Main extension controller
│   │                             # - Handles activation/deactivation
│   │                             # - Message routing from UI
│   │                             # - Orchestrates agents and tools
│   │
│   ├── agents/                   # AI Agents (specialized LLM workflows)
│   │   ├── planner.ts           # Creates implementation plans
│   │   ├── coder.ts             # Generates code patches
│   │   └── tester.ts            # Runs tests and fixes failures
│   │
│   ├── ollama/                   # Ollama Integration
│   │   ├── client.ts            # HTTP client for /api/chat, /api/tags
│   │   └── modelSelector.ts     # Model selection UI + status bar
│   │
│   ├── tools/                    # Workspace Operations
│   │   ├── workspace.ts         # File I/O, structure analysis
│   │   ├── search.ts            # Code search across workspace
│   │   ├── patch.ts             # Unified diff application
│   │   └── terminal.ts          # Safe command execution
│   │
│   ├── ui/                       # User Interface
│   │   ├── chatView.ts          # Sidebar webview provider
│   │   └── panel.ts             # (Legacy panel - not used in v1.1)
│   │
│   └── protocol/                 # Type Definitions
│       ├── types.ts             # TypeScript interfaces
│       └── prompts.ts           # System prompts for agents
│
├── docs/                         # All documentation
├── out/                          # Compiled JavaScript (generated)
├── resources/                    # Assets (icon.svg)
├── package.json                  # Extension manifest
├── tsconfig.json                 # TypeScript configuration
└── ollama-copilot-1.1.0.vsix    # Packaged extension
```

---

## 🔄 Data Flow

### Code Mode Workflow

1. User types request in chat → `chatView.ts` sends message
2. `extension.ts` receives `implementFeature` command
3. **Planning Phase**:
   - `planner.ts` analyzes workspace structure
   - Creates implementation plan with steps and files
4. **Code Generation Phase**:
   - `coder.ts` reads relevant files via `workspace.ts`
   - Uses `search.ts` to find related code
   - Generates unified diff patches
5. **Preview Phase**:
   - `chatView.ts` displays diff preview
6. **Apply Phase** (when user clicks):
   - `patch.ts` applies unified diffs to files
7. **Test Phase** (optional):
   - `tester.ts` runs whitelisted commands
   - Analyzes failures and generates fixes

### Ask Mode Workflow

1. User asks question → `chatView.ts` sends message
2. `extension.ts` receives `askQuestion` command
3. **Context Gathering**:
   - Extract keywords from question
   - Search workspace via `search.ts`
   - Read relevant files
   - Analyze workspace structure
4. **Answer Generation**:
   - Send context + question to Ollama
   - Stream response back to chat

---

## 🚀 Setup Instructions

### Prerequisites

1. **Ollama**: Install from [ollama.ai](https://ollama.ai)
2. **Model**: Pull a coding model
   ```bash
   ollama pull qwen2.5-coder:7b
   ```
3. **Node.js**: v18 or higher
4. **VS Code**: v1.75 or higher

### Installation on Mac Mini

```bash
# 1. Transfer the project
# Copy the entire ollama-copilot folder to your Mac Mini

# 2. Navigate to the project
cd ~/Projects/ollama-copilot  # or wherever you placed it

# 3. Install dependencies
npm install

# 4. Compile TypeScript
npm run compile

# 5. Open in VS Code
code .

# 6. Press F5 to launch Extension Development Host
# This opens a new VS Code window with the extension loaded
```

### Or Install the Packaged Extension

```bash
# Install the .vsix file directly
code --install-extension ollama-copilot-1.1.0.vsix

# Then restart VS Code
```

---

## 🛠️ Development Workflow

### Daily Development

```bash
# Start watch mode (auto-recompile on save)
npm run watch

# In VS Code, press F5 to launch Extension Development Host
# Make changes, save, reload extension window (Cmd+R)
```

### Testing

1. Press `F5` in VS Code
2. In the Extension Development Host window:
   - Click the 🤖 icon in Activity Bar
   - Select a model from dropdown
   - Choose a mode (Code/Plan/Ask)
   - Type a test prompt
3. Check output in Debug Console for errors

### Building & Packaging

```bash
# Compile TypeScript
npm run compile

# Run linter
npm run lint

# Package as .vsix
npm run package
# Creates: ollama-copilot-1.1.0.vsix
```

---

## 🔑 Key Files Explained

### extension.ts (Main Controller)

**Purpose**: Entry point and orchestrator

**Key Functions**:
- `activate()`: Called when VS Code loads the extension
- `handleMessage()`: Routes messages from the chat UI
- `implementFeature()`: Code mode workflow
- `planFeature()`: Plan mode workflow
- `askQuestion()`: Ask mode workflow

**Important**:
- Manages `chatView` (sidebar UI)
- Creates all agents and tools
- Handles cancellation tokens
- Listens for configuration changes

### ui/chatView.ts (Chat Interface)

**Purpose**: Webview sidebar provider with chat UI

**Features**:
- Three mode buttons (Code/Plan/Ask)
- Model selector dropdown
- Chat message history
- Stop button during processing
- Persistence of chat history to VS Code global state

**Key Methods**:
- `addMessage()`: Add message to chat + save to history
- `startProcessing()`: Show stop button, create cancellation token
- `stopProcessing()`: Hide stop button, cancel operations
- `updateModels()`: Refresh model dropdown

### agents/planner.ts

**Purpose**: Creates implementation plans

**How it works**:
1. Gets workspace structure
2. Sends system prompt + user request to Ollama
3. Expects JSON response with:
   - `feature`: What to build
   - `steps`: List of implementation steps
   - `files_to_read`: Files to analyze
   - `search_queries`: Keywords to search
4. Retries if JSON parsing fails

### agents/coder.ts

**Purpose**: Generates code patches

**How it works**:
1. Reads files specified in plan
2. Searches for relevant code
3. Sends context to Ollama
4. Expects JSON response with patches array
5. Each patch has:
   - `path`: File path
   - `diff`: Unified diff format

### tools/workspace.ts

**Purpose**: File system operations

**Key Methods**:
- `listFiles()`: Glob pattern file search
- `readFile()`: Read file contents
- `writeFile()`: Write file contents
- `getWorkspaceStructure()`: Comprehensive workspace analysis
  - Detects tech stack (React, Vue, Python, etc.)
  - Lists key files
  - Shows directory tree with file counts

### tools/patch.ts

**Purpose**: Apply unified diff patches

**How it works**:
1. Parses unified diff format
2. Applies hunks line by line
3. Creates new files if needed
4. Validates patch application

### ollama/client.ts

**Purpose**: HTTP communication with Ollama

**Key Methods**:
- `chat()`: Non-streaming request
- `chatStream()`: Streaming request with callbacks
- `setModel()`: Change current model
- Uses native `http`/`https` modules (no external deps)

---

## ⚙️ Configuration

Settings are in VS Code Settings (JSON):

```json
{
  "ollamaCopilot.apiUrl": "http://localhost:11434",
  "ollamaCopilot.model": "qwen2.5-coder:7b",
  "ollamaCopilot.temperature": 0.1,
  "ollamaCopilot.maxTokens": 4000,
  "ollamaCopilot.allowedCommands": [
    "npm test",
    "npm run build",
    "pytest"
  ]
}
```

**Security Note**: `allowedCommands` is a whitelist. Only these commands can be executed via the Terminal tool.

---

## 🐛 Troubleshooting

### Extension Won't Activate

**Check**:
1. Open folder in VS Code (required for workspace operations)
2. Check Output panel → Ollama Copilot for errors
3. Verify extension is installed: Extensions view → Search "Ollama"

### No Models in Dropdown

**Fix**:
1. Ensure Ollama is running: `ollama serve`
2. Check API URL in settings
3. Pull a model: `ollama pull qwen2.5-coder:7b`
4. Reload VS Code window

### Compilation Errors

```bash
# Clean and rebuild
rm -rf out/
npm run compile
```

### Chat History Not Persisting

**Issue**: History stored in VS Code global state
**Fix**: Check `~/.vscode/globalStorage` permissions

### Stop Button Doesn't Work

**Check**: Cancellation is cooperative - agent must check `cancelToken.isCancellationRequested` at breakpoints

---

## 📊 Current State (v1.1.0)

### What Works ✅

- [x] Sidebar chat interface
- [x] Three modes (Code/Plan/Ask)
- [x] Model selection
- [x] Chat history persistence
- [x] Stop button
- [x] Workspace intelligence
- [x] Multi-file editing
- [x] Unified diff preview
- [x] Patch application
- [x] Test integration
- [x] Configuration system

### Known Limitations ⚠️

- Test agent not fully integrated in sidebar UI
- No streaming response display (waits for full response)
- Limited to whitelisted terminal commands
- No multi-turn conversation context (each request is independent)
- No file creation GUI (creates files via patches only)

### Future Enhancements 💡

- Streaming responses with partial updates
- Conversation context (remember previous messages)
- Inline diff editor
- Code lens actions
- Git integration
- Custom agent configuration
- Plugin system for tools

---

## 🎯 Quick Reference Commands

### Development

```bash
npm install              # Install dependencies
npm run compile          # Compile once
npm run watch           # Watch mode
npm run lint            # Run ESLint
npm run package         # Create .vsix
```

### Git (When Publishing)

```bash
git init
git add .
git commit -m "Initial commit: v1.1.0"
git remote add origin <your-github-url>
git push -u origin main
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0
```

### VS Code

- **F5**: Launch Extension Development Host
- **Cmd+R**: Reload extension in dev window
- **Cmd+Shift+P**: Command palette
- **Cmd+Shift+I**: Toggle Developer Tools (for webview debugging)

---

## 📝 Important Notes for New Developer

1. **Chat History**: Stored in VS Code global state, limit 100 messages
   - Location: `context.globalState.get('chatHistory')`

2. **Cancellation**: All modes support cancellation via `CancellationTokenSource`
   - Check `cancelToken.token.isCancellationRequested` at natural breakpoints

3. **Error Handling**: Errors propagate up to `handleMessage()` which stops processing and shows error in chat

4. **Workspace Requirement**: Most features require an open folder (not just files)

5. **Security**: Terminal commands MUST be whitelisted in settings

6. **Model Context**: Each request is stateless - no conversation memory (by design)

7. **File Paths**: Always use workspace-relative paths, never absolute

8. **Testing**: Manual testing only - no automated tests yet

---

## 📞 Support & Resources

### Documentation

- Main README: [README.md](README.md)
- Getting Started: [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)
- Development Guide: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- Publishing Checklist: [PUBLISH_CHECKLIST.md](PUBLISH_CHECKLIST.md)

### External Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Ollama API Docs](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Unified Diff Format](https://www.gnu.org/software/diffutils/manual/html_node/Unified-Format.html)

---

## 🎉 You're Ready!

This project is **production-ready** and **open-source ready**. The code is clean, documented, and follows VS Code extension best practices.

To get started on your Mac Mini:

1. Copy the project folder
2. Run `npm install`
3. Press `F5` in VS Code
4. Start coding!

**Questions?** Review the docs/ folder or check the inline code comments.

---

*Last Updated: February 21, 2026*  
*Version: 1.1.0*  
*Status: Ready for Open Source Release*
