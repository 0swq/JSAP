// @ts-nocheck
export interface CrearEditorialDto {
  nombre?: string;
  pais?: string;
}

export interface ActualizarEditorialDto {
  nombre?: string;
  pais?: string;
}

export interface RespuestaEditorialDto {
  id: string;
  nombre: string | null;
  pais: string | null;
  creadoEn: Date;
}
