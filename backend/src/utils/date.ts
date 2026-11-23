
// Backend utility for date formatting
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
