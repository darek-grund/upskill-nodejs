import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUser } from './model/create-user';

export interface UsersRepository {
  findById(id: number): Promise<User | null>;
  saveNew(user: CreateUser): Promise<User>;
}

export class DatabaseUsersRepository
  extends Repository<User>
  implements UsersRepository
{
  public async findById(id: number): Promise<User | null> {
    return this.findOneBy({
      id,
    });
  }

  public async saveNew(user: CreateUser): Promise<User> {
    return this.save(user);
  }
}
