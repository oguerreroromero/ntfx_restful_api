import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'El campo titulo no es válido' })
  title: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'El campo imagen no es válido' })
  image: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'El campo director no es válido' })
  director: string;
}
