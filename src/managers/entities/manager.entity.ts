import { User } from 'src/users/entities/user.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class Manager extends User {
  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;
}
