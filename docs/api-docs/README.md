
# @bitsongofficial/js-sdk

## Index

### Modules

* ["crypto-browserify"](modules/_crypto_browserify_.md)
* ["is_js"](modules/_is_js_.md)
* ["ndjson"](modules/_ndjson_.md)
* ["protocol-buffers-encodings"](modules/_protocol_buffers_encodings_.md)
* ["secure-random"](modules/_secure_random_.md)

### Classes

* [BitSongClient](classes/bitsongclient.md)

### Other Functions

* [ab2hexstring](README.md#const-ab2hexstring)
* [sha256](README.md#const-sha256)
* [sha256ripemd160](README.md#const-sha256ripemd160)
* [sha3](README.md#const-sha3)

### crypto Functions

* [checkAddress](README.md#const-checkaddress)
* [decodeAddress](README.md#const-decodeaddress)
* [encodeAddress](README.md#const-encodeaddress)
* [generateKeyStore](README.md#const-generatekeystore)
* [generateMnemonic](README.md#const-generatemnemonic)
* [generatePrivateKey](README.md#const-generateprivatekey)
* [generatePubKey](README.md#const-generatepubkey)
* [generateRandomArray](README.md#const-generaterandomarray)
* [generateSignature](README.md#const-generatesignature)
* [getAddressFromPrivateKey](README.md#const-getaddressfromprivatekey)
* [getAddressFromPublicKey](README.md#const-getaddressfrompublickey)
* [getPrivateKeyFromKeyStore](README.md#const-getprivatekeyfromkeystore)
* [getPrivateKeyFromMnemonic](README.md#const-getprivatekeyfrommnemonic)
* [getPublicKey](README.md#const-getpublickey)
* [getPublicKeyFromPrivateKey](README.md#const-getpublickeyfromprivatekey)
* [verifySignature](README.md#const-verifysignature)

## Other Functions

### `Const` ab2hexstring

▸ **ab2hexstring**(`arr`: any): *string*

**Parameters:**

Name | Type |
------ | ------ |
`arr` | any |

**Returns:** *string*

HEX string

___

### `Const` sha256

▸ **sha256**(`hex`: string): *string*

Computes a single SHA256 digest.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hex` | string | message to hash |

**Returns:** *string*

hash output

___

### `Const` sha256ripemd160

▸ **sha256ripemd160**(`hex`: string): *string*

Computes a SHA256 followed by a RIPEMD160.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hex` | string | message to hash |

**Returns:** *string*

hash output

___

### `Const` sha3

▸ **sha3**(`hex`: string): *string*

Computes a single SHA3 (Keccak) digest.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hex` | string | message to hash |

**Returns:** *string*

hash output

___

## crypto Functions

### `Const` checkAddress

▸ **checkAddress**(`address`: string, `hrp`: string): *boolean*

Checks whether an address is valid.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | the bech32 address to decode |
`hrp` | string | the prefix to check for the bech32 address |

**Returns:** *boolean*

___

### `Const` decodeAddress

▸ **decodeAddress**(`value`: string): *Buffer*

Decodes an address in bech32 format.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | string | the bech32 address to decode  |

**Returns:** *Buffer*

___

### `Const` encodeAddress

▸ **encodeAddress**(`value`: string | Buffer, `prefix`: string, `type`: BufferEncoding): *string*

Encodes an address from input data bytes.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`value` | string &#124; Buffer | - | the public key to encode |
`prefix` | string | "bitsong" | the address prefix |
`type` | BufferEncoding | "hex" | the output type (default: hex)  |

**Returns:** *string*

___

### `Const` generateKeyStore

▸ **generateKeyStore**(`privateKeyHex`: string, `password`: string): *KeyStore*

Generates a keystore object (web3 secret storage format) given a private key to store and a password.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKeyHex` | string | the private key hexstring. |
`password` | string | the password. |

**Returns:** *KeyStore*

the keystore object.

___

### `Const` generateMnemonic

▸ **generateMnemonic**(): *string*

Generates mnemonic phrase words using random entropy.

**Returns:** *string*

___

### `Const` generatePrivateKey

▸ **generatePrivateKey**(`len`: number): *string*

Generates 32 bytes of random entropy

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`len` | number | PRIVKEY_LEN | output length (default: 32 bytes) |

**Returns:** *string*

entropy bytes hexstring

___

### `Const` generatePubKey

▸ **generatePubKey**(`privateKey`: Buffer): *BasePoint*

PubKey performs the point-scalar multiplication from the privKey on the
generator point to get the pubkey.

**Parameters:**

Name | Type |
------ | ------ |
`privateKey` | Buffer |

**Returns:** *BasePoint*

PubKey

___

### `Const` generateRandomArray

▸ **generateRandomArray**(`length`: number): *ArrayBuffer*

Generates an arrayBuffer filled with random bits.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`length` | number | Length of buffer. |

**Returns:** *ArrayBuffer*

___

### `Const` generateSignature

▸ **generateSignature**(`signBytesHex`: string, `privateKey`: string | Buffer): *Buffer*

Generates a signature (64 byte <r,s>) for a transaction based on given private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`signBytesHex` | string | Unsigned transaction sign bytes hexstring. |
`privateKey` | string &#124; Buffer | The private key. |

**Returns:** *Buffer*

Signature. Does not include tx.

___

### `Const` getAddressFromPrivateKey

▸ **getAddressFromPrivateKey**(`privateKeyHex`: string, `prefix?`: undefined | string): *string*

Gets an address from a private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKeyHex` | string | the private key hexstring |
`prefix?` | undefined &#124; string | the address prefix  |

**Returns:** *string*

___

### `Const` getAddressFromPublicKey

▸ **getAddressFromPublicKey**(`publicKeyHex`: string, `prefix?`: undefined | string): *string*

Gets an address from a public key hex.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`publicKeyHex` | string | the public key hexstring |
`prefix?` | undefined &#124; string | the address prefix  |

**Returns:** *string*

___

### `Const` getPrivateKeyFromKeyStore

▸ **getPrivateKeyFromKeyStore**(`keystore`: string, `password`: string): *string*

Gets a private key from a keystore given its password.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`keystore` | string | the keystore in json format |
`password` | string | the password.  |

**Returns:** *string*

___

### `Const` getPrivateKeyFromMnemonic

▸ **getPrivateKeyFromMnemonic**(`mnemonic`: string, `derive`: boolean, `index`: number, `password`: string): *string*

Get a private key from mnemonic words.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`mnemonic` | string | - | the mnemonic phrase words |
`derive` | boolean | true | derive a private key using the default HD path (default: true) |
`index` | number | 0 | the bip44 address index (default: 0) |
`password` | string | "" | according to bip39 |

**Returns:** *string*

hexstring

___

### `Const` getPublicKey

▸ **getPublicKey**(`publicKey`: string): *BasePoint‹›*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`publicKey` | string | Encoded public key |

**Returns:** *BasePoint‹›*

public key hexstring

___

### `Const` getPublicKeyFromPrivateKey

▸ **getPublicKeyFromPrivateKey**(`privateKeyHex`: string): *string*

Calculates the public key from a given private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKeyHex` | string | the private key hexstring |

**Returns:** *string*

public key hexstring

___

### `Const` verifySignature

▸ **verifySignature**(`sigHex`: string, `signBytesHex`: string, `publicKeyHex`: string): *boolean*

Verifies a signature (64 byte <r,s>) given the sign bytes and public key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sigHex` | string | The signature hexstring. |
`signBytesHex` | string | Unsigned transaction sign bytes hexstring. |
`publicKeyHex` | string | The public key. |

**Returns:** *boolean*
