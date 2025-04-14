import { Controller, Get, Post, Body, Param, Delete, Put, Query, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './interfaces/order.interface';
import { 
  ApiCreateOrder, 
  ApiFindAllOrders, 
  ApiFindOneOrder, 
  ApiUpdateOrderStatus, 
  ApiDeleteOrder 
} from '../decorators/api-orders.decorator';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiCreateOrder()
  create(@Body() orderDto: OrderDto): Order {
    return this.ordersService.create(orderDto);
  }

  @Get()
  @ApiFindAllOrders()
  findAll(@Query('userId') userId?: string): Order[] {
    if (userId) {
      return this.ordersService.findByUserId(Number(userId));
    }
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiFindOneOrder()
  findOne(@Param('id') id: string): Order {
    return this.ordersService.findOne(Number(id));
  }

  @Put(':id/status')
  @ApiUpdateOrderStatus()
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto
  ): Order {
    return this.ordersService.updateStatus(Number(id), updateStatusDto.status);
  }

  @Delete(':id')
  @ApiDeleteOrder()
  delete(@Param('id') id: string): { success: boolean } {
    const result = this.ordersService.delete(Number(id));
    if (!result) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return { success: true };
  }
} 