import { IsInt, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreateInvoiceDto {
  @MaxLength(15)
  @IsNotEmpty()
  number: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsInt()
  contractorId: number;
}
