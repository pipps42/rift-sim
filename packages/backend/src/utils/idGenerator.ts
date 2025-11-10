/**
 * Simple ID generator to replace UUID for now
 */

let counter = 0;

export function generateId(): string {
  return `riftbound-${Date.now()}-${++counter}`;
}

export function generateUuid(): string {
  return generateId();
}

// For compatibility
export const v4 = generateId;