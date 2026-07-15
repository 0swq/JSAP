// @ts-nocheck
import {Router} from 'express';
import {libroControlador} from './libro.controller';
import {middlewareAutenticacion} from '@middlewares/auth.middleware';
import {middlewareRol} from '@middlewares/role.middleware';
import {validar} from '@middlewares/validate.middleware';
import {crearLibroSchema, actualizarLibroSchema, filtroLibroSchema} from './libro.validator';

const router = Router();

router.get('/grafo', libroControlador.solicitarGrafo);
router.post("/grafoInformacion", libroControlador.solicitarInformacionLibro);
router.post('/grafoInformacion/expandir', libroControlador.solicitarExpansionNodo);
router.post('/grafoInformacion/explicarRelacion', libroControlador.explicarRelacion);
router.get('/buscar', libroControlador.buscar);
router.get('/', validar(filtroLibroSchema, 'query'), libroControlador.obtenerTodos);
router.get('/:id', libroControlador.obtenerPorId);

router.use(middlewareAutenticacion);
router.post('/', middlewareRol(['admin', 'bibliotecario']), validar(crearLibroSchema), libroControlador.crear);
router.patch('/:id', middlewareRol(['admin', 'bibliotecario']), validar(actualizarLibroSchema), libroControlador.actualizar);
router.delete('/:id', middlewareRol(['admin', 'bibliotecario']), libroControlador.eliminar);

export default router;