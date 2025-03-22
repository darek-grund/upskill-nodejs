import { Manager } from '../entities/manager.entity';

export type CreateManager = Omit<Manager, 'id'>;
