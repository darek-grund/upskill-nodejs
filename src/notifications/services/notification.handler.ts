export interface NotificationService {
  push(notification: Record<string, any>): Promise<void>;
}

export interface NotificationRepository {
  save(notification: Record<string, any>): Promise<void>;
  findAll(): Promise<Record<string, any>[]>;
}

export class NotificationHandler {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async handle(notification: Record<string, any>): Promise<void> {
    await this.notificationService.push(notification);
    await this.notificationRepository.save(notification);
  }
}
