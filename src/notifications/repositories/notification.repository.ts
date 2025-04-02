import { NotificationRepository } from '../services/notification.handler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashMapNotificationRepository implements NotificationRepository {
  private readonly notifications: Record<string, any>[] = [];

  public async save(notification: Record<string, any>): Promise<void> {
    this.notifications.push(notification);
  }

  public async findAll(): Promise<Record<string, any>[]> {
    return this.notifications;
  }
}
