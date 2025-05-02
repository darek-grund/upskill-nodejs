import { CreateContractorDto } from '../dto/create-contractor.dto';
import { Contractor } from '../entities/contractor.entity';
import { CreateContractor } from '../model/create-contractor';
import { ContractorDto } from '../dto/contractor.dto';
import { User } from 'src/users/entities/user.entity';

export const mapToNewContractor = (
  newContractorDto: CreateContractorDto,
  user: User,
): CreateContractor => ({
  company: newContractorDto.company,
  user,
});

export const mapToContractorDto = (contractor: Contractor): ContractorDto => {
  return {
    id: contractor.id,
    email: contractor.user.email,
    company: contractor.company,
    invoices: contractor.invoices,
  };
};
