export function createColumnMap(headerRow: any[]): Record<string, number> {
  const map: Record<string, number> = {};

  headerRow.forEach((value, index) => {
    if (!value) return;

    const key = String(value).trim();
    map[key] = index;
  });

  return map;
}