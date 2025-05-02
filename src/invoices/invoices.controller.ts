import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { mapToNewInvoice, mapToInvoiceDto } from './mappers/invoice.dto.mapper';
import { InvoiceDto } from './dto/invoice.dto';

@Controller('/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  public async getAllInvoices(): Promise<InvoiceDto[]> {
    const invoices = await this.invoicesService.findAll();
    return invoices.map(mapToInvoiceDto);
  }

  @Get('search')
  public async getInvoiceByNumber(
    @Query('number') number: string,
  ): Promise<InvoiceDto | null> {
    const invoice = await this.invoicesService.findOneByNumber(number);

    if (!invoice) {
      throw new NotFoundException(`Invoice with number=${number} not found`);
    }

    return mapToInvoiceDto(invoice);
  }

  @Post()
  public async createInvoice(
    @Body() newInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceDto | null> {
    const newInvoice = mapToNewInvoice(newInvoiceDto);
    const invoice = await this.invoicesService.create(newInvoice);
    return mapToInvoiceDto(invoice);
  }

  @Get('last-month')
  public async getLastMonthInvoices(): Promise<InvoiceDto[]> {
    const invoices = await this.invoicesService.findLastMonthInvoices();
    return invoices.map(mapToInvoiceDto);
  }
}
