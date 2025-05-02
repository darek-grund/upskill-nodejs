import { Invoice } from '../entities/invoice.entity';
import { InvoiceDto } from '../dto/invoice.dto';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { CreateInvoice } from '../model/create-invoice';

export const mapToInvoiceDto = (invoice: Invoice): InvoiceDto => ({
  id: invoice.id,
  number: invoice.number,
  amount: invoice.amount,
  createdAt: invoice.createdAt,
  contractor: invoice.contractor,
});

export const mapToNewInvoice = (
  invoiceDto: CreateInvoiceDto,
): CreateInvoice => ({
  number: invoiceDto.number,
  amount: invoiceDto.amount,
});
