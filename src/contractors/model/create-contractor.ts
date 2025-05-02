import { Contractor } from '../entities/contractor.entity';

export type CreateContractor = Omit<Contractor, 'id' | 'invoices'>;
