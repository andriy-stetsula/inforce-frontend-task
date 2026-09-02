export interface Size {
    width:number;
    height:number;
}

export interface Product {
  id: string;
  imageUrl: string;
  name: string;
  count: number;
  size: Size;
  weight: string;
  comments: string[];
}
