import {
  IsArray,
  ValidateNested,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ForeignPlatformMovieDto } from '../../platform/dto/foreign.platform.movie.dto';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string; // Nombre de la película. Ejemplo: Spiderman 2: El Retorno

  @IsString()
  @IsOptional()
  slug: string; // URL de la película basado en el título. Este campo se debe generar en el backend. Ejemplo: spiderman-2-el-retorno

  @IsString()
  @IsNotEmpty()
  image: string; // Logo o imagen principal de la película. Ejemplo: spiderman-2.jpg

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Valida cada objeto en el array
  @Type(() => ForeignPlatformMovieDto) // Indica el tipo de clase a utilizar para la validación
  platforms: ForeignPlatformMovieDto[];
}
