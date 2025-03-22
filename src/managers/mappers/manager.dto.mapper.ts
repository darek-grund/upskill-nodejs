import { CreateManagerDto } from '../dto/create-manager.dto';
import { Manager } from '../entities/manager.entity';
import { CreateManager } from '../model/create-manager';
import { ManagerDto } from '../dto/manager.dto';

export const mapToNewManager = (
  newManagerDto: CreateManagerDto,
): CreateManager => ({
  email: newManagerDto.email,
  password: newManagerDto.password,
  firstName: newManagerDto.firstName,
  lastName: newManagerDto.lastName,
});

export const mapToManagerDto = (manager: Manager): ManagerDto => ({
  id: manager.id,
  email: manager.email,
  firstName: manager.firstName,
});
