/** Base64 helpers usable in both Node (script) and browsers. btoa/atob are
 *  global in Node 20+ and all modern browsers. */

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

export function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16))
}

const enc = new TextEncoder()

/** Derive an AES-GCM key from a password via PBKDF2-SHA256. */
export async function deriveKey(password: string, salt: Uint8Array, iterations = 1000000): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as Uint8Array<ArrayBuffer>, iterations, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

/** AES-256-GCM encrypt. Returns random 12-byte IV + ciphertext (tag appended). */
export async function encryptBytes(key: CryptoKey, data: Uint8Array): Promise<{ iv: Uint8Array; ciphertext: Uint8Array }> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as Uint8Array<ArrayBuffer> }, key, data as Uint8Array<ArrayBuffer>))
  return { iv, ciphertext }
}

/** AES-256-GCM decrypt. Rejects if authentication fails (wrong key/IV). */
export async function decryptBytes(key: CryptoKey, iv: Uint8Array, ciphertext: Uint8Array): Promise<Uint8Array> {
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as Uint8Array<ArrayBuffer> }, key, ciphertext as Uint8Array<ArrayBuffer>)
  return new Uint8Array(plaintext)
}
