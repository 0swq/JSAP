// @ts-nocheck
export interface CrearUsuarioDto {
    rolId: string;
    nombre?: string;
    apellidos?: string;
    dni?: string;
    correo?: string;
    password: string;
}

export interface ActualizarUsuarioDto {
    rolId?: string;
    nombre?: string;
    apellidos?: string;
    dni?: string;
    correo?: string;
    password?: string;
}

export interface RespuestaUsuarioDto {
    id: string;
    rolId: string;
    nombre: string | null;
    apellidos: string | null;
    dni: string | null;
    correo: string | null;
    creadoEn: Date;
}