// Étape 1 — Importe IsOptional, IsNumber, IsString, Min depuis class-validator
// Importe Type depuis class-transformer

import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryProductDto {
  // Étape 2 — page : number optionnel, minimum 1, défaut 1
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  // Étape 3 — limit : number optionnel, minimum 1, défaut 10
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  // Étape 4 — search : string optionnel (recherche par nom)
  @IsOptional()
  @IsString()
  search?: string;

  // Étape 5 — minPrice : number optionnel
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  // Étape 6 — maxPrice : number optionnel
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  // Étape 7 — categoryId : number optionnel
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;
}
