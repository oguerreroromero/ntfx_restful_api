import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class ListMovieDto {
  @IsOptional()
  @IsInt({ message: 'El límite debe ser un número' })
  @Min(50, { message: 'El límite debe ser mayor o igual a 50' })
  @Max(1000, { message: 'El límite debe ser menor o igual a 1000' })
  limit?: number;

  @IsOptional()
  @IsInt({ message: 'El número de pagina debe ser un entero.' })
  page?: number;
}
