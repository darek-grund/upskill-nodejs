import { Contractor } from 'src/contractors/entities/contractor.entity';

export class InvoiceDto {
  id: number;
  number: string;
  amount: number;
  createdAt: Date;
  contractor: Contractor;
}
