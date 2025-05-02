import { Module } from '@nestjs/common';
import { ContractorsController } from './contractors.controller';
import { ContractorsService } from './contractors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contractor } from './entities/contractor.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Contractor])],
  controllers: [ContractorsController],
  providers: [ContractorsService],
})
export class ContractorsModule {}
