/**
 * Planner Agent - Creates implementation plans
 */

import { OllamaClient } from '../ollama/client';
import { PlannerOutput, OllamaMessage } from '../protocol/types';
import { PLANNER_SYSTEM_PROMPT, buildPlannerPrompt } from '../protocol/prompts';
import { WorkspaceTool } from '../tools/workspace';

export class PlannerAgent {
  private ollama: OllamaClient;
  private workspace: WorkspaceTool;

  constructor(ollama: OllamaClient, workspace: WorkspaceTool) {
    this.ollama = ollama;
    this.workspace = workspace;
  }

  /**
   * Create a plan for implementing a feature
   */
  async plan(
    userRequest: string,
    onProgress?: (message: string) => void
  ): Promise<PlannerOutput> {
    try {
      // Get workspace context
      onProgress?.('Analyzing workspace...');
      const structureResult = await this.workspace.getWorkspaceStructure();
      const workspaceInfo = structureResult.data || 'Unable to read workspace';

      // Build the prompt
      const userPrompt = buildPlannerPrompt(userRequest, workspaceInfo);

      // Call Ollama
      const messages: OllamaMessage[] = [
        { role: 'system', content: PLANNER_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ];

      onProgress?.('Creating implementation plan...');
      
      let response = await this.ollama.chat(messages, {
        temperature: 0.2,
        num_predict: 2000
      });

      // Parse JSON response (with retry logic)
      let plan = this.parseJSON<PlannerOutput>(response);
      
      if (!plan) {
        onProgress?.('Retrying JSON parsing...');
        
        // Retry with explicit instruction to fix JSON
        messages.push({ role: 'assistant', content: response });
        messages.push({ 
          role: 'user', 
          content: 'The JSON is invalid. Please output ONLY valid JSON with no markdown or extra text.' 
        });

        response = await this.ollama.chat(messages);
        plan = this.parseJSON<PlannerOutput>(response);
      }

      if (!plan) {
        throw new Error('Failed to get valid JSON response from planner');
      }

      // Validate the plan structure
      if (!this.isValidPlan(plan)) {
        throw new Error('Invalid plan structure');
      }

      onProgress?.('Plan created successfully!');
      return plan;

    } catch (error) {
      throw new Error(`Planning failed: ${error}`);
    }
  }

  /**
   * Parse JSON from response, handling markdown code blocks
   */
  private parseJSON<T>(text: string): T | null {
    try {
      // Remove markdown code blocks if present
      let cleaned = text.trim();
      
      // Remove ```json and ``` markers
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

  /**
   * Validate plan structure
   */
  private isValidPlan(plan: any): plan is PlannerOutput {
    return (
      typeof plan === 'object' &&
      typeof plan.feature === 'string' &&
      Array.isArray(plan.assumptions) &&
      Array.isArray(plan.files_to_read) &&
      Array.isArray(plan.search_queries) &&
      Array.isArray(plan.steps)
    );
  }
}
