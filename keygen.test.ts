import { strict as assert } from 'assert';
import { generateWireguardKeyPair, derivePublicKey, validatePublicKey } from './keygen';

/**
 * Test function for WireGuard key pair generation
 */
function testKeyPairGeneration(): void {
  console.log('Testing WireGuard key pair generation...');

  // Test 1: Function returns an object with the expected properties
  const keyPair = generateWireguardKeyPair();
  assert(typeof keyPair === 'object', 'Key pair should be an object');
  assert('privateKey' in keyPair, 'Key pair should have privateKey property');
  assert('publicKey' in keyPair, 'Key pair should have publicKey property');
  console.log('✓ Key pair has expected properties');
  
  // Show example output
  console.log('\nExample generated key pair:');
  console.log(`Private Key: ${keyPair.privateKey}`);
  console.log(`Public Key:  ${keyPair.publicKey}`);

  // Test 2: Keys are strings
  assert(typeof keyPair.privateKey === 'string', 'Private key should be a string');
  assert(typeof keyPair.publicKey === 'string', 'Public key should be a string');
  console.log('✓ Keys are strings');

  // Test 3: Keys are base64 format (should only contain valid base64 characters)
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  assert(base64Regex.test(keyPair.privateKey), 'Private key should be valid base64');
  assert(base64Regex.test(keyPair.publicKey), 'Public key should be valid base64');
  console.log('✓ Keys are valid base64 format');

  // Test 4: Keys have expected length (32 bytes = 44 characters in base64)
  assert(keyPair.privateKey.length === 44, 'Private key should be 44 characters (32 bytes in base64)');
  assert(keyPair.publicKey.length === 44, 'Public key should be 44 characters (32 bytes in base64)');
  console.log('✓ Keys have correct length');

  // Test 5: Keys are different from each other
  assert(keyPair.privateKey !== keyPair.publicKey, 'Private and public keys should be different');
  console.log('✓ Private and public keys are different');

  // Test 6: Multiple calls generate different key pairs
  const keyPair2 = generateWireguardKeyPair();
  assert(keyPair.privateKey !== keyPair2.privateKey, 'Different calls should generate different private keys');
  assert(keyPair.publicKey !== keyPair2.publicKey, 'Different calls should generate different public keys');
  console.log('✓ Multiple calls generate unique key pairs');

  // Test 7: Same private key always generates same public key (deterministic)
  const testPrivateKey = keyPair.privateKey;
  const publicKey1 = derivePublicKey(testPrivateKey);
  const publicKey2 = derivePublicKey(testPrivateKey);
  assert(publicKey1 === publicKey2, 'Same private key should always generate same public key');
  assert(publicKey1 === keyPair.publicKey, 'Derived public key should match original');
  console.log('✓ Same private key always generates same public key (deterministic)');

  // Test 8: Public key validation
  assert(validatePublicKey(keyPair.publicKey), 'Generated public key should be valid');
  assert(validatePublicKey(keyPair2.publicKey), 'Second generated public key should be valid');
  assert(!validatePublicKey('invalid'), 'Invalid key should fail validation');
  assert(!validatePublicKey(''), 'Empty key should fail validation');
  console.log('✓ Public key validation works correctly');

  // Important cryptographic principle explanation
  console.log('\n📝 Cryptographic Key Pair Properties:');
  console.log('• The SAME private key always generates the SAME public key (deterministic)');
  console.log('• Each call to generateWireguardKeyPair() creates a NEW random private key');
  console.log('• That\'s why we get different key pairs each time');
  console.log('• Uses proper Curve25519 elliptic curve cryptography (@noble/curves)');

  console.log('\nAll tests passed! ✨');
}

// Run the tests
testKeyPairGeneration();
