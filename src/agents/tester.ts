/**
 * Tester Agent - Runs tests and generates fixes
 */

import { OllamaClient } from '../ollama/client';
import { TestFix, OllamaMessage, FileContext, Patch } from '../protocol/types';
import { TESTER_SYSTEM_PROMPT, buildTesterPrompt } from '../protocol/prompts';
import { TerminalTool } from '../tools/terminal';
import { WorkspaceTool } from '../tools/workspace';

export class TesterAgent {
  private ollama: OllamaClient;
  private terminal: TerminalTool;
  private workspace: WorkspaceTool;

  constructor(ollama: OllamaClient, terminal: TerminalTool, workspace: WorkspaceTool) {
    this.ollama = ollama;
    this.terminal = terminal;
    this.workspace = workspace;
  }

  /**
   * Run tests and analyze failures
   */
  async runTestsAndAnalyze(
    onProgress?: (message: string) => void
  ): Promise<{ success: boolean; output: string; fix?: TestFix }> {
    try {
      // Run tests
      onProgress?.('Running tests...');
      const testResult = await this.terminal.runTests();

      if (!testResult.data) {
        return {
          success: false,
          output: testResult.error || 'Test execution failed'
        };
      }

      const { exitCode, stdout, stderr } = testResult.data;
      const output = `${stdout}\n${stderr}`.trim();

      // If tests passed, we're done
      if (exitCode === 0) {
        onProgress?.('All tests passed!');
        return {
          success: true,
          output
        };
      }

      // Tests failed - analyze and generate fix
      onProgress?.('Tests failed. Analyzing failures...');
      const fix = await this.generateFix(output, onProgress);

      return {
        success: false,
        output,
        fix
      };

    } catch (error) {
      return {
        success: false,
        output: `Test execution error: ${error}`
      };
    }
  }

  /**
   * Generate a fix for test failures
   */
  async generateFix(
    testOutput: string,
    onProgress?: (message: string) => void
  ): Promise<TestFix> {
    try {
      // Extract file names from error output
      const affectedFiles = this.extractAffectedFiles(testOutput);

      // Gather context
      onProgress?.('Gathering context for fix...');
      const context: FileContext[] = [];
      
      for (const filePath of affectedFiles.slice(0, 5)) {
        const result = await this.workspace.readFile(filePath);
        if (result.success && result.data) {
          context.push({
            path: filePath,
            content: result.data
          });
        }
      }

      // Build prompt
      const userPrompt = buildTesterPrompt(testOutput, context);

      // Call Ollama
      const messages: OllamaMessage[] = [
        { role: 'system', content: TESTER_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ];

      onProgress?.('Generating fix...');

      let response = await this.ollama.chat(messages, {
        temperature: 0.1,
        num_predict: 3000
      });

      // Parse JSON
      let fix = this.parseJSON<TestFix>(response);

      if (!fix) {
        onProgress?.('Retrying JSON parsing...');
        
        messages.push({ role: 'assistant', content: response });
        messages.push({ 
          role: 'user', 
          content: 'The JSON is invalid. Please output ONLY valid JSON.' 
        });

        response = await this.ollama.chat(messages);
        fix = this.parseJSON<TestFix>(response);
      }

      if (!fix) {
        throw new Error('Failed to get valid fix from tester');
      }

      onProgress?.('Fix generated!');
      return fix;

    } catch (error) {
      throw new Error(`Fix generation failed: ${error}`);
    }
  }

  /**
   * Extract affected file paths from error output
   */
  private extractAffectedFiles(output: string): string[] {
    const files = new Set<string>();
    
    // Common patterns for file paths in error messages
    const patterns = [
      /at\s+.*?\(([^)]+\.(?:ts|js|tsx|jsx)):(\d+):\d+\)/g,
      /([^/\s]+\.(?:ts|js|tsx|jsx)):(\d+):\d+/g,
      /Error in ([^/\s]+\.(?:ts|js|tsx|jsx))/g
    ];

    for (const pattern of patterns) {
      const matches = output.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          files.add(match[1]);
        }
      }
    }

    return Array.from(files);
  }

  /**
   * Parse JSON from response
   */
  private parseJSON<T>(text: string): T | null {
    try {
      let cleaned = text.trim();
      
      // Remove markdown code blocks
      cleaned = cleaned.replace(/^```json\s*/i, '');
      cleaned = cleaned.replace(/^```\s*/, '');
      cleaned = cleaned.replace(/\s*```$/, '');
      
      // Find JSON object
      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
      }

      return JSON.parse(cleaned) as T;
    } catch (error) {
      console.error('JSON parse error:', error);
      return null;
    }
  }
}
