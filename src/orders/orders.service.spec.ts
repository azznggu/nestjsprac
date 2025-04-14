import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { NotFoundException } from '@nestjs/common';
import { Order, OrderStatus } from './interfaces/order.interface';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  const mockOrderDto = {
    userId: 1,
    productName: '맥북 프로 16인치',
    quantity: 1,
    totalAmount: 3600000,
  };

  describe('create', () => {
    it('주문을 생성하고 생성된 주문을 반환해야 합니다', () => {
      const order = service.create(mockOrderDto);

      expect(order).toHaveProperty('id');
      expect(order.status).toBe(OrderStatus.PENDING);
      expect(order.orderDate).toBeInstanceOf(Date);
      expect(order.userId).toBe(mockOrderDto.userId);
      expect(order.productName).toBe(mockOrderDto.productName);
      expect(order.quantity).toBe(mockOrderDto.quantity);
      expect(order.totalAmount).toBe(mockOrderDto.totalAmount);
    });
  });

  describe('findAll', () => {
    it('모든 주문 목록을 반환해야 합니다', () => {
      service.create(mockOrderDto);
      service.create(mockOrderDto);

      const orders = service.findAll();
      
      expect(orders).toBeInstanceOf(Array);
      expect(orders.length).toBe(2);
    });
  });

  describe('findByUserId', () => {
    it('특정 사용자의 주문 목록을 반환해야 합니다', () => {
      service.create(mockOrderDto);
      service.create({ ...mockOrderDto, userId: 2 });

      const userOrders = service.findByUserId(1);
      
      expect(userOrders).toBeInstanceOf(Array);
      expect(userOrders.length).toBe(1);
      expect(userOrders[0].userId).toBe(1);
    });
  });

  describe('findOne', () => {
    it('존재하는 주문을 찾아서 반환해야 합니다', () => {
      const createdOrder = service.create(mockOrderDto);
      
      const foundOrder = service.findOne(createdOrder.id);
      
      expect(foundOrder).toBeDefined();
      expect(foundOrder.id).toBe(createdOrder.id);
    });

    it('존재하지 않는 주문을 찾으려고 하면 NotFoundException을 발생시켜야 합니다', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('주문 상태를 업데이트해야 합니다', () => {
      const order = service.create(mockOrderDto);
      
      const updatedOrder = service.updateStatus(order.id, OrderStatus.COMPLETED);
      
      expect(updatedOrder.status).toBe(OrderStatus.COMPLETED);
    });

    it('존재하지 않는 주문의 상태를 업데이트하려고 하면 NotFoundException을 발생시켜야 합니다', () => {
      expect(() => service.updateStatus(999, OrderStatus.COMPLETED)).toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('존재하는 주문을 삭제하고 true를 반환해야 합니다', () => {
      const order = service.create(mockOrderDto);
      
      const result = service.delete(order.id);
      
      expect(result).toBe(true);
      expect(() => service.findOne(order.id)).toThrow(NotFoundException);
    });

    it('존재하지 않는 주문을 삭제하려고 하면 false를 반환해야 합니다', () => {
      const result = service.delete(999);
      
      expect(result).toBe(false);
    });
  });
}); 