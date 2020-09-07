/**
 * @param {arrayBuffer} arr
 * @returns {string} HEX string
 */
export declare const ab2hexstring: (arr: any) => string;
/**
 * Computes a SHA256 followed by a RIPEMD160.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */
export declare const sha256ripemd160: (hex: string) => string;
/**
 * Computes a single SHA256 digest.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */
export declare const sha256: (hex: string) => string;
/**
 * Computes a single SHA3 (Keccak) digest.
 * @param {string} hex message to hash
 * @returns {string} hash output
 */
export declare const sha3: (hex: string) => string;
