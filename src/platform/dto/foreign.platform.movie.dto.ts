import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class ForeignPlatformMovieDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'La pelicula no pudo ser relacionada correctamente.' })
  _id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
