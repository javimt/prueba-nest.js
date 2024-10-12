import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateCustomerDto {
    @IsOptional()
    name?: string;
    
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsPhoneNumber('CO') 
    phoneNumber?: string;

}
