/**
 * Search tool for finding text in files
 */

import * as vscode from 'vscode';
import { ToolResult } from '../protocol/types';

export interface SearchMatch {
  file: string;
  line: number;
  content: string;
  preview: string;
}

export class SearchTool {
  /**
   * Search for text across the workspace
   */
  async searchText(query: string, maxResults: number = 100): Promise<ToolResult<SearchMatch[]>> {
    try {
      const searchResults: SearchMatch[] = [];
      
      // Use VS Code's search API
      const files = await vscode.workspace.findFiles(
        '**/*.{ts,js,tsx,jsx,json,md,txt}',
        '**/node_modules/**,**/out/**,**/dist/**'
      );

      for (const file of files) {
        try {
          const document = await vscode.workspace.openTextDocument(file);
          const text = document.getText();
          const lines = text.split('\n');

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.toLowerCase().includes(query.toLowerCase())) {
              const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
              const relativePath = workspaceFolder 
                ? vscode.workspace.asRelativePath(file)
                : file.fsPath;

              searchResults.push({
                file: relativePath,
                line: i + 1,
                content: line.trim(),
                preview: this.getPreview(lines, i)
              });

              if (searchResults.length >= maxResults) {
                break;
              }
            }
          }

          if (searchResults.length >= maxResults) {
            break;
          }
        } catch (err) {
          // Skip files that can't be read
          continue;
        }
      }

      return {
        success: true,
        data: searchResults
      };
    } catch (error) {
      return {
        success: false,
        error: `Search failed: ${error}`
      };
    }
  }

  /**
   * Search for files by name pattern
   */
  async searchFiles(pattern: string): Promise<ToolResult<string[]>> {
    try {
      const files = await vscode.workspace.findFiles(
        `**/*${pattern}*`,
        '**/node_modules/**,**/out/**,**/dist/**'
      );

      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      const relativePaths = files.map((file: vscode.Uri) =>
        workspaceFolder ? vscode.workspace.asRelativePath(file) : file.fsPath
      );

      return {
        success: true,
        data: relativePaths
      };
    } catch (error) {
      return {
        success: false,
        error: `File search failed: ${error}`
      };
    }
  }

  /**
   * Get preview with context lines
   */
  private getPreview(lines: string[], index: number, contextLines: number = 2): string {
    const start = Math.max(0, index - contextLines);
    const end = Math.min(lines.length, index + contextLines + 1);
    
    const preview: string[] = [];
    for (let i = start; i < end; i++) {
      const marker = i === index ? '> ' : '  ';
      preview.push(`${marker}${i + 1}: ${lines[i]}`);
    }
    
    return preview.join('\n');
  }

  /**
   * Find symbol definitions (simple regex-based)
   */
  async findDefinitions(symbolName: string): Promise<ToolResult<SearchMatch[]>> {
    try {
      // Look for common definition patterns
      const patterns = [
        `function ${symbolName}`,
        `class ${symbolName}`,
        `const ${symbolName}`,
        `let ${symbolName}`,
        `var ${symbolName}`,
        `interface ${symbolName}`,
        `type ${symbolName}`,
        `export.*${symbolName}`
      ];

      const allResults: SearchMatch[] = [];

      for (const pattern of patterns) {
        const result = await this.searchText(pattern, 20);
        if (result.success && result.data) {
          allResults.push(...result.data);
        }
      }

      // Remove duplicates
      const unique = Array.from(
        new Map(allResults.map(r => [`${r.file}:${r.line}`, r])).values()
      );

      return {
        success: true,
        data: unique
      };
    } catch (error) {
      return {
        success: false,
        error: `Definition search failed: ${error}`
      };
    }
  }
}
