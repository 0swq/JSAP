// @ts-nocheck
import { Router } from 'express';
import { resenaControlador } from './resena.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearResenaSchema, actualizarResenaSchema } from './resena.validator';

const router = Router();

router.get('/libro/:libroId', resenaControlador.obtenerPorLibro);

router.use(middlewareAutenticacion);
router.get('/mis-resenas', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), resenaControlador.misResenas);
router.get('/:id', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), resenaControlador.obtenerPorId);
router.post('/', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), validar(crearResenaSchema), resenaControlador.crear);
router.patch('/:id', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), validar(actualizarResenaSchema), resenaControlador.actualizar);
router.delete('/:id', middlewareRol(['admin', 'bibliotecario']), resenaControlador.eliminar);

export default router;
