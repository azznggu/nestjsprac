import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserDto } from '../src/users/dto/user.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let createdUserId: number;

  const testUser: UserDto = {
    name: '홍길동',
    email: 'hong@test.com',
    age: 30
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('유효한 데이터로 사용자를 생성할 수 있어야 합니다', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.id).toBeDefined();
          expect(res.body.name).toBe(testUser.name);
          expect(res.body.email).toBe(testUser.email);
          expect(res.body.age).toBe(testUser.age);
          createdUserId = res.body.id;
        });
    });

    it('유효하지 않은 데이터로 사용자를 생성하면 400 에러를 반환해야 합니다', () => {
      const invalidUser = {
        name: '홍길동',
        email: 'invalid-email'
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(invalidUser)
        .expect(400);
    });
  });

  describe('GET /users', () => {
    it('모든 사용자 목록을 반환해야 합니다', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('email');
          expect(res.body[0]).toHaveProperty('age');
        });
    });
  });

  describe('GET /users/:id', () => {
    it('ID로 사용자를 찾을 수 있어야 합니다', () => {
      return request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.id).toBe(createdUserId);
          expect(res.body.name).toBe(testUser.name);
          expect(res.body.email).toBe(testUser.email);
          expect(res.body.age).toBe(testUser.age);
        });
    });

    it('존재하지 않는 ID로 조회시 404를 반환해야 합니다', () => {
      return request(app.getHttpServer())
        .get('/users/999')
        .expect(404);
    });
  });

  describe('PUT /users/:id', () => {
    it('사용자 정보를 업데이트할 수 있어야 합니다', () => {
      const updateData = {
        name: '홍길순',
        age: 31
      };

      return request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.id).toBe(createdUserId);
          expect(res.body.name).toBe(updateData.name);
          expect(res.body.email).toBe(testUser.email);
          expect(res.body.age).toBe(updateData.age);
        });
    });

    it('존재하지 않는 ID로 업데이트 시도시 404를 반환해야 합니다', () => {
      return request(app.getHttpServer())
        .put('/users/999')
        .send({ name: '홍길순' })
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('사용자를 삭제할 수 있어야 합니다', () => {
      return request(app.getHttpServer())
        .delete(`/users/${createdUserId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ success: true });
        });
    });

    it('삭제된 사용자를 조회하면 404를 반환해야 합니다', () => {
      return request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .expect(404);
    });

    it('존재하지 않는 ID로 삭제 시도시 404를 반환해야 합니다', () => {
      return request(app.getHttpServer())
        .delete('/users/999')
        .expect(404);
    });
  });
}); 