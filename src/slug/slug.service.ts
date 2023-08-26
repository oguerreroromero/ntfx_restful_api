import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SlugService {
  slug(descripcion: string): string {
    // Generar un slug a partir de la descripción
    return slugify(descripcion, {
      replacement: '-', // Carácter utilizado para reemplazar espacios y caracteres especiales
      remove: /[*+~.()'"!:@]/g, // Caracteres especiales a remover
      lower: true, // Convertir el slug a minúsculas
    });
  }
}
