/**
 * Ollama Model Selector
 * Handles model detection, selection, and status bar UI
 */

import * as vscode from 'vscode';
import * as http from 'http';
import * as https from 'https';

interface OllamaModel {
  name: string;
  modified_at?: string;
  size?: number;
  digest?: string;
}

interface OllamaTagsResponse {
  models: OllamaModel[];
}

export class ModelSelector {
  private statusBarItem: vscode.StatusBarItem;
  private baseUrl: string;

  constructor() {
    this.baseUrl = this.getBaseUrl();
    
    // Create status bar item
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = 'ollama-copilot.selectModel';
    this.statusBarItem.tooltip = 'Click to change Ollama model';
    this.updateStatusBar();
    this.statusBarItem.show();
  }

  /**
   * Get base URL from configuration
   */
  private getBaseUrl(): string {
    const config = vscode.workspace.getConfiguration('ollamaCopilot');
    return config.get<string>('apiUrl') || 'http://localhost:11434';
  }

  /**
   * Get current model from configuration
   */
  public getCurrentModel(): string {
    const config = vscode.workspace.getConfiguration('ollamaCopilot');
    return config.get<string>('model') || 'qwen2.5-coder:7b';
  }

  /**
   * Update status bar to show current model
   */
  public updateStatusBar(): void {
    const currentModel = this.getCurrentModel();
    this.statusBarItem.text = `🤖 ${currentModel}`;
  }

  /**
   * Fetch available models from Ollama
   */
  async fetchModels(): Promise<OllamaModel[]> {
    try {
      const response = await this.makeRequest('/api/tags');
      const data: OllamaTagsResponse = JSON.parse(response);
      return data.models || [];
    } catch (error) {
      throw new Error(`Failed to fetch models: ${error}`);
    }
  }

  /**
   * Show model selection QuickPick
   */
  async selectModel(): Promise<void> {
    try {
      // Update base URL in case it changed
      this.baseUrl = this.getBaseUrl();

      // Show loading message
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Loading Ollama models...',
          cancellable: false
        },
        async () => {
          try {
            // Fetch available models
            const models = await this.fetchModels();

            if (models.length === 0) {
              const result = await vscode.window.showWarningMessage(
                'No Ollama models found. Would you like to pull a model?',
                'Open Terminal',
                'Cancel'
              );

              if (result === 'Open Terminal') {
                const terminal = vscode.window.createTerminal('Ollama');
                terminal.show();
                terminal.sendText('# Pull a model with:');
                terminal.sendText('# ollama pull qwen2.5-coder:7b');
              }
              return;
            }

            // Create QuickPick items
            const currentModel = this.getCurrentModel();
            const items: vscode.QuickPickItem[] = models.map(model => ({
              label: model.name,
              description: model.name === currentModel ? '$(check) Current' : '',
              detail: this.formatModelDetails(model)
            }));

            // Add option to enter custom model
            items.push({
              label: '$(edit) Enter custom model name',
              description: '',
              detail: 'Manually specify a model name'
            });

            // Show QuickPick
            const selected = await vscode.window.showQuickPick(items, {
              placeHolder: `Current model: ${currentModel}`,
              title: 'Select Ollama Model',
              matchOnDescription: true,
              matchOnDetail: true
            });

            if (selected) {
              if (selected.label.includes('Enter custom model')) {
                await this.enterCustomModel();
              } else {
                await this.setModel(selected.label);
              }
            }
          } catch (error) {
            // Handle Ollama not running
            const errorMsg = String(error);
            if (errorMsg.includes('ECONNREFUSED') || errorMsg.includes('fetch')) {
              const result = await vscode.window.showErrorMessage(
                'Ollama is not running. Please start Ollama first.',
                'Open Documentation',
                'Cancel'
              );

              if (result === 'Open Documentation') {
                vscode.env.openExternal(vscode.Uri.parse('https://ollama.ai'));
              }
            } else {
              vscode.window.showErrorMessage(`Failed to load models: ${error}`);
            }
          }
        }
      );
    } catch (error) {
      vscode.window.showErrorMessage(`Model selection failed: ${error}`);
    }
  }

  /**
   * Allow user to enter a custom model name
   */
  private async enterCustomModel(): Promise<void> {
    const modelName = await vscode.window.showInputBox({
      prompt: 'Enter Ollama model name',
      placeHolder: 'e.g., qwen2.5-coder:7b',
      value: this.getCurrentModel(),
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Model name cannot be empty';
        }
        if (!value.includes(':')) {
          return 'Model name should include tag (e.g., model:tag)';
        }
        return null;
      }
    });

    if (modelName) {
      await this.setModel(modelName.trim());
    }
  }

  /**
   * Set the selected model in configuration
   */
  private async setModel(modelName: string): Promise<void> {
    try {
      const config = vscode.workspace.getConfiguration('ollamaCopilot');
      await config.update('model', modelName, vscode.ConfigurationTarget.Global);
      
      this.updateStatusBar();
      
      vscode.window.showInformationMessage(
        `✓ Ollama model set to: ${modelName}`
      );
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to save model: ${error}`);
    }
  }

  /**
   * Format model details for display
   */
  private formatModelDetails(model: OllamaModel): string {
    const details: string[] = [];
    
    if (model.size) {
      const sizeMB = (model.size / (1024 * 1024)).toFixed(0);
      const sizeGB = (model.size / (1024 * 1024 * 1024)).toFixed(2);
      details.push(sizeGB + ' GB');
    }
    
    if (model.modified_at) {
      const date = new Date(model.modified_at);
      details.push(`Modified: ${date.toLocaleDateString()}`);
    }
    
    return details.join(' • ');
  }

  /**
   * Make HTTP request to Ollama API
   */
  private makeRequest(endpoint: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.baseUrl);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname,
        method: 'GET',
        timeout: 5000
      };

      const req = client.request(options, (res: any) => {
        let body = '';

        res.on('data', (chunk: any) => {
          body += chunk;
        });

        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', (error: any) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  /**
   * Test connection to Ollama
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/api/version');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Refresh models and show notification
   */
  async refreshModels(): Promise<void> {
    try {
      const models = await this.fetchModels();
      vscode.window.showInformationMessage(
        `Found ${models.length} Ollama model${models.length !== 1 ? 's' : ''}`
      );
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to refresh models: ${error}`);
    }
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.statusBarItem.dispose();
  }
}
