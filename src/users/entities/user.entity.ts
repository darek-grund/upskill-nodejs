import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { Manager } from '../../managers/entities/manager.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Index()
  email: string;

  @Column({ length: 50 })
  password: string;

  @OneToOne(() => Manager, (manager) => manager.user)
  manager: Manager;
}
