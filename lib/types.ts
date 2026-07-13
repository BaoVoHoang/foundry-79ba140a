export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  created_at?: string;
}

export interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  items_json: string;
  total_price: number;
  created_at?: string;
}
