let counter = 0;

export function v4(): string {
  return `mock-uuid-${Date.now()}-${counter++}`;
}

export default { v4 };
