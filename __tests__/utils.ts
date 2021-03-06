import dotenv from "dotenv"

dotenv.config()
import { BitSongClient } from "../src/client"
import * as crypto from "../src/crypto"
import { Fee } from "../src/tx"

export const targetAddress = process.env.ADDRESS

// export const mnemonic =
//   "offer caution gift cross surge pretty orange during eye soldier popular holiday mention east eight office fashion ill parrot vault rent devote earth cousin"

export const mnemonic = process.env.MNEMONIC

export const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)

export const keystore = {
  version: 1,
  id: "51c8f456-0922-42a5-9167-ae7f06b78f94",
  crypto: {
    ciphertext:
      "1b203c4ac9c14a1c4c1404f3c70004af466ce0e9a93886f273e11f15fd74a9ea",
    cipherparams: {
      iv: "c45a39c136ecdc26bc92b51aac44a600",
    },
    cipher: "aes-256-ctr",
    kdf: "pbkdf2",
    kdfparams: {
      dklen: 32,
      salt: "f19fa2c0f9f753386d2a850be908e55fc7974ba284a4b3b0b90ad55d213c7783",
      c: 262144,
      prf: "hmac-sha256",
    },
    mac:
      "20361f6d0e6c5321617a6f647c85b1c356a0cb79e560322f00d758d90d5f3a27a2555530fb7315d8209e61fd2d4a85490e349a871d67aac8a79441fa903691ce",
  },
}

let client: BitSongClient

export const getClient = async (
  url = "https://lcd.testnet4.bitsong.network"
) => {
  if (client && client.chain_id) {
    return client
  }

  client = new BitSongClient(url)
  await client.initChain()
  const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
  await client.setAccountInfo(privateKey)
  return client
}

export const wait = (ms) => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, ms)
  })
}
