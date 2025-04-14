import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { OrderStatus } from '../src/orders/interfaces/order.interface';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const mockOrderDto = {
    userId: 1,
    productName: '맥북 프로 16인치',
    quantity: 1,
    totalAmount: 3600000,
  };

  describe('POST /orders', () => {
    it('유효한 주문 데이터로 주문을 생성해야 합니다', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send(mockOrderDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.status).toBe(OrderStatus.PENDING);
          expect(res.body.userId).toBe(mockOrderDto.userId);
          expect(res.body.productName).toBe(mockOrderDto.productName);
          expect(res.body.quantity).toBe(mockOrderDto.quantity);
          expect(res.body.totalAmount).toBe(mockOrderDto.totalAmount);
          expect(res.body).toHaveProperty('orderDate');
        });
    });

    it('유효하지 않은 주문 데이터로 주문 생성을 시도하면 400 에러를 반환해야 합니다', () => {
      const invalidOrderDto = {
        userId: 'invalid', // 숫자여야 함
        productName: '',
        quantity: 0, // 1 이상이어야 함
        totalAmount: -1000, // 0 이상이어야 함
      };

      return request(app.getHttpServer())
        .post('/orders')
        .send(invalidOrderDto)
        .expect(400);
    });
  });

  describe('GET /orders', () => {
    it('모든 주문 목록을 반환해야 합니다', async () => {
      // 테스트 데이터 생성
      await request(app.getHttpServer())
        .post('/orders')
        .send(mockOrderDto);
      await request(app.getHttpServer())
        .post('/orders')
        .send({ ...mockOrderDto, userId: 2 });

      return request(app.getHttpServer())
        .get('/orders')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
        });
    });

    it('userId로 필터링된 주문 목록을 반환해야 합니다', async () => {
      // 테스트 데이터 생성
      await request(app.getHttpServer())
        .post('/orders')
        .send(mockOrderDto);
      await request(app.getHttpServer())
        .post('/orders')
        .send({ ...mockOrderDto, userId: 2 });

      return request(app.getHttpServer())
        .get('/orders?userId=1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(1);
          expect(res.body[0].userId).toBe(1);
        });
    });
  });

  describe('GET /orders/:id', () => {
    it('존재하는 주문을 조회해야 합니다', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/orders')
        .send(mockOrderDto);

      return request(app.getHttpServer())
        .get(`/orders/${createResponse.body.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createResponse.body.id);
          expect(res.body.userId).toBe(mockOrderDto.userId);
        });
    });

    it('존재하지 않는 주문을 조회하면 404 에러를 반환해야 합니다', () => {
      return request(app.getHttpServer())
        .get('/orders/999')
        .expect(404);
    });
  });

  describe('PUT /orders/:id/status', () => {
    it('주문 상태를 업데이트해야 합니다', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/orders')
        .send(mockOrderDto);

      return request(app.getHttpServer())
        .put(`/orders/${createResponse.body.id}/status`)
        .send({ status: OrderStatus.COMPLETED })
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createResponse.body.id);
          expect(res.body.status).toBe(OrderStatus.COMPLETED);
        });
    });

    it('존재하지 않는 주문의 상태를 업데이트하려고 하면 404 에러를 반환해야 합니다', () => {
      return request(app.getHttpServer())
        .put('/orders/999/status')
        .send({ status: OrderStatus.COMPLETED })
        .expect(404);
    });

    it('유효하지 않은 상태값으로 업데이트하려고 하면 400 에러를 반환해야 합니다', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/orders')
        .send(mockOrderDto);

      return request(app.getHttpServer())
        .put(`/orders/${createResponse.body.id}/status`)
        .send({ status: 'INVALID_STATUS' })
        .expect(400);
    });
  });

  describe('DELETE /orders/:id', () => {
    it('존재하는 주문을 삭제해야 합니다', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/orders')
        .send(mockOrderDto);

      await request(app.getHttpServer())
        .delete(`/orders/${createResponse.body.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });

      // 삭제된 주문 조회 시도
      return request(app.getHttpServer())
        .get(`/orders/${createResponse.body.id}`)
        .expect(404);
    });

    it('존재하지 않는 주문을 삭제하려고 하면 404 에러를 반환해야 합니다', () => {
      return request(app.getHttpServer())
        .delete('/orders/999')
        .expect(404);
    });
  });
}); 