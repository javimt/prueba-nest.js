import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const { email, password } = createCustomerDto;

    // Verifica si el email ya existe
    const existingCustomer = await this.customersRepository.findOne({
      where: { email },
    });
    if (existingCustomer) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = this.customersRepository.create({
      ...createCustomerDto,
      password: hashedPassword,
    });
    return this.customersRepository.save(customer);
  }

  async findAll(email?: string): Promise<Customer[]> {
    const query = this.customersRepository.createQueryBuilder('customer');
    if (email) {
      query.where('customer.email = :email', { email });
    }
    return query.getMany();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customersRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customerExists = await this.customersRepository.findOne({
      where: { id },
    });
    if (!customerExists) {
      throw new NotFoundException('Customer not found');
    }

    await this.customersRepository.update(id, updateCustomerDto);
    return this.customersRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.customersRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException('Customer not found');
    }
    return result;
}
}
