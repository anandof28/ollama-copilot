/**
 * Ollama API client with streaming and non-streaming support
 */

import * as http from 'http';
import * as https from 'https';
import { OllamaChatRequest, OllamaChatResponse, OllamaMessage } from '../protocol/types';

export class OllamaClient {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string = 'http://localhost:11434', model: string = 'qwen2.5-coder:7b') {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  /**
   * Non-streaming chat completion
   */
  async chat(messages: OllamaMessage[], options?: any): Promise<string> {
    const request: OllamaChatRequest = {
      model: this.model,
      messages,
      stream: false,
      options
    };

    try {
      const response = await this.makeRequest('/api/chat', request);
      const data = JSON.parse(response) as OllamaChatResponse;
      return data.message.content;
    } catch (error) {
      throw new Error(`Ollama chat error: ${error}`);
    }
  }

  /**
   * Streaming chat completion
   */
  async chatStream(
    messages: OllamaMessage[],
    onChunk: (chunk: string) => void,
    options?: any
  ): Promise<string> {
    const request: OllamaChatRequest = {
      model: this.model,
      messages,
      stream: true,
      options
    };

    let fullResponse = '';

    try {
      await this.makeStreamingRequest('/api/chat', request, (line: string) => {
        try {
          const data = JSON.parse(line) as OllamaChatResponse;
          if (data.message?.content) {
            fullResponse += data.message.content;
            onChunk(data.message.content);
          }
        } catch (err) {
          // Skip invalid JSON lines
        }
      });

      return fullResponse;
    } catch (error) {
      throw new Error(`Ollama streaming error: ${error}`);
    }
  }

  /**
   * Make a non-streaming HTTP request
   */
  private makeRequest(endpoint: string, data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.baseUrl);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
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

      req.write(JSON.stringify(data));
      req.end();
    });
  }

  /**
   * Make a streaming HTTP request
   */
  private makeStreamingRequest(
    endpoint: string,
    data: any,
    onLine: (line: string) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.baseUrl);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = client.request(options, (res: any) => {
        let buffer = '';

        res.on('data', (chunk: any) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim()) {
              onLine(line);
            }
          }
        });

        res.on('end', () => {
          if (buffer.trim()) {
            onLine(buffer);
          }

          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error: any) => {
        reject(error);
      });

      req.write(JSON.stringify(data));
      req.end();
    });
  }

  /**
   * Update the model
   */
  setModel(model: string): void {
    this.model = model;
  }

  /**
   * Update the base URL
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
}
