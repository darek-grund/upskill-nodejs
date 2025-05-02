import { Body, Controller, Get, Post, Patch, Param } from '@nestjs/common';
import { ContractorsService } from './contractors.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import {
  mapToNewContractor,
  mapToContractorDto,
} from './mappers/contractor.dto.mapper';
import { ContractorDto } from './dto/contractor.dto';
import { UsersService } from 'src/users/users.service';
import { mapToNewUser } from 'src/users/mappers/user.dto.mapper';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Controller('/contractors')
export class ContractorsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly contractorsService: ContractorsService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  public async getAllContractors(): Promise<ContractorDto[]> {
    const contractors = await this.contractorsService.findAll();
    return contractors.map(mapToContractorDto);
  }

  @Post()
  public async createContractor(
    @Body() newContractorDto: CreateContractorDto,
  ): Promise<ContractorDto | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUser = mapToNewUser(newContractorDto);
      const user = await this.usersService.create(newUser, queryRunner);

      const newContractor = mapToNewContractor(newContractorDto, user);
      const contractor = await this.contractorsService.create(
        newContractor,
        queryRunner,
      );

      await queryRunner.commitTransaction();
      return mapToContractorDto(contractor);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Patch(':id/can-login')
  public async updateContractorCanLogin(
    @Param('id') id: number,
    @Body() body: { canLogin: boolean },
  ): Promise<ContractorDto | null> {
    const contractor = await this.contractorsService.findOneById(id);

    await this.usersService.update(contractor.user.id, {
      canLogin: body.canLogin,
    });

    return mapToContractorDto(contractor);
  }
}
