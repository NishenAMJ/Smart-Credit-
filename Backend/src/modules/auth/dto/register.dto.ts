import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsEnum } from 'class-validator';

export enum UserRole {
  BORROWER = 'borrower',
  LENDER = 'lender',
  ADMIN = 'admin',
}

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    },
  )
  password: string;

  @IsEnum(UserRole, { message: 'Role must be one of: borrower, lender, admin' })
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRole;
}
