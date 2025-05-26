import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('carts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @Roles('admin', 'customer')
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.cartsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'customer')
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(+id);
  }

  @Get('customer/:customerId')
  @Roles('admin', 'customer')
  findByCustomerId(@Param('customerId') customerId: string) {
    return this.cartsService.findByCustomerId(+customerId);
  }

  @Patch(':id')
  @Roles('admin', 'customer')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(+id, updateCartDto);
  }

  @Delete(':id')
  @Roles('admin', 'customer')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(+id);
  }
} 