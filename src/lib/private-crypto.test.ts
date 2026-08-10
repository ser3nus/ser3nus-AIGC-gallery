// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  bytesToBase64, base64ToBytes, generateSalt, deriveKey, encryptBytes, decryptBytes,
} from './private-crypto'

describe('private-crypto', () => {
  it('base64 round-trips any bytes', () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 255, 128])
    expect(base64ToBytes(bytesToBase64(bytes))).toEqual(bytes)
  })

  it('encrypts and decrypts a message with the same key', async () => {
    const salt = generateSalt()
    const key = await deriveKey('P@ssw0rd!9', salt, 1000)
    const data = new TextEncoder().encode('secret image bytes')
    const { iv, ciphertext } = await encryptBytes(key, data)
    const plain = await decryptBytes(key, iv, ciphertext)
    expect(new TextDecoder().decode(plain)).toBe('secret image bytes')
  })

  it('rejects decryption with a wrong password (auth tag mismatch)', async () => {
    const salt = generateSalt()
    const key = await deriveKey('correct-pass', salt, 1000)
    const wrongKey = await deriveKey('wrong-pass!!', salt, 1000)
    const { iv, ciphertext } = await encryptBytes(key, new TextEncoder().encode('x'))
    await expect(decryptBytes(wrongKey, iv, ciphertext)).rejects.toThrow()
  })

  it('generates unique salt each call', () => {
    expect(generateSalt()).not.toEqual(generateSalt())
  })
})
