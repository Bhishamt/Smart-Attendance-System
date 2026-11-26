
// Config loader
export function loadConfig(): Record<string, string> {
  return { ...process.env };
}
