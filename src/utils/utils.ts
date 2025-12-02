export function filterUniqueBy<T extends object>(
  existing: T[],
  incoming: T[],
  key: keyof T
): T[] {
  const seen = new Set(existing.map(e => e[key]));
  const result: T[] = [];

  for (const item of incoming) {
    const prop = item[key];
    if (!seen.has(prop)) {
      seen.add(prop); // prevents duplicates inside incoming
      result.push(item);
    }
  }

  return result;
}
