/**
 * AIRO Core Security & VAPT Hardening Utilities
 * Defends against XSS, Prototype Pollution, and Parameter Tampering
 */

/**
 * Strips dangerous prototype pollution keys (__proto__, constructor, prototype)
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) return obj;

  const clean: any = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue; // Block prototype pollution injection
    }
    clean[key] = typeof value === 'object' && value !== null ? sanitizeObject(value) : value;
  }

  return clean;
}

/**
 * Escapes HTML characters in untrusted user strings to prevent XSS
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes input phone numbers to prevent script / command injection
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') return '';
  return phone.replace(/[^0-9+]/g, '').slice(0, 16);
}

/**
 * Sanitizes alphanumeric identifiers
 */
export function sanitizeIdentifier(id: string): string {
  if (typeof id !== 'string') return '';
  return id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
}
