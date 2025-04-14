export interface Order {
  id: number;
  userId: number;
  productName: string;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  orderDate: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
} 