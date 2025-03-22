import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ManagersModule } from './managers/managers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './common/config/database/database.config';

@Module({
  imports: [UsersModule, ManagersModule, TypeOrmModule.forRoot(databaseConfig)],
})
export class AppModule {}
