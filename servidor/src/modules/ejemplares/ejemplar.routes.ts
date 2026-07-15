// @ts-nocheck
import { Router } from 'express';
import { ejemplarControlador } from './ejemplar.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearEjemplarSchema, actualizarEjemplarSchema } from './ejemplar.validator';

const router = Router();
router.use(middlewareAutenticacion);

// Ruta pública para que cualquier usuario autenticado pueda ver ejemplares por libro (ej: al reservar)
router.get('/libro/:libroId', middlewareRol(['admin', 'bibliotecario', 'docente', 'estudiante']), ejemplarControlador.obtenerPorLibro);

// Las demás rutas requieren admin o bibliotecario
router.use(middlewareRol(['admin', 'bibliotecario']));
router.get('/', ejemplarControlador.obtenerTodos);
router.get('/:id', ejemplarControlador.obtenerPorId);
router.post('/', validar(crearEjemplarSchema), ejemplarControlador.crear);
router.patch('/:id', validar(actualizarEjemplarSchema), ejemplarControlador.actualizar);
router.delete('/:id', ejemplarControlador.eliminar);

export default router;
