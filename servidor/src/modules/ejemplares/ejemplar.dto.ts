// @ts-nocheck
export interface CrearEjemplarDto {
  libroId: string;
  codigoBarras: string;
  estado?: string;
  ubicacion?: string;
  fechaAdquisicion?: Date;
}

export interface ActualizarEjemplarDto {
  libroId?: string;
  codigoBarras?: string;
  estado?: string;
  ubicacion?: string;
  fechaAdquisicion?: Date;
}

export interface RespuestaEjemplarDto {
  id: string;
  libroId: string;
  codigoBarras: string;
  estado: string;
  ubicacion: string | null;
  fechaAdquisicion: Date | null;
  creadoEn: Date;
}
