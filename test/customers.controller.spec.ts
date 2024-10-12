import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CustomersService } from '../src/customers/services/customers.service';
import { Customer } from '../src/customers/entities/customer.entity';
import { CreateCustomerDto } from '../src/customers/dtos/create-customer.dto';
import { UpdateCustomerDto } from '../src/customers/dtos/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }
  @Get()
  async findAll(@Query('email') email?: string) {
    return this.customersService.findAll(email);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.customersService.remove(id);
    return { deleted: true };
  }
}
