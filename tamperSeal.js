const VALID_STATUSES = new Set(['INTACT', 'BROKEN', 'MISSING']);

/**
 * Algorithm 1 — Tamper-Evident Seal Verification
 * Checks whether the physical tamper-evident seal on a product is intact.
 *
 * @param {string} sealStatus - One of 'INTACT' | 'BROKEN' | 'MISSING'
 * @returns {{status: 'VERIFIED'|'REJECTED', code: string, message: string}}
 */
function verifyTamperSeal(sealStatus) {
  if (typeof sealStatus !== 'string' || !VALID_STATUSES.has(sealStatus.toUpperCase())) {
    return {
      status: 'REJECTED',
      code: 'INVALID_INPUT',
      message: `Unrecognized seal status. Expected one of: ${[...VALID_STATUSES].join(', ')}`
    };
  }

  const normalized = sealStatus.toUpperCase();

  if (normalized === 'INTACT') {
    return {
      status: 'VERIFIED',
      code: 'SEAL_INTACT',
      message: 'Tamper seal is intact. Product has not been opened.'
    };
  }

  if (normalized === 'MISSING') {
    return {
      status: 'REJECTED',
      code: 'SEAL_MISSING',
      message: 'Tamper seal is missing entirely. Treat as high-risk.'
    };
  }

  return {
    status: 'REJECTED',
    code: 'SEAL_BROKEN',
    message: 'Tamper seal is broken. Possible physical tampering detected.'
  };
}

module.exports = { verifyTamperSeal };
