import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [CronService],
})
export class CronModule {}
