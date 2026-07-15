export class ApiError extends Error {
    codigoEstado: number;
    errores: any[];
    esOperacional: boolean;

    constructor(codigoEstado: number, mensaje: string, errores: any[] = []) {
        super(mensaje);
        this.codigoEstado = codigoEstado;
        this.errores = errores;
        this.esOperacional = true;
        Error.captureStackTrace(this, this.constructor);
    }

    static solicitudIncorrecta(mensaje = 'Solicitud incorrecta', errores: any[] = []) {
        return new ApiError(400, mensaje, errores);
    }

    static noAutorizado(mensaje = 'No autorizado') {
        return new ApiError(401, mensaje);
    }

    static accesoDenegado(mensaje = 'Acceso denegado') {
        return new ApiError(403, mensaje);
    }

    static noEncontrado(mensaje = 'Recurso no encontrado') {
        return new ApiError(404, mensaje);
    }

    static conflicto(mensaje = 'Conflicto') {
        return new ApiError(409, mensaje);
    }

    static errorInterno(mensaje = 'Error interno del servidor') {
        return new ApiError(500, mensaje);
    }
}