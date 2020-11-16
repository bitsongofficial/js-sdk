import Transaction, { Fee, Msg } from "../src/tx"

import { privateKey, getClient, targetAddress } from "./utils"

describe("Transaction", () => {
  beforeEach(() => {
    jest.setTimeout(50000)
  })

  it("should sign", () => {
    const fee: Fee = {
      amount: [],
      gas: "20000",
    }

    const msg: Msg = {
      type: "cosmos-sdk/MsgDelegate",
      value: {
        delegator_address: "bitsong1pdfr7xuckj6lhdphdde6peres9ufwgpsxge8yc",
        validator_address:
          "bitsongvaloper1pdfr7xuckj6lhdphdde6peres9ufwgps8v9w59",
        amount: {
          denom: "ubtsg",
          amount: "126709519",
        },
      },
    }

    const tx = new Transaction("bitsong-local", "1", "0", fee, "", [msg])
    const txBz = tx.sign(privateKey).serialize()
    expect(txBz).toBe(
      '{"tx":{"account_number":"1","chain_id":"bitsong-local","sequence":"0","fee":{"amount":[],"gas":"20000"},"msgs":[{"type":"cosmos-sdk/MsgDelegate","value":{"delegator_address":"bitsong1pdfr7xuckj6lhdphdde6peres9ufwgpsxge8yc","validator_address":"bitsongvaloper1pdfr7xuckj6lhdphdde6peres9ufwgps8v9w59","amount":{"denom":"ubtsg","amount":"126709519"}}}],"signatures":[{"pub_key":["81f2e558fb1fca36cd67b3c163d84bc9702188e3887d429d43a097b16a1b9205","78cea8693ca25a22a395b6939ad8201805dd71e43256d0371a983f35a52374c8"],"signature":{"type":"Buffer","data":[202,183,136,76,179,105,107,68,155,18,57,37,190,134,226,230,208,174,100,2,2,109,87,13,189,57,221,168,6,241,183,0,65,149,169,163,193,29,89,35,82,173,71,62,130,18,60,217,173,5,54,44,162,156,81,225,27,28,148,104,50,191,19,116]}}],"memo":""},"mode":"sync"}'
    )
  })

  it("should transfer coins", async () => {
    const client = await getClient(true, false)
    const account = await client._httpClient.request(
      "get",
      `/auth/accounts/${targetAddress}`
    )
    const sequence =
      account.result.result.value && account.result.result.value.sequence
    const account_number =
      account.result.result.value && account.result.result.value.account_number
    const node = await client._httpClient.request("get", `/node_info`)
    const chain_id = node.result.node_info.network

    const fee: Fee = {
      amount: [],
      gas: "20000",
    }

    const msg: Msg = {
      type: "cosmos-sdk/MsgSend",
      value: {
        amount: [
          {
            denom: "ubtsg",
            amount: 1,
          },
        ],
        from_address: targetAddress,
        to_address: targetAddress,
      },
    }

    const tx = new Transaction(chain_id, account_number, sequence, fee, "", [
      msg,
    ])
    const txBz = tx.sign(privateKey).serialize()
    expect(txBz).toBe(
      '{"tx":{"account_number":"34","chain_id":"bitsong-testnet-4","sequence":"471","fee":{"amount":[],"gas":"20000"},"msgs":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"denom":"ubtsg","amount":1}],"from_address":"bitsong1pdfr7xuckj6lhdphdde6peres9ufwgpsxge8yc","to_address":"bitsong1pdfr7xuckj6lhdphdde6peres9ufwgpsxge8yc"}}],"signatures":[{"pub_key":["81f2e558fb1fca36cd67b3c163d84bc9702188e3887d429d43a097b16a1b9205","78cea8693ca25a22a395b6939ad8201805dd71e43256d0371a983f35a52374c8"],"signature":{"type":"Buffer","data":[44,32,240,196,1,129,167,0,179,158,182,245,240,232,244,61,126,205,131,196,133,11,140,95,155,218,170,132,110,200,186,93,6,40,179,44,140,187,81,132,35,109,209,200,167,72,234,81,159,79,34,134,19,212,187,78,254,100,98,100,56,167,111,218]}}],"memo":""},"mode":"sync"}'
    )
    const response = await client.sendRawTransaction(txBz)
    expect(response).toBe(200)
  })
})
