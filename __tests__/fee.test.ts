import { Coin, Fee } from "../src/common"

describe("fee", () => {
  it("no fee", () => {
    const gas = "200000"
    const fee = new Fee([], gas)

    expect(fee.toString()).toStrictEqual("Gas: 200000 - Amount: ")
  })

  it("single fee", () => {
    const coinStr = "1000ubtsg"
    const coin = Coin.parse(coinStr)

    const gas = "200000"
    const fee = new Fee([coin], gas)

    expect(fee.toString()).toStrictEqual("Gas: 200000 - Amount: 1000ubtsg")
  })

  it("multiple fees", () => {
    const coinStr1 = "1000ubtsg"
    const coin1 = Coin.parse(coinStr1)

    const coinStr2 = "1000uplay"
    const coin2 = Coin.parse(coinStr2)

    const gas = "200000"
    const fee = new Fee([coin1, coin2], gas)

    expect(fee.toString()).toStrictEqual(
      "Gas: 200000 - Amount: 1000ubtsg,1000uplay"
    )
  })
})
