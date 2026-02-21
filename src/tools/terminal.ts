/**
 * Terminal tool for running commands securely
 */

import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import { CommandResult, ToolResult } from '../protocol/types';

const execAsync = promisify(exec);

export class TerminalTool {
  private allowedCommands: string[];
  private workspaceRoot: string;

  constructor(allowedCommands: string[], workspaceRoot: string) {
    this.allowedCommands = allowedCommands;
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Run a command securely (only whitelisted commands)
   */
  async runCommand(command: string): Promise<ToolResult<CommandResult>> {
    try {
      // Security check: only allow whitelisted commands
      if (!this.isCommandAllowed(command)) {
        return {
          success: false,
          error: `Command not allowed: ${command}. Allowed commands: ${this.allowedCommands.join(', ')}`
        };
      }

      // Execute the command
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.workspaceRoot,
        timeout: 60000, // 60 second timeout
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });

      return {
        success: true,
        data: {
          exitCode: 0,
          stdout: stdout.trim(),
          stderr: stderr.trim()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Command execution failed: ${error.message}`,
        data: {
          exitCode: error.code || 1,
          stdout: error.stdout?.trim() || '',
          stderr: error.stderr?.trim() || error.message
        }
      };
    }
  }

  /**
   * Check if a command is in the whitelist
   */
  private isCommandAllowed(command: string): boolean {
    const trimmedCommand = command.trim();
    
    // Check if the command starts with any allowed command
    return this.allowedCommands.some(allowed => {
      // Exact match or command with arguments
      return trimmedCommand === allowed || 
             trimmedCommand.startsWith(allowed + ' ');
    });
  }

  /**
   * Show output in VS Code terminal
   */
  async showInTerminal(command: string, output: string): Promise<void> {
    const terminal = vscode.window.createTerminal('Ollama Copilot');
    terminal.show();
    terminal.sendText(`# Command: ${command}`);
    terminal.sendText(`# Output:\n${output}`);
  }

  /**
   * Run tests (convenience method)
   */
  async runTests(): Promise<ToolResult<CommandResult>> {
    // Try different test commands
    const testCommands = [
      'npm test',
      'pnpm test',
      'pytest',
      'npm run test'
    ];

    for (const cmd of testCommands) {
      if (this.isCommandAllowed(cmd)) {
        return await this.runCommand(cmd);
      }
    }

    return {
      success: false,
      error: 'No allowed test command found'
    };
  }

  /**
   * Run build (convenience method)
   */
  async runBuild(): Promise<ToolResult<CommandResult>> {
    const buildCommands = ['npm run build', 'pnpm build'];

    for (const cmd of buildCommands) {
      if (this.isCommandAllowed(cmd)) {
        return await this.runCommand(cmd);
      }
    }

    return {
      success: false,
      error: 'No allowed build command found'
    };
  }

  /**
   * Update allowed commands
   */
  setAllowedCommands(commands: string[]): void {
    this.allowedCommands = commands;
  }
}
