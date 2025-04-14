import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('새로운 사용자를 생성해야 합니다', () => {
      const userDto: UserDto = {
        name: '홍길동',
        email: 'hong@test.com',
        age: 30
      };

      const user = service.create(userDto);

      expect(user).toBeDefined();
      expect(user.id).toBe(1);
      expect(user.name).toBe(userDto.name);
      expect(user.email).toBe(userDto.email);
      expect(user.age).toBe(userDto.age);
    });
  });

  describe('findAll', () => {
    it('모든 사용자 목록을 반환해야 합니다', () => {
      const userDto: UserDto = {
        name: '홍길동',
        email: 'hong@test.com',
        age: 30
      };
      
      service.create(userDto);
      const users = service.findAll();

      expect(users).toBeDefined();
      expect(users.length).toBe(1);
      expect(users[0].name).toBe(userDto.name);
    });
  });

  describe('findOne', () => {
    it('ID로 사용자를 찾아야 합니다', () => {
      const userDto: UserDto = {
        name: '홍길동',
        email: 'hong@test.com',
        age: 30
      };
      
      const created = service.create(userDto);
      const found = service.findOne(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe(userDto.name);
    });

    it('존재하지 않는 ID로 조회시 undefined를 반환해야 합니다', () => {
      const found = service.findOne(999);
      expect(found).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('사용자를 성공적으로 삭제해야 합니다', () => {
      const userDto: UserDto = {
        name: '홍길동',
        email: 'hong@test.com',
        age: 30
      };
      
      const created = service.create(userDto);
      const result = service.delete(created.id);

      expect(result).toBe(true);
      expect(service.findOne(created.id)).toBeUndefined();
    });

    it('존재하지 않는 ID로 삭제 시도시 false를 반환해야 합니다', () => {
      const result = service.delete(999);
      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('사용자 정보를 성공적으로 업데이트해야 합니다', () => {
      const userDto: UserDto = {
        name: '홍길동',
        email: 'hong@test.com',
        age: 30
      };
      
      const created = service.create(userDto);
      const updateDto: UserDto = {
        name: '홍길순'
      };

      const updated = service.update(created.id, updateDto);

      expect(updated).toBeDefined();
      expect(updated.name).toBe('홍길순');
      expect(updated.email).toBe(userDto.email); // 기존 값 유지
      expect(updated.age).toBe(userDto.age); // 기존 값 유지
    });

    it('존재하지 않는 ID로 업데이트 시도시 NotFoundException을 발생시켜야 합니다', () => {
      const updateDto: UserDto = {
        name: '홍길순'
      };

      expect(() => service.update(999, updateDto))
        .toThrow(NotFoundException);
    });
  });
});
