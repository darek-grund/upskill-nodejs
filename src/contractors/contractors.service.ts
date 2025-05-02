import { Injectable } from '@nestjs/common';
import { Repository, QueryRunner } from 'typeorm';
import { Contractor } from './entities/contractor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContractor } from './model/create-contractor';

@Injectable()
export class ContractorsService {
  constructor(
    @InjectRepository(Contractor)
    private contractorRepository: Repository<Contractor>,
  ) {}

  public async findAll(): Promise<Contractor[]> {
    return await this.contractorRepository.find({
      relations: ['user', 'invoices'],
    });
  }

  public async findOneById(id: number): Promise<Contractor | null> {
    return await this.contractorRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  public async create(
    contractor: CreateContractor,
    queryRunner?: QueryRunner,
  ): Promise<Contractor> {
    if (queryRunner) {
      return await queryRunner.manager.save(Contractor, contractor);
    }
    return await this.contractorRepository.save(contractor);
  }
}
