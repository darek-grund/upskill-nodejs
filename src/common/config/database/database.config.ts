import { DataSourceOptions } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Manager } from '../../../managers/entities/manager.entity';
import { Notification } from '../../../notifications/entities/notification.entity';
import { Contractor } from 'src/contractors/entities/contractor.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';

export default {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Manager, Notification, Contractor, Invoice],
  synchronize: true,
} satisfies DataSourceOptions;
