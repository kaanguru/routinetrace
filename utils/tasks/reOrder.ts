import * as R from 'ramda';

/**
 * Reorders an array by moving an item from one index to another.
 * @param from - The index of the item to move.
 * @param to - The index where the item should be moved to.
 * @param array - The array to reorder.
 * @returns A new array with the item moved to the new position.
 */
function reOrder<T>(from: number, to: number, array: T[]): T[] {
  console.log('Send from: ' + from + ' to: ' + to);
  if (array.length === 0) {
    console.error('Array is empty');
    return array;
  }
  if (from < 0 || from >= array.length || to < 0) {
    console.error('Invalid from or to index: ' + from + ' ' + to);
    return array; // Return the original array if indices are invalid
  }

  const newArrayWithoutItem = R.remove(from, 1, array);
  const item = array[from];
  const newArrayWithElementAtNewPosition = R.insert(to, item, newArrayWithoutItem);

  return newArrayWithElementAtNewPosition;
}

export default reOrder;
