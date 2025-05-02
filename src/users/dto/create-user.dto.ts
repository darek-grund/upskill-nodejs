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

  @IsBoolean()
  @IsOptional()
  canLogin?: boolean;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  notifyByEmail?: boolean;

  @IsBoolean()
  @IsOptional()
  notifyByPhone?: boolean;
}
