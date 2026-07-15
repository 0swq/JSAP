// @ts-nocheck
import bcrypt from 'bcrypt';


import {generarToken} from '@config/jwt';
import {ApiError} from '@utils/ApiError';
import {ActualizarUsuarioDto, CrearUsuarioDto} from "@modules/usuarios/usuario.dto";
import {usuarioRepositorio} from "@modules/usuarios/usuario.repository";

const SALT_ROUNDS = 10;

export const usuarioServicio = {
    obtenerTodos() {
        return usuarioRepositorio.obtenerTodos();
    },

    async obtenerPorId(id: string) {
        const usuario = await usuarioRepositorio.obtenerPorId(id);
        if (!usuario) throw ApiError.noEncontrado('Usuario no encontrado');
        return usuario;
    },

    async crear(data: CrearUsuarioDto) {
        const {password, rolId, ...resto} = data;

        // Si no se envía rolId, se asigna el rol "estudiante" por defecto
        let idRolFinal = rolId;
        if (!idRolFinal) {
            const rolEstudiante = await usuarioRepositorio.obtenerRolPorNombre('estudiante');
            idRolFinal = rolEstudiante?.id;
            if (!idRolFinal) throw new ApiError(500, 'No se encontró el rol "estudiante" en la BD');
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        return usuarioRepositorio.crear({...resto, passwordHash, rolId: idRolFinal});
    },

    async actualizar(id: string, data: ActualizarUsuarioDto) {
        await usuarioServicio.obtenerPorId(id);
        const { password, ...resto } = data;
        const passwordHash = password
            ? await bcrypt.hash(password, SALT_ROUNDS)
            : undefined;
        return usuarioRepositorio.actualizar(id, { ...resto, passwordHash });
    },

    async eliminar(id: string) {
        await usuarioServicio.obtenerPorId(id);
        return usuarioRepositorio.eliminar(id);
    },

    async login(correo: string, password: string) {
        const usuario = await usuarioRepositorio.obtenerPorCorreoConHash(correo);
        if (!usuario) throw ApiError.noAutorizado('Credenciales incorrectas');

        const esValido = await bcrypt.compare(password, usuario.passwordHash!);
        if (!esValido) throw ApiError.noAutorizado('Credenciales incorrectas');

        const token = generarToken({id: usuario.id, rolId: usuario.rolId, correo: usuario.correo!});
        const {passwordHash, ...usuarioSinHash} = usuario;
        return {token, usuario: usuarioSinHash};
    },
};