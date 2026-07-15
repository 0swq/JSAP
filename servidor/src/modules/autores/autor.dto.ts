// @ts-nocheck
export interface CrearAutorDto {
  nombre?: string;
  apellidos: string;
  nacionalidad?: string;
  biografia?: string;
  fotoUrl?: string;
  fechaNacimiento?: Date;
}

export interface ActualizarAutorDto {
  nombre?: string;
  apellidos?: string;
  nacionalidad?: string;
  biografia?: string;
  fotoUrl?: string;
  fechaNacimiento?: Date;
}

export interface RespuestaAutorDto {
  id: string;
  nombre: string | null;
  apellidos: string;
  nacionalidad: string | null;
  biografia: string | null;
  fotoUrl: string | null;
  fechaNacimiento: Date | null;
  creadoEn: Date;
}
