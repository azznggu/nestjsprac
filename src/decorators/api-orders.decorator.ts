import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

export const ApiCreateOrder = () => {
  return applyDecorators(
    ApiOperation({ summary: '새로운 주문 생성' }),
    ApiResponse({ 
      status: 201, 
      description: '주문이 성공적으로 생성되었습니다.' 
    })
  );
};

export const ApiFindAllOrders = () => {
  return applyDecorators(
    ApiOperation({ summary: '주문 목록 조회' }),
    ApiQuery({ 
      name: 'userId', 
      required: false, 
      description: '특정 사용자의 주문만 조회하기 위한 사용자 ID' 
    }),
    ApiResponse({ 
      status: 200, 
      description: '주문 목록을 반환합니다.' 
    })
  );
};

export const ApiFindOneOrder = () => {
  return applyDecorators(
    ApiOperation({ summary: '특정 주문 조회' }),
    ApiParam({ name: 'id', description: '주문 ID' }),
    ApiResponse({ 
      status: 200, 
      description: '요청한 ID의 주문을 반환합니다.' 
    }),
    ApiResponse({ 
      status: 404, 
      description: '주문을 찾을 수 없습니다.' 
    })
  );
};

export const ApiUpdateOrderStatus = () => {
  return applyDecorators(
    ApiOperation({ summary: '주문 상태 업데이트' }),
    ApiParam({ name: 'id', description: '주문 ID' }),
    ApiResponse({ 
      status: 200, 
      description: '주문 상태가 업데이트되었습니다.' 
    }),
    ApiResponse({ 
      status: 404, 
      description: '주문을 찾을 수 없습니다.' 
    })
  );
};

export const ApiDeleteOrder = () => {
  return applyDecorators(
    ApiOperation({ summary: '주문 삭제' }),
    ApiParam({ name: 'id', description: '삭제할 주문 ID' }),
    ApiResponse({ 
      status: 200, 
      description: '주문이 성공적으로 삭제되었습니다.' 
    }),
    ApiResponse({ 
      status: 404, 
      description: '주문을 찾을 수 없습니다.' 
    })
  );
}; 