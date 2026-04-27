/**
 * isAltFee() — three-layer rules for type / feeTokenID / feeLimit (aligned with morph-doc inline notes)
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  isAltFee,
  isAltFeeTypeExplicit,
  isFeeLimitValid,
  isPositiveFeeTokenId,
} = require('../src/utils/isAltFee.js');

// --- type layer ---
assert.equal(isAltFee({}), false, 'no feeTokenID');
assert.equal(isAltFee(), false);
assert.equal(isAltFee({ feeTokenID: 4 }), true, 'when type omitted, only feeTokenID matters');
assert.equal(isAltFee({ type: null, feeTokenID: 4 }), true, 'type null same as omitted');
assert.equal(isAltFee({ type: 2, feeTokenID: 4 }), false, 'non-AltFee type → false');
assert.equal(isAltFee({ type: 'eip1559', feeTokenID: 4 }), false);

assert.equal(isAltFee({ type: 127, feeTokenID: 1 }), true);
assert.equal(isAltFee({ type: 127n, feeTokenID: 1 }), true);
assert.equal(isAltFee({ type: '0x7f', feeTokenID: 1 }), true);
assert.equal(isAltFee({ type: '0X7F', feeTokenID: 1 }), true);
assert.equal(isAltFee({ type: 'altFee', feeTokenID: 1 }), true);
assert.equal(isAltFee({ type: 'ALtFEE', feeTokenID: 1 }), true, 'altFee is case-insensitive');

// --- contract: explicit AltFee type without feeTokenID throws ---
assert.throws(
  () => isAltFee({ type: 127 }),
  /feeTokenID is required/,
  'type=127 without feeTokenID',
);
assert.throws(
  () => isAltFee({ type: 127, feeTokenID: null }),
  /feeTokenID is required/,
  'type=127 with feeTokenID null',
);
assert.throws(
  () => isAltFee({ type: '0x7f', feeTokenID: null }),
  /feeTokenID is required/,
);
assert.throws(
  () => isAltFee({ type: 'altFee' }),
  /feeTokenID is required/,
);

// --- feeTokenID layer ---
assert.equal(isAltFee({ type: 127, feeTokenID: 0 }), false, '127 + 0 is not AltFee, no throw');
assert.equal(isAltFee({ feeTokenID: 0 }), false);
assert.equal(isAltFee({ feeTokenID: -1 }), false);
assert.equal(isAltFee({ feeTokenID: 4n }), true);
assert.equal(isAltFee({ feeTokenID: 1.5 }), false, 'reject non-integer token id');

// --- feeLimit optional ---
assert.equal(isAltFee({ feeTokenID: 4, feeLimit: 0 }), true);
assert.equal(isAltFee({ feeTokenID: 4, feeLimit: 0n }), true);
assert.equal(isAltFee({ feeTokenID: 4, feeLimit: -1 }), false);
assert.equal(isAltFee({ feeTokenID: 4, feeLimit: -1n }), false);
assert.equal(isAltFee({ feeTokenID: 4, feeLimit: Number.NaN }), false);
assert.equal(isAltFee({ feeTokenID: 4, feeLimit: undefined }), true, 'limit omitted');
assert.equal(isAltFee({ feeTokenID: 4, feeLimit: null }), true, 'null treated as limit omitted');

// helpers (for other tests in this file or future reuse)
assert.equal(isAltFeeTypeExplicit(127), true);
assert.equal(isAltFeeTypeExplicit(126), false);
assert.equal(isPositiveFeeTokenId(1), true);
assert.equal(isPositiveFeeTokenId(0), false);
assert.equal(isFeeLimitValid(0), true);
assert.equal(isFeeLimitValid(-0.001), false);

console.log('is-alt-fee: ok');
