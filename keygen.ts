import { randomBytes } from 'crypto';
import { x25519 } from '@noble/curves/ed25519';

/**
 * WireGuard key pair interface
 */
export interface WireGuardKeyPair {
  privateKey: string;
  publicKey: string;
}

/**
 * Generate a WireGuard private key
 * @returns Base64 encoded private key (32 bytes)
 */
export function generatePrivateKey(): string {
  // Generate 32 random bytes for the private key
  const privateKeyBytes = randomBytes(32);
  
  // Encode as base64 string
  return privateKeyBytes.toString('base64');
}

/**
 * Derive a WireGuard public key from a private key
 * Uses Curve25519 elliptic curve cryptography
 * @param privateKeyStr Base64 encoded private key
 * @returns Base64 encoded public key
 */
export function derivePublicKey(privateKeyStr: string): string {
  // 1. Decode the base64 private key
  const privateKeyBytes = Buffer.from(privateKeyStr, 'base64');
  
  // 2. Validate length (must be exactly 32 bytes)
  if (privateKeyBytes.length !== 32) {
    throw new Error('Private key must be 32 bytes long');
  }
  
  // 3. Derive public key using Curve25519
  // This is equivalent to: curve25519.X25519(privateKey, curve25519.Basepoint)
  const publicKeyBytes = x25519.getPublicKey(privateKeyBytes);
  
  // 4. Encode as base64 string
  return Buffer.from(publicKeyBytes).toString('base64');
}

/**
 * Validate a WireGuard public key
 * @param publicKey Base64 encoded public key to validate
 * @returns true if valid, false otherwise
 */
export function validatePublicKey(publicKey: string): boolean {
  // WireGuard public keys must be exactly 44 characters (32 bytes base64 encoded)
  if (publicKey.length !== 44) {
    return false;
  }
  
  // Must be valid base64
  try {
    const decoded = Buffer.from(publicKey, 'base64');
    return decoded.length === 32;
  } catch {
    return false;
  }
}

/**
 * Generate a complete WireGuard key pair
 * Uses proper Curve25519 cryptography for WireGuard compatibility
 * @returns Object containing base64 encoded private and public keys
 */
export function generateWireguardKeyPair(): WireGuardKeyPair {
  const privateKey = generatePrivateKey();
  const publicKey = derivePublicKey(privateKey);
  
  return {
    privateKey,
    publicKey
  };
}

