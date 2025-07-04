# WireGuard KeyGen

A TypeScript library for generating WireGuard key pairs using proper Curve25519 cryptography.

## Features

- ✅ **Secure**: Uses the industry-standard `@noble/curves` library for Curve25519 cryptography
- ✅ **Compatible**: Generates keys compatible with official WireGuard implementations
- ✅ **TypeScript**: Full TypeScript support with type definitions
- ✅ **Deterministic**: Same private key always generates the same public key
- ✅ **Validated**: Comprehensive test suite ensuring cryptographic correctness

## Installation

```bash
npm install wireguard-keygen
```

## Quick Start

```typescript
import { generateWireguardKeyPair } from 'wireguard-keygen';

// Generate a new key pair
const keyPair = generateWireguardKeyPair();
console.log('Private Key:', keyPair.privateKey);
console.log('Public Key:', keyPair.publicKey);
```

## API Reference

### `generateWireguardKeyPair(): WireGuardKeyPair`

Generates a complete WireGuard key pair with a random private key.

**Returns:** Object with `privateKey` and `publicKey` properties (both base64 encoded)

```typescript
const keyPair = generateWireguardKeyPair();
// {
//   privateKey: "nPse/4zbQGxOqAM14icWRru4I6g9s9xdhg9sCY2l3ck=",
//   publicKey: "Y3AdHf4MAZi3xgCFxiDfyPBNbBQKuTqTCoDI/XHrnQg="
// }
```

### `generatePrivateKey(): string`

Generates a random WireGuard private key.

**Returns:** Base64 encoded private key (32 bytes)

```typescript
const privateKey = generatePrivateKey();
// "nPse/4zbQGxOqAM14icWRru4I6g9s9xdhg9sCY2l3ck="
```

### `derivePublicKey(privateKey: string): string`

Derives a WireGuard public key from a private key using Curve25519.

**Parameters:**
- `privateKey` - Base64 encoded private key

**Returns:** Base64 encoded public key

**Throws:** Error if private key is invalid

```typescript
const privateKey = "nPse/4zbQGxOqAM14icWRru4I6g9s9xdhg9sCY2l3ck=";
const publicKey = derivePublicKey(privateKey);
// "Y3AdHf4MAZi3xgCFxiDfyPBNbBQKuTqTCoDI/XHrnQg="

// Same private key always generates same public key
const publicKey2 = derivePublicKey(privateKey);
console.log(publicKey === publicKey2); // true
```

### `validatePublicKey(publicKey: string): boolean`

Validates a WireGuard public key format.

**Parameters:**
- `publicKey` - Base64 encoded public key to validate

**Returns:** `true` if valid, `false` otherwise

```typescript
const isValid = validatePublicKey("Y3AdHf4MAZi3xgCFxiDfyPBNbBQKuTqTCoDI/XHrnQg=");
console.log(isValid); // true

const isInvalid = validatePublicKey("invalid-key");
console.log(isInvalid); // false
```

### `WireGuardKeyPair` Interface

```typescript
interface WireGuardKeyPair {
  privateKey: string; // Base64 encoded private key (32 bytes)
  publicKey: string;  // Base64 encoded public key (32 bytes)
}
```

## Usage Examples

### Basic Key Generation

```typescript
import { generateWireguardKeyPair } from 'wireguard-keygen';

const keyPair = generateWireguardKeyPair();
console.log(`Private: ${keyPair.privateKey}`);
console.log(`Public: ${keyPair.publicKey}`);
```

### Key Derivation

```typescript
import { generatePrivateKey, derivePublicKey } from 'wireguard-keygen';

// Generate private key
const privateKey = generatePrivateKey();

// Derive public key (deterministic)
const publicKey = derivePublicKey(privateKey);

console.log('Key pair:', { privateKey, publicKey });
```

### Key Validation

```typescript
import { validatePublicKey, generateWireguardKeyPair } from 'wireguard-keygen';

const keyPair = generateWireguardKeyPair();

if (validatePublicKey(keyPair.publicKey)) {
  console.log('✅ Valid WireGuard public key');
} else {
  console.log('❌ Invalid key format');
}
```

### Integration with WireGuard Config

```typescript
import { generateWireguardKeyPair } from 'wireguard-keygen';

function createWireGuardConfig() {
  const serverKeys = generateWireguardKeyPair();
  const clientKeys = generateWireguardKeyPair();
  
  const serverConfig = `
[Interface]
PrivateKey = ${serverKeys.privateKey}
Address = 10.0.0.1/24
ListenPort = 51820

[Peer]
PublicKey = ${clientKeys.publicKey}
AllowedIPs = 10.0.0.2/32
`;

  const clientConfig = `
[Interface]
PrivateKey = ${clientKeys.privateKey}
Address = 10.0.0.2/24

[Peer]
PublicKey = ${serverKeys.publicKey}
Endpoint = your-server.com:51820
AllowedIPs = 0.0.0.0/0
`;

  return { serverConfig, clientConfig };
}
```

## Cryptographic Details

- **Algorithm**: X25519 (Curve25519 for ECDH)
- **Key Size**: 32 bytes (256 bits)
- **Encoding**: Standard base64 with padding
- **Library**: [@noble/curves](https://github.com/paulmillr/noble-curves) for cryptographic operations

## Requirements

- Node.js 14+ 
- TypeScript 4+ (for development)

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## Security

This library uses industry-standard cryptographic libraries and follows WireGuard's key generation specification. However, for production use, please:

1. Ensure proper random number generation in your environment
2. Store private keys securely
3. Follow WireGuard best practices for key management

## Support

- 📝 [Documentation](https://github.com/yourusername/wireguard-keygen#readme)
- 🐛 [Issues](https://github.com/yourusername/wireguard-keygen/issues)
- 💬 [Discussions](https://github.com/yourusername/wireguard-keygen/discussions) 