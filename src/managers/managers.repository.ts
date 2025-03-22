import { Repository } from 'typeorm';
import { Manager } from './entities/manager.entity';
import { CreateManager } from './model/create-manager';

export interface ManagersRepository {
  findById(id: number): Promise<Manager | null>;
  saveNew(manager: CreateManager): Promise<Manager>;
}

export class DatabaseManagersRepository
  extends Repository<Manager>
  implements ManagersRepository
{
  public async findById(id: number): Promise<Manager | null> {
    return this.findOneBy({
      id,
    });
  }

  public async saveNew(manager: CreateManager): Promise<Manager> {
    return this.save(manager);
  }
}
