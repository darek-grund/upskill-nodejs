import { EntityRepository, Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';

@EntityRepository(Invoice)
export class InvoicesRepository extends Repository<Invoice> {}
