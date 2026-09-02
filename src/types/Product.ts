export type Currency = "USD" | "UAH";

export interface Product {
  id: string;
  imageUrl: string;
  name: string;
  count: number;
  currency: Currency;
  size: {
    width: number;
    height: number;
  };
  weight: string;
  comments: number[];
}