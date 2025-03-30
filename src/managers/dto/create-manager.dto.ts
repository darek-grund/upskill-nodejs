import { IsNotEmpty, MaxLength } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateManagerDto extends CreateUserDto {
  @MaxLength(50)
  @IsNotEmpty()
  firstName: string;

  @MaxLength(50)
  @IsNotEmpty()
  lastName: string;
}
