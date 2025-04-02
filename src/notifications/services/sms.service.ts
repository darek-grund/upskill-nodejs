import { NotificationService } from './notification.handler';

export class SmsService implements NotificationService {
  public async push(notification: Record<string, any>): Promise<void> {
    console.log('SMS sent to:', notification.to);
  }
}
