import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationsService } from 'src/notifications/services/notifications.service';

const EVERY_25TH_DAY_BEFORE_END_OF_MONTH_AT_MIDNIGHT = '0 0 0 25 * *';

@Injectable()
export class CronService {
  constructor(private notificationService: NotificationsService) {}

  @Cron(EVERY_25TH_DAY_BEFORE_END_OF_MONTH_AT_MIDNIGHT)
  handleCron() {
    this.notificationService.publishNotifications();
  }
}
