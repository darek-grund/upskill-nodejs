import { Repository } from 'typeorm';
import { Contractor } from './entities/contractor.entity';
import { CreateContractor } from './model/create-contractor';

export interface ContractorsRepository {
  findById(id: number): Promise<Contractor | null>;
  saveNew(contractor: CreateContractor): Promise<Contractor>;
}

export class DatabaseContractorsRepository
  extends Repository<Contractor>
  implements ContractorsRepository
{
  public async findById(id: number): Promise<Contractor | null> {
    return this.findOneBy({
      id,
    });
  }

  public async saveNew(contractor: CreateContractor): Promise<Contractor> {
    return this.save(contractor);
  }
}
