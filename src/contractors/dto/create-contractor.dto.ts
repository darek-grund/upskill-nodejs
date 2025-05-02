import { IsNotEmpty, MaxLength } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateContractorDto extends CreateUserDto {
  @MaxLength(50)
  @IsNotEmpty()
  company: string;
}
