import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
    ) {}

    async create(customerData: Partial<Customer>): Promise<Customer> {
        const { password } = customerData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const customer = this.customersRepository.create({ ...customerData, password: hashedPassword });
        return this.customersRepository.save(customer);
    }

    async findAll(email?: string): Promise<Customer[]> {
        const query = this.customersRepository.createQueryBuilder('customer');
        if (email) {
            query.where('customer.email = :email', { email });
        }
        return query.getMany();
    }

    async update(id: number, customerData: Partial<Customer>): Promise<Customer> {
        await this.customersRepository.update(id, customerData);
        return this.customersRepository.findOne({ where: { id } });
    }

    async remove(id: number): Promise<void> {
        await this.customersRepository.delete(id);
    }
}
