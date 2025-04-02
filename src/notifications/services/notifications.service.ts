import { Injectable } from '@nestjs/common';
import { HashMapNotificationRepository } from '../repositories/notification.repository';
import { EmailService } from './email.service';
import { NotificationHandler } from './notification.handler';
import { SmsService } from './sms.service';
import { EmailNotification } from '../model/email-notification';
import { SmsNotification } from '../model/sms-notification';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepository: HashMapNotificationRepository,
  ) {}

  public async publishEmail(
    emailNotification: EmailNotification,
  ): Promise<void> {
    const emailService = new EmailService();
    const emailHandler = new NotificationHandler(
      emailService,
      this.notificationRepository,
    );

    await emailHandler.handle(emailNotification);
  }

  public async publishSMS(smsNotification: SmsNotification) {
    const smsService = new SmsService();
    const smsHandler = new NotificationHandler(
      smsService,
      this.notificationRepository,
    );

    await smsHandler.handle(smsNotification);
  }

  public async publishNotifications() {
    // TODO Get the users who haven't issued an invoice yet.
    const recipients: UserDto[] = [
      {
        id: 1,
        email: 'test@test.com',
        phone: '+48 123 123 123',
        notifyByEmail: true,
        notifyByPhone: true,
      },
    ];

    const emailRecipients = recipients
      .map((recipient) => recipient.notifyByEmail && recipient.email)
      .filter((email) => email);

    if (emailRecipients.length) {
      await this.publishEmail({
        to: emailRecipients,
        body: 'email body',
        subject: 'subject',
      });
    }

    const smsRecipients = recipients
      .map((recipient) => recipient.notifyByPhone && recipient.phone)
      .filter((phone) => phone);

    if (smsRecipients) {
      this.publishSMS({
        to: smsRecipients,
        body: 'sms body',
      });
    }
  }
}
