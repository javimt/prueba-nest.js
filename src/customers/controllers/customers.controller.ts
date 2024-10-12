import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      return await this.customersService.create(createCustomerDto);
    } catch (err) {
      // Manejo de errores: Si existe un conflicto (ej. email ya existente)
      if (err.code === '23505') {
        throw new ConflictException('Email already exists.');
      }
      throw new InternalServerErrorException('Error creating the customer');
    }
  }

  @Get()
  async findAll(@Query('email') email?: string) {
    return this.customersService.findAll(email);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customer = await this.customersService.findOne(Number(id));
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const updatedCustomer = await this.customersService.update(
      id,
      updateCustomerDto,
    );
    if (!updatedCustomer) {
      throw new NotFoundException('Customer not found');
    }
    return updatedCustomer;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.customersService.remove(id);
    return { deleted: true };
  }
}
