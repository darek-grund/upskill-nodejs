import { Exclude } from 'class-transformer';
import { IsEmpty, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

export class CreateManagerDto extends CreateUserDto {
  @MaxLength(50)
  @IsNotEmpty()
  firstName: string;

  @MaxLength(50)
  @IsNotEmpty()
  lastName: string;
}
