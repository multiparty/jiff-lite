declare var window: any;

let crypto_: any;
if (typeof window === 'undefined') {
  crypto_ = require('crypto');
  crypto_.__randomBytesWrapper = crypto_.randomBytes;
} else {
  crypto_ = window.crypto || window.msCrypto;
  crypto_.__randomBytesWrapper = (bytesNeeded: number): Uint8Array => {
    const randomBytes = new Uint8Array(bytesNeeded);
    crypto_.getRandomValues(randomBytes);
    return randomBytes;
  };
}

// Secure randomness via rejection sampling.
export const random = (max: number): number => {
  if (max > 562949953421312) {
    throw new RangeError('Max value should be smaller than or equal to 2^49');
  }

  const bitsNeeded = Math.ceil(Math.log(max) / Math.log(2));
  const bytesNeeded = Math.ceil(bitsNeeded / 8);
  const maxValue = Math.pow(256, bytesNeeded);

  while (true) {
    const randomBytes = crypto_.__randomBytesWrapper(bytesNeeded);
    let randomValue = 0;

    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = randomValue * 256 + (randomBytes.readUInt8 ? randomBytes.readUInt8(i) : randomBytes[i]);
    }

    if (randomValue < maxValue - maxValue % max) {
      return randomValue % max;
    }
  }
};

// Actual modulo operation
export const mod = (x: number, y: number): number => {
  return x < 0 ? (x % y) + y : x % y;
};

// Get the party number from the given party_id
export const get_party_number = (party_id: string | number): number => {
  if (typeof party_id === 'number') {
    return party_id;
  }
  if (party_id.startsWith('s')) {
    return -1 * parseInt(party_id.substring(1), 10);
  }
  return parseInt(party_id, 10);
};

// Transform number to bit array
export const number_to_bits = (number: number, length?: number): number[] => {
  const numberStr = number.toString(2);
  const bits: number[] = [];
  for (let i = 0; i < numberStr.length; i++) {
    bits[i] = parseInt(numberStr.charAt(numberStr.length - 1 - i));
  }
  while (length != null && bits.length < length) {
    bits.push(0);
  }
  return bits;
};
