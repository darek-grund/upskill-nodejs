import { Injectable } from '@nestjs/common';
import { Repository, QueryRunner } from 'typeorm';
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
    return await this.managerRepository.find({
      relations: ['user'],
    });
  }

  public async findOneById(id: number): Promise<Manager | null> {
    return await this.managerRepository.findOneBy({
      id,
    });
  }

  public async create(
    manager: CreateManager,
    queryRunner?: QueryRunner,
  ): Promise<Manager> {
    if (queryRunner) {
      return await queryRunner.manager.save(Manager, manager);
    }
    return await this.managerRepository.save(manager);
  }
}
