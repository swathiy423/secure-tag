# SecureTag Algorithms

Tamper-evident NFC/QR verification algorithms for an electronics-returns
anti-fraud system (prototype). This package turns the original algorithm
sketches into runnable, tested Node.js modules with input validation and a
shared in-memory data layer.

> **Prototype disclaimer:** this is logic for demonstrating the approach.
> A production system needs a real backend/database, authenticated APIs,
> cryptographically-issued tags, real NFC/QR hardware integration, and
> server-side (not client-trusted) verification.

## Getting started

```bash
npm install      # no external dependencies, but sets up the project
npm start        # runs the demo in index.js
npm test         # runs the full test suite (Node's built-in test runner)
```

Requires Node.js 18+.

## Project structure

```
securetag-algorithms/
├── index.js                    # demo entry point, exports all algorithms
├── src/
│   ├── database.js             # in-memory product/tag registry (swap for a real DB)
│   ├── tamperSeal.js           # 1. Tamper-Evident Seal Verification
│   ├── dualAuth.js             # 2. Dual QR/NFC Authentication
│   ├── productId.js            # 3. Unique Product Identity Generation
│   ├── scanAuth.js             # 4. Instant QR/NFC Scan Authentication
│   ├── fraudDetection.js       # 5. Return Fraud Detection
│   ├── tagMapping.js           # 7. Product–Tag Mapping and Validation
│   ├── verificationResult.js   # 8. Fraud Alert and Verification Result
│   └── combinedVerification.js # 9. Combined SecureTag Verification
├── public/
│   └── service-worker.js       # 6. Offline PWA Verification (browser-only)
├── test/                       # one test file per algorithm
└── package.json
```

Algorithm 6 (offline PWA verification) is a browser Service Worker, not a
Node module, so it lives in `public/` instead of `src/` and isn't part of
the Node test suite — register it from your front-end with
`navigator.serviceWorker.register('/service-worker.js')`.

## What changed from the original prototype

- **Input validation**: every function now checks for missing/garbage
  input instead of assuming well-formed calls.
- **Shared data layer** (`src/database.js`): product and tag records used
  to be redeclared inside multiple files; now there's one registry object
  passed into the functions that need it, which is also how you'd swap in
  a real database later without touching the algorithm logic.
- **Cryptographically stronger ID generation**: `productId.js` uses
  `crypto.randomBytes` instead of `Math.random()`, since `Math.random()`
  is predictable and unsuitable for anything security-adjacent.
- **Consistent return shapes**: every check returns a small object with a
  status/result field, a human-readable message, and (where useful) a
  `reasons` array — easier to render in a UI or log than the original
  mix of plain strings and objects.
- **Tests**: 34 tests across all 8 Node-side algorithms using Node's
  built-in `node:test` runner (zero extra dependencies).

## Algorithms

| # | Algorithm | File |
|---|-----------|------|
| 1 | Tamper-Evident Seal Verification | `src/tamperSeal.js` |
| 2 | Dual QR/NFC Authentication | `src/dualAuth.js` |
| 3 | Unique Product Identity Generation | `src/productId.js` |
| 4 | Instant QR/NFC Scan Authentication | `src/scanAuth.js` |
| 5 | Return Fraud Detection | `src/fraudDetection.js` |
| 6 | Offline PWA Verification | `public/service-worker.js` |
| 7 | Product–Tag Mapping and Validation | `src/tagMapping.js` |
| 8 | Fraud Alert and Verification Result | `src/verificationResult.js` |
| 9 | Combined SecureTag Verification | `src/combinedVerification.js` |

### Demo flow

```
Scan QR/NFC → Find Product → Match Product & Tags → Check Tamper Seal
  → Verify Authenticity → Detect Possible Fraud → Generate Result → Display
```

## Usage example

```js
const { verifyProduct } = require('./src/combinedVerification');
const { seedDemoDatabase } = require('./src/database');

const db = seedDemoDatabase();

const result = verifyProduct('ST-DELL-001', 'QR-ST001', 'NFC-ST001', 'INTACT', db);
console.log(result);
// { result: 'VERIFIED', alert: 'NONE', message: 'Genuine and untampered product.', reasons: [], product: {...} }
```

## License

MIT
