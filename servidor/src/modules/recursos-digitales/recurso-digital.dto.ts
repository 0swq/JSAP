// @ts-nocheck
export interface CrearRecursoDigitalDto {
  libroId: string;
  tipo: string;
  url: string;
  formato?: string;
}

export interface ActualizarRecursoDigitalDto {
  libroId?: string;
  tipo?: string;
  url?: string;
  formato?: string;
}

export interface RespuestaRecursoDigitalDto {
  id: string;
  libroId: string;
  tipo: string;
  url: string;
  formato: string | null;
  creadoEn: Date;
}
