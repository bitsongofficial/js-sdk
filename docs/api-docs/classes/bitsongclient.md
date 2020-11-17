
# Class: BitSongClient

The Bitsong Network client.

## Hierarchy

* **BitSongClient**

## Index

### Constructors

* [constructor](bitsongclient.md#constructor)

### Methods

* [broadcast](bitsongclient.md#broadcast)
* [buildTransaction](bitsongclient.md#buildtransaction)
* [checkAddress](bitsongclient.md#checkaddress)
* [createAccount](bitsongclient.md#createaccount)
* [createAccountWithKeystore](bitsongclient.md#createaccountwithkeystore)
* [createAccountWithMneomnic](bitsongclient.md#createaccountwithmneomnic)
* [delegate](bitsongclient.md#delegate)
* [generateAndDownloadKeyStore](bitsongclient.md#generateanddownloadkeystore)
* [getAccount](bitsongclient.md#getaccount)
* [getAccountNumberFromAccountInfo](bitsongclient.md#getaccountnumberfromaccountinfo)
* [getClientKeyAddress](bitsongclient.md#getclientkeyaddress)
* [getSequenceNumberFromAccountInfo](bitsongclient.md#getsequencenumberfromaccountinfo)
* [initChain](bitsongclient.md#initchain)
* [recoverAccountFromKeystore](bitsongclient.md#recoveraccountfromkeystore)
* [recoverAccountFromMnemonic](bitsongclient.md#recoveraccountfrommnemonic)
* [recoverAccountFromPrivateKey](bitsongclient.md#recoveraccountfromprivatekey)
* [send](bitsongclient.md#send)
* [setAccountInfo](bitsongclient.md#setaccountinfo)
* [setMode](bitsongclient.md#setmode)

## Constructors

###  constructor

\+ **new BitSongClient**(`server`: string, `addressPrefix?`: undefined | string, `hdpath?`: undefined | string): *[BitSongClient](bitsongclient.md)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`server` | string | BitSong Network public url |
`addressPrefix?` | undefined &#124; string | BitSong Address Prefix |
`hdpath?` | undefined &#124; string | BitSong HDPATH |

**Returns:** *[BitSongClient](bitsongclient.md)*

## Methods

###  broadcast

▸ **broadcast**(`signedBz`: string): *Promise‹object›*

Broadcast a raw transaction to the blockchain.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`signedBz` | string | signed and serialized raw transaction |

**Returns:** *Promise‹object›*

resolves with response (success or fail)

___

###  buildTransaction

▸ **buildTransaction**(`msgs`: Msg[], `memo`: string, `fee`: Fee, `sequence_number`: string): *Promise‹string›*

Build Transaction before broadcast.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`msgs` | Msg[] | - |
`memo` | string | "" |
`fee` | Fee | - |
`sequence_number` | string | "" |

**Returns:** *Promise‹string›*

Transaction object

___

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

###  delegate

▸ **delegate**(`validator_address`: string, `amount`: Coin, `memo`: string, `fee`: Fee, `sequence`: string): *Promise‹object›*

Build and broadcast MsgDelegate

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`validator_address` | string | - |
`amount` | Coin | - |
`memo` | string | "" |
`fee` | Fee | - |
`sequence` | string | "" |

**Returns:** *Promise‹object›*

___

###  generateAndDownloadKeyStore

▸ **generateAndDownloadKeyStore**(`privateKey`: string, `password`: string): *void*

Generate and download an account keystore object, and returns the private key and address.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | string | - |
`password` | string |   |

**Returns:** *void*

___

###  getAccount

▸ **getAccount**(`address`: undefined | string): *Promise‹null | object›*

get account

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`address` | undefined &#124; string | this.address |

**Returns:** *Promise‹null | object›*

resolves with http response

___

###  getAccountNumberFromAccountInfo

▸ **getAccountNumberFromAccountInfo**(`accountInfo`: any): *any*

get accountNumber from accountInfo Object

**Parameters:**

Name | Type |
------ | ------ |
`accountInfo` | any |

**Returns:** *any*

accountNumber

___

###  getClientKeyAddress

▸ **getClientKeyAddress**(): *string*

Returns the address for the current account if setPrivateKey has been called on this client.

**Returns:** *string*

___

###  getSequenceNumberFromAccountInfo

▸ **getSequenceNumberFromAccountInfo**(`accountInfo`: any): *any*

get SequenceNumber from accountInfo Object

**Parameters:**

Name | Type |
------ | ------ |
`accountInfo` | any |

**Returns:** *any*

sequenceNumber

___

###  initChain

▸ **initChain**(): *Promise‹this›*

Initialize the client with the chain's ID. Asynchronous.

**Returns:** *Promise‹this›*

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

___

###  send

▸ **send**(`to_address`: string, `amount`: Coin[], `memo`: string, `fee`: Fee, `sequence`: string): *Promise‹object›*

Build and broadcast MsgSend

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`to_address` | string | - |
`amount` | Coin[] | - |
`memo` | string | "" |
`fee` | Fee | - |
`sequence` | string | "" |

**Returns:** *Promise‹object›*

___

###  setAccountInfo

▸ **setAccountInfo**(`privateKey`: string): *Promise‹[BitSongClient](bitsongclient.md)›*

Set client account.

**Parameters:**

Name | Type |
------ | ------ |
`privateKey` | string |

**Returns:** *Promise‹[BitSongClient](bitsongclient.md)›*

___

###  setMode

▸ **setMode**(`mode`: string): *void*

Set broadcast mode

**Parameters:**

Name | Type |
------ | ------ |
`mode` | string |

**Returns:** *void*
