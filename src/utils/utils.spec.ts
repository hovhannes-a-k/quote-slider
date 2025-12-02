import { filterUniqueBy } from './utils'; // adjust path as needed

type TestObject = { id: number, name: string };

describe('filterUniqueBy', () => {

  it('should return only items whose key does not exist in existing array', () => {
    const existing = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];

    const incoming = [
      { id: 2, name: 'B' }, // duplicate
      { id: 3, name: 'C' }, // new
      { id: 4, name: 'D' }, // new
    ];

    const result = filterUniqueBy(existing, incoming, 'id');

    expect(result).toEqual([
      { id: 3, name: 'C' },
      { id: 4, name: 'D' },
    ]);
  });

  it('should prevent duplicates inside incoming itself', () => {
    const existing: TestObject[] = [];

    const incoming = [
      { id: 1, name: 'A' },
      { id: 1, name: 'A' }, // duplicate inside incoming
      { id: 2, name: 'B' },
    ];

    const result = filterUniqueBy(existing, incoming, 'id');

    expect(result).toEqual([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]);
  });

  it('should return an empty array if all incoming items already exist', () => {
    const existing = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];

    const incoming = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];

    const result = filterUniqueBy(existing, incoming, 'id');

    expect(result).toEqual([]);
  });
});
