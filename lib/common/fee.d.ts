import { Coin } from "./coin";
export declare class Fee {
    amount: Coin[];
    gas: string;
    constructor(amount: Coin[], gas: string);
    toString(): string;
}
