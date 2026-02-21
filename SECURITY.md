# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### Where to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security issues by emailing:
- **Email**: security@example.com (or use GitHub Security Advisories)

### What to Include

Please include the following information:

1. **Description**: Clear description of the vulnerability
2. **Impact**: What could an attacker accomplish with this vulnerability?
3. **Steps to Reproduce**: Detailed steps to reproduce the issue
4. **Affected Versions**: Which versions are affected?
5. **Mitigation**: Any steps users can take to protect themselves?
6. **Proof of Concept**: Code or screenshots demonstrating the issue (if applicable)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies by severity (Critical: <7 days, High: <30 days, Medium/Low: <90 days)

### Disclosure Policy

- Please give us reasonable time to fix the vulnerability before public disclosure
- We will credit you in the security advisory (unless you prefer to remain anonymous)
- We will keep you informed of our progress

## Security Best Practices

### For Users

1. **Keep Updated**: Always use the latest version of the extension
2. **Review Changes**: Check diffs before applying code changes
3. **Command Whitelist**: Only add trusted commands to `ollamaCopilot.allowedCommands`
4. **Local Only**: The extension runs locally, but ensure your Ollama instance is secured
5. **Workspace Trust**: Only use the extension in trusted workspaces

### For Contributors

1. **No Secrets**: Never commit API keys, tokens, or credentials
2. **Input Validation**: Validate and sanitize all user inputs
3. **Command Execution**: Use the whitelisted terminal tool for all command execution
4. **File Operations**: Validate file paths to prevent directory traversal
5. **Dependencies**: Keep dependencies updated and audit regularly

## Known Security Considerations

### Terminal Command Execution

- Commands are whitelisted via configuration
- Default whitelist includes only common test/build commands
- Users can add commands but should understand the risks

### File System Access

- The extension requires read/write access to workspace files
- All file operations are logged
- Changes are previewed before application

### AI Model Integration

- All AI processing happens locally via Ollama
- No data is sent to external services
- Model outputs should be reviewed before applying

## Security Updates

Security updates will be released as soon as possible and will be documented in:

- GitHub Security Advisories
- CHANGELOG.md
- Release notes

## Questions?

For general security questions (not vulnerabilities), please open a public GitHub issue with the "security" label.

Thank you for helping keep Ollama Copilot secure!
