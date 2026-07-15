// @ts-nocheck
import { Router } from 'express';
import { recursoDigitalControlador } from './recurso-digital.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearRecursoDigitalSchema, actualizarRecursoDigitalSchema } from './recurso-digital.validator';

const router = Router();

router.get('/', recursoDigitalControlador.obtenerTodos);
router.get('/libro/:libroId', recursoDigitalControlador.obtenerPorLibro);
router.get('/:id', recursoDigitalControlador.obtenerPorId);

router.use(middlewareAutenticacion);
router.post('/', middlewareRol(['admin', 'bibliotecario']), validar(crearRecursoDigitalSchema), recursoDigitalControlador.crear);
router.patch('/:id', middlewareRol(['admin', 'bibliotecario']), validar(actualizarRecursoDigitalSchema), recursoDigitalControlador.actualizar);
router.delete('/:id', middlewareRol(['admin', 'bibliotecario']), recursoDigitalControlador.eliminar);

export default router;
