import { NotificationService } from './notification.handler';

export class EmailService implements NotificationService {
  public async push(notification: Record<string, any>): Promise<void> {
    console.log('Email sent to:', notification.to);
  }
}
