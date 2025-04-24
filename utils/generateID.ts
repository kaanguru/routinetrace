/**
 * Generates a unique ID string combining a timestamp and a random part.
 * The ID format is "timestamp_base36-random_base62".
 * This is suitable for generating unique identifiers within the application session,
 * but not guaranteed to be globally unique across different systems or cryptographically secure.
 *
 * @returns {string} A unique ID string.
 */
export default function generateID(): string {
  const BASE62_CHARS =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const RANDOM_PART_LENGTH = 3;

  const timestampPart = Date.now().toString(36);

  const randomPart = Array.from(
    { length: RANDOM_PART_LENGTH },
    () => BASE62_CHARS[Math.floor(Math.random() * BASE62_CHARS.length)]
  ).join("");

  return `${timestampPart}-${randomPart}`;
}
