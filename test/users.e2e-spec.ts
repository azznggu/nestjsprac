import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const testUser = {
    name: '홍길동',
    email: 'hong@example.com',
    age: 30,
  };

  describe('/users (POST)', () => {
    it('should create a new user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({
            id: 1,
            ...testUser,
          });
        });
    });
  });

  describe('/users (GET)', () => {
    it('should return an array of users', async () => {
      // 먼저 사용자를 생성
      await request(app.getHttpServer())
        .post('/users')
        .send(testUser);

      // 사용자 목록 조회
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toEqual({
            id: 1,
            ...testUser,
          });
        });
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user by id', async () => {
      // 먼저 사용자를 생성
      await request(app.getHttpServer())
        .post('/users')
        .send(testUser);

      // 특정 사용자 조회
      return request(app.getHttpServer())
        .get('/users/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            id: 1,
            ...testUser,
          });
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/users/999')
        .expect(404);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete a user', async () => {
      // 먼저 사용자를 생성
      await request(app.getHttpServer())
        .post('/users')
        .send(testUser);

      // 사용자 삭제
      await request(app.getHttpServer())
        .delete('/users/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ success: true });
        });

      // 삭제된 사용자 조회 시도
      return request(app.getHttpServer())
        .get('/users/1')
        .expect(404);
    });

    it('should return 404 when trying to delete non-existent user', () => {
      return request(app.getHttpServer())
        .delete('/users/999')
        .expect(404);
    });
  });
}); 