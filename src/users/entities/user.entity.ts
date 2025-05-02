import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { Contractor } from 'src/contractors/entities/contractor.entity';
import { Manager } from 'src/managers/entities/manager.entity';

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

  @OneToOne(() => Contractor, (contractor) => contractor.user)
  contractor: Contractor;

  @Column({ default: true })
  canLogin?: boolean;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ default: true })
  notifyByEmail?: boolean;

  @Column({ default: false })
  notifyByPhone?: boolean;
}
