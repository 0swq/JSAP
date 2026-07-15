// @ts-nocheck
import { prisma } from '../prisma';
import {ActualizarUsuarioDto, CrearUsuarioDto} from "@modules/usuarios/usuario.dto";

export const usuarioRepositorio = {
    obtenerTodos() {
        return prisma.usuario.findMany({
            omit: { passwordHash: true },
            include: { rol: true },
        });
    },
    obtenerPorId(id: string) {
        return prisma.usuario.findUnique({
            where: { id },
            omit: { passwordHash: true },
            include: { rol: true },
        });
    },
    obtenerPorCorreoConHash(correo: string) {
        return prisma.usuario.findUnique({
            where: { correo },
            include: { rol: true },
        });
    },
    obtenerRolPorNombre(nombre: string) {
        return prisma.rol.findUnique({ where: { nombre } });
    },
    crear(data: Omit<CrearUsuarioDto, 'password'> & { passwordHash?: string }) {
        return prisma.usuario.create({ data });
    },
    actualizar(id: string, data: Omit<ActualizarUsuarioDto, 'password'> & { passwordHash?: string }) {
        return prisma.usuario.update({ where: { id }, data });
    },

    eliminar(id: string) {
        return prisma.usuario.delete({ where: { id } });
    },
};