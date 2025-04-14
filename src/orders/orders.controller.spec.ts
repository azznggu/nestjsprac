import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { NotFoundException } from '@nestjs/common';
import { Order, OrderStatus } from './interfaces/order.interface';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
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
      const order = controller.create(mockOrderDto);

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
    it('userId가 없을 때 모든 주문 목록을 반환해야 합니다', () => {
      controller.create(mockOrderDto);
      controller.create(mockOrderDto);

      const orders = controller.findAll();
      
      expect(orders).toBeInstanceOf(Array);
      expect(orders.length).toBe(2);
    });

    it('userId가 있을 때 해당 사용자의 주문 목록만 반환해야 합니다', () => {
      controller.create(mockOrderDto);
      controller.create({ ...mockOrderDto, userId: 2 });

      const orders = controller.findAll('1');
      
      expect(orders).toBeInstanceOf(Array);
      expect(orders.length).toBe(1);
      expect(orders[0].userId).toBe(1);
    });
  });

  describe('findOne', () => {
    it('존재하는 주문을 찾아서 반환해야 합니다', () => {
      const createdOrder = controller.create(mockOrderDto);
      
      const foundOrder = controller.findOne(String(createdOrder.id));
      
      expect(foundOrder).toBeDefined();
      expect(foundOrder.id).toBe(createdOrder.id);
    });

    it('존재하지 않는 주문을 찾으려고 하면 NotFoundException을 발생시켜야 합니다', () => {
      expect(() => controller.findOne('999')).toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('주문 상태를 업데이트해야 합니다', () => {
      const order = controller.create(mockOrderDto);
      const updateStatusDto: UpdateOrderStatusDto = { status: OrderStatus.COMPLETED };
      
      const updatedOrder = controller.updateStatus(String(order.id), updateStatusDto);
      
      expect(updatedOrder.status).toBe(OrderStatus.COMPLETED);
    });

    it('존재하지 않는 주문의 상태를 업데이트하려고 하면 NotFoundException을 발생시켜야 합니다', () => {
      const updateStatusDto: UpdateOrderStatusDto = { status: OrderStatus.COMPLETED };
      expect(() => 
        controller.updateStatus('999', updateStatusDto)
      ).toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('존재하는 주문을 삭제하고 성공 메시지를 반환해야 합니다', () => {
      const order = controller.create(mockOrderDto);
      
      const result = controller.delete(String(order.id));
      
      expect(result.success).toBe(true);
      expect(() => controller.findOne(String(order.id))).toThrow(NotFoundException);
    });

    it('존재하지 않는 주문을 삭제하려고 하면 NotFoundException을 발생시켜야 합니다', () => {
      expect(() => controller.delete('999')).toThrow(NotFoundException);
    });
  });
}); 