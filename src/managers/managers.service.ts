import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manager } from './entities/manager.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateManager } from './model/create-manager';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
  ) {}

  public async findAll(): Promise<Manager[]> {
    return this.managerRepository.find();
  }

  public async findOneById(id: number): Promise<Manager | null> {
    return this.managerRepository.findOneBy({
      id,
    });
  }

  public async create(manager: CreateManager): Promise<Manager> {
    return this.managerRepository.save(manager);
  }
}
