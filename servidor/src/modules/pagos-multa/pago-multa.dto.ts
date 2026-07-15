// @ts-nocheck
export interface CrearPagoMultaDto {
  multaId: string;
  montoPagado: number;
  metodoPago: string;
}

export interface ActualizarPagoMultaDto {
  montoPagado?: number;
  metodoPago?: string;
}

export interface RespuestaPagoMultaDto {
  id: string;
  multaId: string;
  montoPagado: number;
  metodoPago: string;
  creadoEn: Date;
}
