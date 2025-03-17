export default function shortenText(notes: string) {
  return notes.slice(0, 40) + (notes.length > 38 ? '...' : '');
}
