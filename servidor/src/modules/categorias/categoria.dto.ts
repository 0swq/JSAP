// @ts-nocheck
export interface CrearCategoriaDto {
  nombre: string;
  padreId?: string;
  activa?: boolean;yui
}

export interface ActualizarCategoriaDto {
  nombre?: string;
  padreId?: string;
  activa?: boolean;

}

export interface RespuestaCategoriaDto {
  id: string;
  nombre: string;
  padreId: string | null;
  activa: boolean;
  creadoEn: Date;
}

