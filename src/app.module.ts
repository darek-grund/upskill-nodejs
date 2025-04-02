import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ManagersModule } from './managers/managers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './common/config/database/database.config';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    UsersModule,
    ManagersModule,
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    ScheduleModule.forRoot(),
    CronModule,
    NotificationsModule,
  ],
})
export class AppModule {}
