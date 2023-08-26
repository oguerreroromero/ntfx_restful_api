import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsNumber({}, { message: 'El valor de score debe ser un número' })
  @Min(0, { message: 'La calificación comienza en 0' })
  @Max(5, { message: 'La calificación no puede ser mayor que 5' })
  score: number;

  @IsNotEmpty()
  @IsMongoId({ message: 'La pelicula no pudo ser relacionada correctamente.' })
  movie_id: string;

  @IsNotEmpty()
  @IsMongoId({
    message: 'La plataforma no pudo ser relacionada correctamente.',
  })
  platform_id: string;
}
