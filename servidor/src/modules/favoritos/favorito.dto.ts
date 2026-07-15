// @ts-nocheck
export interface CrearFavoritoDto {
  usuarioId: string;
  libroId: string;
}

export interface RespuestaFavoritoDto {
  id: string;
  usuarioId: string;
  libroId: string;
  creadoEn: Date;
}
