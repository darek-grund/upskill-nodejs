import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @MaxLength(100)
  email: string;

  @MinLength(8)
  @MaxLength(50)
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  notifyByEmail: boolean;

  @IsBoolean()
  notifyByPhone: boolean;
}
