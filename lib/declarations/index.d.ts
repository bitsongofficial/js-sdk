/// <reference types="node" />
declare module "is_js" {
    const boolean: (a: any) => a is boolean;
    const number: (a: any) => a is number;
    const integer: (a: any) => a is number;
    const string: (a: any) => a is string;
    const array: (a: any) => a is Array<any>;
    const object: (a: any) => a is object;
}
declare module "secure-random" {
    const csprng: (lenght: number) => ArrayBuffer;
    export default csprng;
}
declare module "crypto-browserify" {
    import _crypto from "crypto";
    const crypto: Pick<typeof _crypto, "createHash" | "createHmac" | "pbkdf2" | "pbkdf2Sync" | "randomBytes" | "pseudoRandomBytes" | "createCipher" | "createDecipher" | "createDiffieHellman" | "createSign" | "createVerify" | "createECDH" | "publicEncrypt" | "privateDecrypt" | "privateEncrypt" | "publicDecrypt" | "createCipheriv" | "createDecipheriv">;
    export default crypto;
}
