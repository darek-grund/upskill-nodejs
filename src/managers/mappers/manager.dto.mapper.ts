import { CreateManagerDto } from '../dto/create-manager.dto';
import { Manager } from '../entities/manager.entity';
import { CreateManager } from '../model/create-manager';
import { ManagerDto } from '../dto/manager.dto';
import { User } from 'src/users/entities/user.entity';

export const mapToNewManager = (
  newManagerDto: CreateManagerDto,
  user: User,
): CreateManager => ({
  firstName: newManagerDto.firstName,
  lastName: newManagerDto.lastName,
  user,
});

export const mapToManagerDto = (manager: Manager): ManagerDto => ({
  id: manager.id,
  email: manager.user.email,
  firstName: manager.firstName,
  lastName: manager.lastName,
});
