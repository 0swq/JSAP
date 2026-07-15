// @ts-nocheck
export interface CrearRolDto {
  nombre: string;
  descripcion?: string;
}

export interface ActualizarRolDto {
  nombre?: string;
  descripcion?: string;
}

export interface RespuestaRolDto {
  id: string;
  nombre: string;
  descripcion: string | null;
  creadoEn: Date;
}
