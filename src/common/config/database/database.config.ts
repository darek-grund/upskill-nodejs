import { DataSourceOptions } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Manager } from '../../../managers/entities/manager.entity';
import { Notification } from '../../../notifications/entities/notification.entity';

export default {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'upskill-nodejs',
  entities: [User, Manager, Notification],
  synchronize: true,
} satisfies DataSourceOptions;
