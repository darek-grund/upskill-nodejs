import { DataSourceOptions } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Manager } from '../../../managers/entities/manager.entity';
import { Notification } from '../../../notifications/entities/notification.entity';
import { Contractor } from 'src/contractors/entities/contractor.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';

export default {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'upskill-nodejs',
  entities: [User, Manager, Notification, Contractor, Invoice],
  synchronize: true,
} satisfies DataSourceOptions;
