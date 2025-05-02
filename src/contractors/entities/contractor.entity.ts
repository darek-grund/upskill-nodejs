import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Invoice } from 'src/invoices/entities/invoice.entity';

@Entity()
export class Contractor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  company: string;

  @OneToOne(() => User, (user) => user.contractor)
  @JoinColumn()
  user: User;

  @OneToMany(() => Invoice, (invoice) => invoice.contractor)
  invoices: Invoice[];
}
