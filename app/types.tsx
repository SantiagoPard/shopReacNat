export interface Food {
  id: number;
  name: string;
  type: string;
  category: string;
  image: string;
  price: number;
  description: string;
}

export type CartItem = {
  id: number;
  name: string,
  type: string,
  category: string,
  image: string,
  price: number,
  description: string
  quantity:number
};

export type RootStackParamList = {
  Menu: undefined;
  Cart: { cart: CartItem[]; setCart: (cart: CartItem[]) => void };
};
