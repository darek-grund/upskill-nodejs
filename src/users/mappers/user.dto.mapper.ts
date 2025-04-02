import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { CreateUser } from '../model/create-user';
import { UserDto } from '../dto/user.dto';

export const mapToNewUser = (newUserDto: CreateUserDto): CreateUser => ({
  email: newUserDto.email,
  password: newUserDto.password,
  phone: newUserDto.phone,
  notifyByEmail: newUserDto.notifyByEmail,
  notifyByPhone: newUserDto.notifyByPhone,
});

export const mapToUserDto = (user: User): UserDto => ({
  id: user.id,
  email: user.email,
  phone: user.phone,
  notifyByEmail: user.notifyByEmail,
  notifyByPhone: user.notifyByPhone,
});
