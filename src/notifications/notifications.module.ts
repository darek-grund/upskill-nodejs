import { Module } from '@nestjs/common';
import { SmsService } from './services/sms.service';
import { EmailService } from './services/email.service';
import { HashMapNotificationRepository } from './repositories/notification.repository';
import { NotificationsService } from './services/notifications.service';

@Module({
  providers: [
    SmsService,
    EmailService,
    NotificationsService,
    HashMapNotificationRepository,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
