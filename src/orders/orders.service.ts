import { Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderStatus } from './interfaces/order.interface';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];

  create(orderDto: OrderDto): Order {
    const order: Order = {
      id: this.orders.length + 1,
      ...orderDto,
      status: OrderStatus.PENDING,
      orderDate: new Date()
    };
    this.orders.push(order);
    return order;
  }

  findAll(): Order[] {
    return this.orders;
  }

  findByUserId(userId: number): Order[] {
    return this.orders.filter(order => order.userId === userId);
  }

  findOne(id: number): Order {
    const order = this.orders.find(order => order.id === id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  updateStatus(id: number, status: OrderStatus): Order {
    const order = this.findOne(id);
    order.status = status;
    return order;
  }

  delete(id: number): boolean {
    const index = this.orders.findIndex(order => order.id === id);
    if (index === -1) {
      return false;
    }
    this.orders.splice(index, 1);
    return true;
  }
} 