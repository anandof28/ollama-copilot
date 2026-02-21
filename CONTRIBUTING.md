# Contributing to Ollama Copilot

Thank you for your interest in contributing to Ollama Copilot! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ollama-copilot.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes: `git commit -m 'Add some feature'`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode (auto-recompile on changes)
npm run watch

# Run linter
npm run lint

# Package extension
npm run package
```

## Code Style

- We use TypeScript with strict mode enabled
- Follow the existing code style (use ESLint)
- Write clear, descriptive commit messages
- Add comments for complex logic
- Keep functions focused and single-purpose

## Testing

- Test your changes manually by pressing `F5` to launch the extension
- Ensure all existing features still work
- Test edge cases and error handling
- Verify the extension works with different Ollama models

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation in the `docs/` folder if applicable
3. Ensure your code passes linting: `npm run lint`
4. The PR will be merged once you have approval from a maintainer

## Reporting Bugs

Please use [GitHub Issues](../../issues) to report bugs. Include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- VS Code version
- Ollama version and model
- Extension version
- Error messages or logs

## Feature Requests

We love new ideas! Please:

1. Check if the feature is already requested in Issues
2. Create a new issue with the "enhancement" label
3. Describe the feature and its use case
4. Explain why it would be valuable

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community

## Questions?

Feel free to open an issue with the "question" label or start a discussion in [GitHub Discussions](../../discussions).

Thank you for contributing! 🎉
