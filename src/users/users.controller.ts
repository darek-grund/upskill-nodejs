import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { mapToNewUser, mapToUserDto } from './mappers/user.dto.mapper';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/users')
export class UsersController {
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async getAllUsers(): Promise<UserDto[]> {
    try {
      const users = await this.usersService.findAll();
      return users.map(mapToUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Get('search')
  public async getUserByEmail(
    @Query('email') email: string,
  ): Promise<UserDto | null> {
    if (!this.emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    try {
      const user = await this.usersService.findOneByEmail(email);

      if (!user) {
        throw new NotFoundException(`User with email=${email} not found`);
      }

      return mapToUserDto(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error processing request');
    }
  }

  @Get(':id')
  public async getUser(@Param('id') id: number): Promise<UserDto | null> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      const user = await this.usersService.findOneById(id);

      if (!user) {
        throw new NotFoundException(`User with id=${id} not found`);
      }

      return mapToUserDto(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error processing request');
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  public async createUser(
    @Body() newUserDto: CreateUserDto,
  ): Promise<UserDto | null> {
    if (!this.emailRegex.test(newUserDto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    if (newUserDto.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    try {
      const newUser = mapToNewUser(newUserDto);
      const user = await this.usersService.create(newUser);
      return mapToUserDto(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }
}
