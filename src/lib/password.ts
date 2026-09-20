import crypto from 'crypto';

/**
 * Hash a password using scrypt with a random 16-byte salt
 * Format returned: "scrypt:<salt_hex>:<hash_hex>"
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify a password against a stored hash (or legacy plaintext password).
 * Uses timingSafeEqual to protect against timing attacks.
 */
export function verifyPassword(password: string, storedHashOrPlain: string): boolean {
  if (!password || !storedHashOrPlain) return false;

  // Hashed format: "scrypt:<salt>:<hash>"
  if (storedHashOrPlain.startsWith('scrypt:')) {
    const parts = storedHashOrPlain.split(':');
    if (parts.length !== 3) return false;
    const [, salt, originalHash] = parts;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const originalBuffer = Buffer.from(originalHash, 'hex');
    if (derivedKey.length !== originalBuffer.length) return false;
    return crypto.timingSafeEqual(derivedKey, originalBuffer);
  }

  // Legacy plaintext fallback with timing-safe comparison
  const inputBuffer = Buffer.from(password);
  const storedBuffer = Buffer.from(storedHashOrPlain);
  if (inputBuffer.length !== storedBuffer.length) return false;
  return crypto.timingSafeEqual(inputBuffer, storedBuffer);
}

/**
 * Evaluates password strength: minimum 8 characters, with letters and numbers
 */
export function validatePasswordStrength(password: string): { valid: boolean; reason?: string } {
  if (!password || password.length < 8) {
    return { valid: false, reason: 'Password must be at least 8 characters long.' };
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return { valid: false, reason: 'Password must contain both letters and numbers.' };
  }
  return { valid: true };
}
