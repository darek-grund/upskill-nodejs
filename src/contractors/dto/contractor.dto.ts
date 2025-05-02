import { Invoice } from 'src/invoices/entities/invoice.entity';

export interface ContractorDto {
  id: number;
  email: string;
  company: string;
  invoices: Invoice[];
}
