// @ts-nocheck
import {Request, Response, NextFunction} from 'express';
import {libroServicio} from './libro.service';
import {RespuestaLibroDto} from './libro.dto';

export const libroControlador = {
    async obtenerTodos(req: Request, res: Response, next: NextFunction) {
        try {
            const {pagina, porPagina, ...filtros} = req.query;
            const resultado = await libroServicio.obtenerTodos({
                ...filtros,
                pagina: pagina ? Number(pagina) : undefined,
                porPagina: porPagina ? Number(porPagina) : undefined,
            });
            res.json({success: true, ...resultado});
        } catch (error) {
            next(error);
        }
    },

    async obtenerPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const libro = await libroServicio.obtenerPorId(id);
            res.json({success: true, data: libro});
        } catch (error) {
            next(error);
        }
    },


    async crear(req: Request, res: Response, next: NextFunction) {
        try {
            const libro: RespuestaLibroDto = await libroServicio.crear(req.body);
            res.status(201).json({success: true, data: libro});
        } catch (error) {
            next(error);
        }
    },

    async actualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const libro = await libroServicio.actualizar(id, req.body);
            res.json({success: true, data: libro});
        } catch (error) {
            next(error);
        }
    },

    async eliminar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            await libroServicio.eliminar(id);
            res.json({success: true, mensaje: 'Libro eliminado correctamente'});
        } catch (error) {
            next(error);
        }
    },
    async solicitarGrafo(req: Request, res: Response, next: NextFunction) {
        try {
            const { q } = req.query;
            const resultado = await libroServicio.solicitarGrafo(q as string);
            res.json({ success: true, ...resultado });
        } catch (error) {
            next(error);
        }
    },
    async solicitarInformacionLibro(req: Request, res: Response, next: NextFunction) {
        try {
            const { q, numNodos, historial } = req.body;
            const resultado = await libroServicio.solicitarInformacionLibro(
                q as string,
                numNodos ? Number(numNodos) : 5,
                historial ?? { nodes: [], edges: [] },
            );
            res.json({ success: true, ...resultado });
        } catch (error) {
            console.error('[solicitarInformacionLibro] ERROR:', error);
            next(error);
        }
    },
    async solicitarExpansionNodo(req: Request, res: Response, next: NextFunction) {
        try {
            const { q, nodoOrigenId, numNodos, historial } = req.body;
            const resultado = await libroServicio.solicitarExpansionNodo(
                q as string,
                nodoOrigenId as string,
                numNodos ? Number(numNodos) : 5,
                historial ?? { nodes: [], edges: [] },
            );
            res.json({ success: true, ...resultado });
        } catch (error) {
            next(error);
        }
    },
    async explicarRelacion(req: Request, res: Response, next: NextFunction) {
        try {
            const { tituloOrigen, tituloDestino, contexto } = req.body;

            const resultado = await libroServicio.explicarRelacion(
                tituloOrigen as string,
                tituloDestino as string,
                contexto as string | undefined,
            );
            res.json({ success: true, ...resultado });
        } catch (error) {
            next(error);
        }
    },
    async buscar(req: Request, res: Response, next: NextFunction) {
        try {
            const {q, pagina, porPagina} = req.query;
            const resultado = await libroServicio.buscar(
                q as string,
                pagina ? Number(pagina) : undefined,
                porPagina ? Number(porPagina) : undefined,
            );
            res.json({success: true, ...resultado});
        } catch (error) {
            next(error);
        }
    },
 async visualizarPdf(req: Request, res: Response, next: NextFunction) {
    const abortController = new AbortController();
    req.on('close', () => abortController.abort());

    try {
        const url = req.query.url as string;
        const rangeHeader = req.headers.range as string | undefined;

        const { stream, status, contentType, contentLength, contentRange, acceptRanges } =
            await libroServicio.visualizarPdf(url, rangeHeader, abortController.signal);

        res.status(status);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'inline');
        if (acceptRanges) res.setHeader('Accept-Ranges', acceptRanges);
        if (contentRange) res.setHeader('Content-Range', contentRange);
        if (contentLength) res.setHeader('Content-Length', contentLength);

        stream.on('error', (err: any) => {
            if (err?.name === 'AbortError' || abortController.signal.aborted) return;
            console.error('Error en stream de PDF:', err.message);
            if (!res.headersSent) res.status(502).end();
            else res.destroy();
        });

        stream.pipe(res);
    } catch (err: any) {
        if (err?.name === 'AbortError') return;
        next(err);
    }
}
};