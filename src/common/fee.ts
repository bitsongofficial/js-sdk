import { Coin } from "./coin"

export class Fee {
  public amount: Coin[]
  public gas: string

  constructor(amount: Coin[], gas: string) {
    this.amount = amount
    this.gas = gas
  }

  public toString(): string {
    let amountStr = ""

    for (const amt of this.amount) {
      amountStr =
        amountStr === ""
          ? `${amt.toString()}`
          : `${amountStr},${amt.toString()}`
    }

    return `Gas: ${this.gas} - Amount: ${amountStr}`
  }
}
