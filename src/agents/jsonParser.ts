/**
 * Shared JSON parsing helpers for agent responses
 */

/**
 * Parse a JSON object from raw model output.
 * Handles markdown code fences and extra surrounding text.
 */
export function parseJsonObject<T>(text: string): T | null {
  try {
    const normalized = stripCodeFences(text).trim();
    const jsonObject = extractFirstJsonObject(normalized);
    if (!jsonObject) {
      return null;
    }
    return JSON.parse(jsonObject) as T;
  } catch (error) {
    console.error('JSON parse error:', error);
    return null;
  }
}

function stripCodeFences(text: string): string {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```\s*$/i, '');
}

function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf('{');
  if (start === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index++) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        return text.substring(start, index + 1);
      }
    }
  }

  return null;
}
