/**
 * Planner Agent - Creates implementation plans
 */

import { OllamaClient } from '../ollama/client';
import { PlannerOutput, OllamaMessage } from '../protocol/types';
import { PLANNER_SYSTEM_PROMPT, buildPlannerPrompt } from '../protocol/prompts';
import { WorkspaceTool } from '../tools/workspace';
import { parseJsonObject } from './jsonParser';

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
      let plan = parseJsonObject<PlannerOutput>(response);
      
      if (!plan) {
        onProgress?.('Retrying JSON parsing...');
        
        // Retry with explicit instruction to fix JSON
        messages.push({ role: 'assistant', content: response });
        messages.push({ 
          role: 'user', 
          content: 'The JSON is invalid. Please output ONLY valid JSON with no markdown or extra text.' 
        });

        response = await this.ollama.chat(messages);
        plan = parseJsonObject<PlannerOutput>(response);
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
