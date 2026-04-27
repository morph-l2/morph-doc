/**
 * Whether a tx/request payload is AltFee per Morph rules (type, feeTokenID, optional feeLimit).
 * CommonJS so Node test runners can `require()` it without package `"type":"module"`.
 *
 * 1) type: omitted/null → skip; 127 / 127n / "0x7f" / "altFee" (case-insensitive) → proceed; otherwise false
 * 2) When type is explicitly AltFee: feeTokenID null/omitted → throw (upstream contract violation)
 * 3) Core: feeTokenID present and &gt; 0; feeLimit optional — if provided must be &gt;= 0 and finite, else false
 *
 * @param {object} [params={}]
 * @param {number|bigint|string|undefined|null} [params.type]
 * @param {number|bigint|undefined|null} [params.feeTokenID]
 * @param {number|bigint|undefined|null} [params.feeLimit]
 * @returns {boolean}
 * @throws {Error} When type is AltFee and `feeTokenID` is `null` or `undefined`
 */
function isAltFeeTypeExplicit(type) {
  if (type === undefined || type === null) return false;
  if (type === 127) return true;
  if (typeof type === 'bigint' && type === 127n) return true;
  if (typeof type === 'string') {
    if (type === '0x7f' || type === '0X7F') return true;
    if (type.toLowerCase() === 'altfee') return true;
  }
  return false;
}

function isFeeLimitValid(feeLimit) {
  if (typeof feeLimit === 'bigint') {
    return feeLimit >= 0n;
  }
  const n = Number(feeLimit);
  return Number.isFinite(n) && n >= 0;
}

function isPositiveFeeTokenId(feeTokenID) {
  if (feeTokenID === undefined || feeTokenID === null) return false;
  if (typeof feeTokenID === 'bigint') {
    return feeTokenID > 0n;
  }
  if (typeof feeTokenID === 'number') {
    return Number.isFinite(feeTokenID) && Number.isInteger(feeTokenID) && feeTokenID > 0;
  }
  return false;
}

function isAltFee(params) {
  const p = params === undefined || params === null ? {} : params;
  const { type, feeTokenID, feeLimit } = p;

  if (type !== undefined && type !== null) {
    if (!isAltFeeTypeExplicit(type)) {
      return false;
    }
  }

  if (isAltFeeTypeExplicit(type) && (feeTokenID === undefined || feeTokenID === null)) {
    throw new Error('AltFee: when type is AltFee (0x7f/127/altFee), feeTokenID is required');
  }

  if (!isPositiveFeeTokenId(feeTokenID)) {
    return false;
  }

  if (feeLimit !== undefined && feeLimit !== null) {
    if (!isFeeLimitValid(feeLimit)) {
      return false;
    }
  }

  return true;
}

module.exports = { isAltFee, isAltFeeTypeExplicit, isFeeLimitValid, isPositiveFeeTokenId };
