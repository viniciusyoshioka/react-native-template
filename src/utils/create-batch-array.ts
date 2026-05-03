export function createBatchArray<T = unknown>(
  array: T[],
  batchSize = 20,
): T[][] {
  const batchArray: T[][] = []

  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize)
    batchArray.push(batch)
  }

  return batchArray
}
