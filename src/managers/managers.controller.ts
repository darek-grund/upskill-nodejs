import { Body, Controller, Get, Post } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { mapToNewManager, mapToManagerDto } from './mappers/manager.dto.mapper';
import { ManagerDto } from './dto/manager.dto';
import { UsersService } from 'src/users/users.service';
import { mapToNewUser } from 'src/users/mappers/user.dto.mapper';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Controller('/managers')
export class ManagersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly managersService: ManagersService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  public async getAllManagers(): Promise<ManagerDto[]> {
    const managers = await this.managersService.findAll();
    return managers.map(mapToManagerDto);
  }

  @Post()
  public async createManager(
    @Body() newManagerDto: CreateManagerDto,
  ): Promise<ManagerDto | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUser = mapToNewUser(newManagerDto);
      const user = await this.usersService.create(newUser, queryRunner);

      const newManager = mapToNewManager(newManagerDto, user);
      const manager = await this.managersService.create(
        newManager,
        queryRunner,
      );

      await queryRunner.commitTransaction();
      return mapToManagerDto(manager);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
