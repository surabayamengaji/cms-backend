import { IsString, IsEmail, Length, IsEnum, Matches } from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  @IsEnum(UserRole)
  role: string;
}
