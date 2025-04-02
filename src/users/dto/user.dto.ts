export interface UserDto {
  id: number;
  email: string;
  phone?: string;
  notifyByEmail: boolean;
  notifyByPhone: boolean;
}
