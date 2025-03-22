import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUser } from './model/create-user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({
      id,
    });
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        email: Like(`%${email}%`),
      },
    });
  }

  public async create(user: CreateUser): Promise<User> {
    return this.userRepository.save(user);
  }
}
