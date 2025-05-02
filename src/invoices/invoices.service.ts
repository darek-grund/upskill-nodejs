import { Injectable } from '@nestjs/common';
import { Repository, Like, QueryRunner, MoreThanOrEqual } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInvoice } from './model/create-invoice';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  public async findAll(): Promise<Invoice[]> {
    return this.invoiceRepository.find({ relations: ['contractor'] });
  }

  public async findOneById(id: number): Promise<Invoice | null> {
    return this.invoiceRepository.findOneBy({
      id,
    });
  }

  public async findOneByNumber(number: string): Promise<Invoice | null> {
    return this.invoiceRepository.findOne({
      where: {
        number: Like(`%${number}%`),
      },
    });
  }

  public async create(
    invoice: CreateInvoice,
    queryRunner?: QueryRunner,
  ): Promise<Invoice> {
    if (queryRunner) {
      return queryRunner.manager.save(Invoice, invoice);
    }
    return this.invoiceRepository.save(invoice);
  }

  public async update(
    id: number,
    invoice: Partial<Invoice>,
  ): Promise<Invoice | null> {
    const existingInvoice = await this.findOneById(id);
    return this.invoiceRepository.save({ ...existingInvoice, ...invoice });
  }

  public async findLastMonthInvoices(): Promise<Invoice[]> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return this.invoiceRepository.find({
      where: {
        createdAt: MoreThanOrEqual(oneMonthAgo),
      },
    });
  }
}
