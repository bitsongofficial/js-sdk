import BitSongClient from "../src"
import * as crypto from "../src/crypto"

const mnemonic =
  "offer caution gift cross surge pretty orange during eye soldier popular holiday mention east eight office fashion ill parrot vault rent devote earth cousin"

const keystore = {
  version: 1,
  id: "51c8f456-0922-42a5-9167-ae7f06b78f94",
  crypto: {
    ciphertext:
      "1b203c4ac9c14a1c4c1404f3c70004af466ce0e9a93886f273e11f15fd74a9ea",
    cipherparams: { iv: "c45a39c136ecdc26bc92b51aac44a600" },
    cipher: "aes-256-ctr",
    kdf: "pbkdf2",
    kdfparams: {
      dklen: 32,
      salt: "f19fa2c0f9f753386d2a850be908e55fc7974ba284a4b3b0b90ad55d213c7783",
      c: 262144,
      prf: "hmac-sha256"
    },
    mac:
      "20361f6d0e6c5321617a6f647c85b1c356a0cb79e560322f00d758d90d5f3a27a2555530fb7315d8209e61fd2d4a85490e349a871d67aac8a79441fa903691ce"
  }
}

const getClient = async () => {
  const client = new BitSongClient()
  return client
}

beforeEach(() => {
  jest.setTimeout(50000)
})

it("create account", async () => {
  const client = await getClient()
  const res = client.createAccount()
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
})

it("create account with keystore", async () => {
  const client = await getClient()
  const res = client.createAccountWithKeystore("12345678")
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
  expect(res.keystore).toBeTruthy()
})

it("recover account from keystore", async () => {
  const client = await getClient()
  const res = client.recoverAccountFromKeystore(keystore, "12345678")
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
})

it("recover account from bad password keystore", async () => {
  const client = await getClient()
  expect(() => {
    client.recoverAccountFromKeystore(keystore, "12345qwert!S")
  }).toThrowError()
})

it("recover account from mneomnic", async () => {
  jest.setTimeout(50000)
  const client = await getClient()
  const res = client.recoverAccountFromMnemonic(mnemonic)
  await 1500
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
})

it("recover account from privatekey", async () => {
  jest.setTimeout(50000)
  const client = await getClient()
  const pk = crypto.generatePrivateKey()
  const res = client.recoverAccountFromPrivateKey(pk)
  await 1500
  expect(res.address).toBeTruthy()
  expect(res.privateKey).toBeTruthy()
})
