
# Class: BitSongClient

The Bitsong Network client.

## Hierarchy

* **BitSongClient**

## Index

### Constructors

* [constructor](bitsongclient.md#constructor)

### Methods

* [checkAddress](bitsongclient.md#checkaddress)
* [createAccount](bitsongclient.md#createaccount)
* [createAccountWithKeystore](bitsongclient.md#createaccountwithkeystore)
* [createAccountWithMneomnic](bitsongclient.md#createaccountwithmneomnic)
* [getClientKeyAddress](bitsongclient.md#getclientkeyaddress)
* [recoverAccountFromKeystore](bitsongclient.md#recoveraccountfromkeystore)
* [recoverAccountFromMnemonic](bitsongclient.md#recoveraccountfrommnemonic)
* [recoverAccountFromPrivateKey](bitsongclient.md#recoveraccountfromprivatekey)

## Constructors

###  constructor

\+ **new BitSongClient**(`server`: string, `addressPrefix`: string): *[BitSongClient](bitsongclient.md)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`server` | string | BitSong Network public url |
`addressPrefix` | string | - |

**Returns:** *[BitSongClient](bitsongclient.md)*

## Methods

###  checkAddress

▸ **checkAddress**(`address`: string, `prefix`: BitSongClient["addressPrefix"]): *boolean*

Validates an address.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`address` | string | - |
`prefix` | BitSongClient["addressPrefix"] | this.addressPrefix |

**Returns:** *boolean*

___

###  createAccount

▸ **createAccount**(): *object*

Creates a private key and returns it and its address.

**Returns:** *object*

the private key and address in an object.
{
 address,
 privateKey
}

* **address**: *string* = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix)

* **privateKey**: *string*

___

###  createAccountWithKeystore

▸ **createAccountWithKeystore**(`password`: string): *object*

Creates an account keystore object, and returns the private key and address.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`password` | string |   {  privateKey,  address,  keystore }  |

**Returns:** *object*

* **address**: *string*

* **keystore**: *KeyStore*

* **privateKey**: *string*

___

###  createAccountWithMneomnic

▸ **createAccountWithMneomnic**(): *object*

Creates an account from mnemonic seed phrase.

**Returns:** *object*

{
 privateKey,
 address,
 mnemonic
}

* **address**: *string*

* **mnemonic**: *string*

* **privateKey**: *string*

___

###  getClientKeyAddress

▸ **getClientKeyAddress**(): *string*

Returns the address for the current account if setPrivateKey has been called on this client.

**Returns:** *string*

___

###  recoverAccountFromKeystore

▸ **recoverAccountFromKeystore**(`keystore`: Parameters‹typeof getPrivateKeyFromKeyStore›[0], `password`: Parameters‹typeof getPrivateKeyFromKeyStore›[1]): *object*

Recovers an account from a keystore object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`keystore` | Parameters‹typeof getPrivateKeyFromKeyStore›[0] | object. |
`password` | Parameters‹typeof getPrivateKeyFromKeyStore›[1] | password. { privateKey, address }  |

**Returns:** *object*

* **address**: *string*

* **privateKey**: *string*

___

###  recoverAccountFromMnemonic

▸ **recoverAccountFromMnemonic**(`mnemonic`: string): *object*

Recovers an account from a mnemonic seed phrase.

**Parameters:**

Name | Type |
------ | ------ |
`mnemonic` | string |

**Returns:** *object*

* **address**: *string*

* **privateKey**: *string*

___

###  recoverAccountFromPrivateKey

▸ **recoverAccountFromPrivateKey**(`privateKey`: string): *object*

Recovers an account using private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | string |  { privateKey, address }  |

**Returns:** *object*

* **address**: *string*

* **privateKey**: *string*
