export function parsePrice(text: string): number {
  const cleaned = text.replace(/[^\d.]/g, '');
  const n = Number.parseFloat(cleaned);
  if (Number.isNaN(n)) {
    throw new Error(`Unparseable price: ${JSON.stringify(text)}`);
  }
  return n;
}
