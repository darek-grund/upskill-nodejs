import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { mapToNewUser, mapToUserDto } from './mappers/user.dto.mapper';
import { UserDto } from './dto/user.dto';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async getAllUsers(): Promise<UserDto[]> {
    const users = await this.usersService.findAll();
    return users.map(mapToUserDto);
  }

  @Get('search')
  public async getUserByEmail(
    @Query('email') email: string,
  ): Promise<UserDto | null> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email=${email} not found`);
    }

    return mapToUserDto(user);
  }

  @Get(':id')
  public async getUser(@Param('id') id: number): Promise<UserDto | null> {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with id=${id} not found`);
    }

    return mapToUserDto(user);
  }

  @Post()
  public async createUser(
    @Body() newUserDto: CreateUserDto,
  ): Promise<UserDto | null> {
    const newUser = mapToNewUser(newUserDto);
    const user = await this.usersService.create(newUser);
    return mapToUserDto(user);
  }
}
