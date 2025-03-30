import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
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
    try {
      return await this.managerRepository.find({
        relations: ['user']
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching managers');
    }
  }

  public async findOneById(id: number): Promise<Manager | null> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid manager ID');
    }

    try {
      return await this.managerRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching manager');
    }
  }

  public async create(
    manager: CreateManager,
    queryRunner?: QueryRunner,
  ): Promise<Manager> {
    if (!manager.firstName || !manager.lastName) {
      throw new BadRequestException('Invalid manager data');
    }

    try {
      if (queryRunner) {
        return await queryRunner.manager.save(Manager, manager);
      }
      return await this.managerRepository.save(manager);
    } catch (error) {
      throw new InternalServerErrorException('Error creating manager');
    }
  }
}
