import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import {errorMiddleware} from './src/middlewares/error.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/auth', require('./src/modules/auth/auth.routes').default);
app.use('/api/usuarios', require('./src/modules/usuarios/usuario.routes').default);
app.use('/api/roles', require('./src/modules/roles/rol.routes').default);
app.use('/api/autores', require('./src/modules/autores/autor.routes').default);
app.use('/api/categorias', require('./src/modules/categorias/categoria.routes').default);
app.use('/api/editoriales', require('./src/modules/editoriales/editorial.routes').default);
app.use('/api/libros', require('./src/modules/libros/libro.routes').default);
app.use('/api/recursos-digitales', require('./src/modules/recursos-digitales/recurso-digital.routes').default);
app.use('/api/ejemplares', require('./src/modules/ejemplares/ejemplar.routes').default);
app.use('/api/prestamos', require('./src/modules/prestamos/prestamo.routes').default);
app.use('/api/multas', require('./src/modules/multas/multa.routes').default);
app.use('/api/pagos-multa', require('./src/modules/pagos-multa/pago-multa.routes').default);
app.use('/api/reservas', require('./src/modules/reservas/reserva.routes').default);
app.use('/api/configuracion-multa', require('./src/modules/configuracion-multa/configuracion-multa.routes').default);
app.use('/api/resenas', require('./src/modules/resenas/resena.routes').default);
app.use('/api/historial', require('./src/modules/historial/historial.routes').default);
app.use('/api/favoritos', require('./src/modules/favoritos/favorito.routes').default);

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.codigoEstado || err.status || 500).json({
        success: false,
        message: err.message,
        ...(req.app.get('env') === 'development' && {stack: err.stack}),
    });
});

app.use(errorMiddleware);

export default app;


