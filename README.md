# Ollama Copilot

> 🤖 **An intelligent AI coding assistant powered by local Ollama models**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.75+-blue.svg)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

Ollama Copilot is a VS Code extension that brings GitHub Copilot-like AI assistance directly to your editor, running **entirely on your local machine** using [Ollama](https://ollama.ai). Unlike simple chat extensions, this is a full **agentic system** with multi-mode support for planning, coding, and Q&A.

## ✨ Features

### 🎯 Three Intelligent Modes

- **💻 Code Mode**: Full implementation workflow - plan → generate → preview → apply
- **📋 Plan Mode**: Create detailed implementation plans without code generation  
- **💬 Ask Mode**: Context-aware Q&A about your codebase

### 🚀 Core Capabilities

- **🧠 Multi-Agent System**: Specialized agents for planning, coding, and testing
- **🔍 Workspace Intelligence**: Deep understanding of your project structure and tech stack
- **📝 Multi-File Editing**: Make coordinated changes across multiple files
- **👀 Safe Previews**: Review unified diffs before applying any changes
- **✅ Test Integration**: Automatically run tests and iterate on failures
- **🎨 Modern UI**: Clean sidebar chat interface similar to GitHub Copilot
- **📚 Chat History**: Persistent conversation history across sessions
- **⏹️ Cancellation Support**: Stop long-running operations at any time
- **🏠 100% Local**: All AI processing happens on your machine via Ollama
- **🔒 Secure**: Whitelisted command execution for safety

## 📋 Prerequisites

### 1. Install Ollama

Download and install Ollama from [ollama.ai](https://ollama.ai)

### 2. Pull a Model

```bash
# Recommended: Qwen 2.5 Coder (7B)
ollama pull qwen2.5-coder:7b

# Or try other models:
ollama pull codellama:7b
ollama pull deepseek-coder:6.7b
ollama pull mistral:7b
```

### 3. Start Ollama Server

```bash
ollama serve
```

## 🔧 Installation

### From VSIX (Recommended)

1. Download the latest `.vsix` file from [Releases](../../releases)
2. Open VS Code
3. Press `Cmd+Shift+X` (macOS) or `Ctrl+Shift+X` (Windows/Linux) to open Extensions
4. Click the `...` menu → **Install from VSIX...**
5. Select the downloaded `.vsix` file
6. Reload VS Code when prompted

### From Source

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ollama-copilot.git
cd ollama-copilot

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Package extension
npx vsce package --allow-missing-repository

# Install the .vsix file in VS Code
```

## 🎯 Quick Start

### 1. Open the Chat Sidebar

Click the 🤖 **Ollama Copilot** icon in the Activity Bar (left sidebar)

### 2. Select Your Model

Use the dropdown at the top of the chat to choose your preferred Ollama model

### 3. Choose a Mode

- **💻 Code** - Full implementation workflow
- **📋 Plan** - Planning only
- **💬 Ask** - Q&A with workspace context

### 4. Start Chatting!

**Example prompts:**

```
Code Mode:
"Add a login form with email validation"
"Refactor the UserService to use dependency injection"
"Create a REST API endpoint for user registration"

Plan Mode:
"How should I implement user authentication?"
"What's the best way to add caching to this API?"

Ask Mode:
"What does the fetchData function in api.ts do?"
"How is error handling implemented in this codebase?"
"Where is the database connection configured?"
```

## 🏗️ Architecture

```
ollama-copilot/
├── src/
│   ├── extension.ts          # Main extension controller
│   ├── agents/                # AI agents
│   │   ├── planner.ts        # Implementation planning
│   │   ├── coder.ts          # Code generation
│   │   └── tester.ts         # Test execution & fixing
│   ├── ollama/               # Ollama integration
│   │   ├── client.ts         # HTTP client for Ollama API
│   │   └── modelSelector.ts  # Model selection UI
│   ├── tools/                # Workspace operations
│   │   ├── workspace.ts      # File I/O and structure
│   │   ├── search.ts         # Code search
│   │   ├── patch.ts          # Unified diff application
│   │   └── terminal.ts       # Command execution
│   ├── ui/                   # User interface
│   │   └── chatView.ts       # Sidebar chat panel
│   └── protocol/             # Type definitions
│       ├── types.ts          # TypeScript interfaces
│       └── prompts.ts        # System prompts
└── docs/                     # Documentation
```

## ⚙️ Configuration

Open VS Code Settings (`Cmd+,` or `Ctrl+,`) and search for "Ollama Copilot":

| Setting | Default | Description |
|---------|---------|-------------|
| `ollamaCopilot.apiUrl` | `http://localhost:11434` | Ollama API base URL |
| `ollamaCopilot.model` | `qwen2.5-coder:7b` | Default Ollama model |
| `ollamaCopilot.temperature` | `0.1` | Model temperature (0-2) |
| `ollamaCopilot.maxTokens` | `4000` | Maximum tokens to generate |
| `ollamaCopilot.allowedCommands` | `["npm test", ...]` | Whitelisted terminal commands |

## 🎨 Features in Detail

### Code Mode: Full Implementation

1. **Planning Phase**: AI analyzes your request and workspace to create an implementation plan
2. **Code Generation**: Generates code changes across multiple files
3. **Preview**: Shows unified diffs of all proposed changes
4. **Apply**: Safely applies patches to your workspace
5. **Testing**: Runs tests and iterates if failures occur

### Plan Mode: Architecture Planning

- Creates detailed implementation plans without generating code
- Perfect for understanding how to approach complex features
- Lists files to modify, steps to take, and considerations
- Switch to Code mode to implement the plan

### Ask Mode: Intelligent Q&A

- Context-aware answers based on your actual codebase
- Searches and reads relevant files automatically
- References specific code and file locations
- No code modifications, just helpful information

### Chat History

- Conversations persist across VS Code sessions
- Stored locally in VS Code's global state
- Automatically trimmed to last 100 messages
- Clear chat anytime with dedicated button

### Stop Button

- Cancel long-running operations
- Appears during AI processing
- Safe cancellation at natural breakpoints
- Resume with new prompts

## 🛠️ Development

### Setup

```bash
npm install
npm run compile
```

### Run & Debug

Press `F5` in VS Code to launch the extension in a new Extension Development Host window

### Package

```bash
npm run package
# Creates ollama-copilot-X.X.X.vsix
```

### Lint

```bash
npm run lint
```

## 📖 Documentation

- [Getting Started Guide](docs/GETTING_STARTED.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Installation Guide](docs/INSTALL.md)
- [Model Selector](docs/MODEL_SELECTOR.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai) - For making local LLMs accessible
- [VS Code](https://code.visualstudio.com/) - For the amazing extension API
- Inspired by [GitHub Copilot](https://github.com/features/copilot) and [Aider](https://github.com/paul-gauthier/aider)

---

**Made with ❤️ for the open source community**
