import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export const ApiGetUsers = () => {
  return applyDecorators(
    ApiOperation({ summary: '모든 사용자 조회' }),
    ApiResponse({
      status: 200,
      description: '모든 사용자 목록을 반환합니다.',
      type: [UserEntity]
    })
  );
};

export const ApiGetUser = () => {
  return applyDecorators(
    ApiOperation({ summary: '특정 사용자 조회' }),
    ApiParam({ name: 'id', description: '사용자 ID' }),
    ApiResponse({
      status: 200,
      description: '요청한 ID의 사용자를 반환합니다.',
      type: UserEntity
    }),
    ApiResponse({
      status: 404,
      description: '사용자를 찾을 수 없습니다.'
    })
  );
};

export const ApiCreateUser = () => {
  return applyDecorators(
    ApiOperation({ summary: '새로운 사용자 생성' }),
    ApiResponse({
      status: 201,
      description: '사용자가 성공적으로 생성되었습니다.',
      type: UserEntity
    })
  );
};

export const ApiDeleteUser = () => {
  return applyDecorators(
    ApiOperation({ summary: '사용자 삭제' }),
    ApiParam({ name: 'id', description: '삭제할 사용자 ID' }),
    ApiResponse({
      status: 200,
      description: '사용자가 성공적으로 삭제되었습니다.'
    }),
    ApiResponse({
      status: 404,
      description: '사용자를 찾을 수 없습니다.'
    })
  );
}; 