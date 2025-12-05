import { ApiProperty, PickType } from '@nestjs/swagger';

import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { MatchPassword } from 'src/common/helper/matchPassword';

export class CreateUserDto {
  @ApiProperty({
    example: 'luzadca@gmail.com',
    description: 'El Email debe ser Valido',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Adri Nieto',
    description: 'El nombre del Usuario',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @ApiProperty({
    example: 'Contraseña123*',
    description:
      'La contraseña debe contener mayusculas, minusculas, numeros y caracteres especiales',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message:
      'La contraseña debe contener al menos una minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*)',
  })
  password: string;

  @ApiProperty({
    example: 'Contraseña123*',
    description: 'La Confirmacion debe ser igual a la contraseña',
  })
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  @ApiProperty({
    example: 'Calle 123*',
    description: 'Debe contener una direccion',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  @ApiProperty({
    example: '3157615003',
    description: 'El telefono debe ser valido',
  })
  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @ApiProperty({
    example: 'Colombia',
    description: 'El pais del usuario',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  country?: string;

  @ApiProperty({
    example: 'Armenia',
    description: 'Ciudad del usuario',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  city?: string;

  @ApiProperty({
    example: false,
    description: 'Campo asignado por el sistema — no debe ser enviado',
    readOnly: true,
  })
  @IsEmpty()
  isAdmin?: boolean;
}

export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
