import { Body, Controller, Get, Post } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { mapToNewManager, mapToManagerDto } from './mappers/manager.dto.mapper';
import { ManagerDto } from './dto/manager.dto';

@Controller('/managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Get()
  public async getAllManagers(): Promise<ManagerDto[]> {
    const managers = await this.managersService.findAll();
    return managers.map(mapToManagerDto);
  }

  @Post()
  public async createManager(
    @Body() newManagerDto: CreateManagerDto,
  ): Promise<ManagerDto | null> {
    const newManager = mapToNewManager(newManagerDto);
    const manager = await this.managersService.create(newManager);
    return mapToManagerDto(manager);
  }
}
