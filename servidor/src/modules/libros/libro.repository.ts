// @ts-nocheck
import { prisma } from '../prisma';
import { CrearLibroDto, ActualizarLibroDto } from './libro.dto';

export const libroRepositorio = {
    obtenerTodos(filtros: {
        titulo?: string;
        isbn?: string;
        editorialId?: string;
        autorId?: string;
        categoriaId?: string;
        publicado?: boolean;
        anioPublicacion?: number;
        pagina?: number;
        porPagina?: number;
    } = {}) {
        const where: any = {};

        if (filtros.titulo) where.titulo = { contains: filtros.titulo, mode: 'insensitive' };
        if (filtros.isbn) where.isbn = { contains: filtros.isbn, mode: 'insensitive' };
        if (filtros.editorialId) where.editorialId = filtros.editorialId;
        if (filtros.publicado !== undefined) where.publicado = filtros.publicado;
        if (filtros.anioPublicacion) where.anioPublicacion = filtros.anioPublicacion;
        if (filtros.autorId) where.autores = { some: { autorId: filtros.autorId } };
        if (filtros.categoriaId) where.categorias = { some: { categoriaId: filtros.categoriaId } };

        const pagina = filtros.pagina ?? 1;
        const porPagina = filtros.porPagina; // undefined = sin límite

        const queryOptions: any = {
            where,
            include: {
                editorial: true,
                autores: { include: { autor: true } },
                categorias: { include: { categoria: true } },
                ejemplares: { select: { id: true, codigoBarras: true, estado: true, ubicacion: true, fechaAdquisicion: true } },
                recursosDigitales: true,
            },
            orderBy: { creadoEn: 'desc' },
        };

        if (porPagina !== undefined) {
            queryOptions.skip = (pagina - 1) * porPagina;
            queryOptions.take = porPagina;
        }

        return prisma.libro.findMany(queryOptions);
    },

    obtenerPorId(id: string) {
        return prisma.libro.findUnique({
            where: { id },
            include: {
                editorial: true,
                autores: { include: { autor: true } },
                categorias: { include: { categoria: true } },
                ejemplares: { select: { id: true, codigoBarras: true, estado: true, ubicacion: true, fechaAdquisicion: true } },
                recursosDigitales: true,
            },
        });
    },

    crear(data: CrearLibroDto & { autorIds?: string[]; categoriaIds?: string[]; recursosDigitales?: Array<{ tipo: string; url: string; formato?: string }> }) {
        const { autorIds, categoriaIds, recursosDigitales, ...libroData } = data as any;
        return prisma.libro.create({
            data: {
                ...libroData,
                ...(autorIds?.length ? {
                    autores: {
                        create: autorIds.map((autorId: string) => ({ autorId })),
                    },
                } : {}),
                ...(categoriaIds?.length ? {
                    categorias: {
                        create: categoriaIds.map((categoriaId: string) => ({ categoriaId })),
                    },
                } : {}),
                ...(recursosDigitales?.length ? {
                    recursosDigitales: {
                        create: recursosDigitales,
                    },
                } : {}),
            },
            include: {
                editorial: true,
                autores: { include: { autor: true } },
                categorias: { include: { categoria: true } },
                recursosDigitales: true,
            },
        });
    },

    actualizar(id: string, data: ActualizarLibroDto & { autorIds?: string[]; categoriaIds?: string[]; recursosDigitales?: Array<{ tipo: string; url: string; formato?: string }> }) {
        const { autorIds, categoriaIds, recursosDigitales, ...libroData } = data as any;

        // Construir la parte de relaciones solo si se enviaron
        const updateData: any = { ...libroData };

        if (autorIds !== undefined) {
            updateData.autores = {
                deleteMany: {},
                create: autorIds.map((autorId: string) => ({ autorId })),
            };
        }
        if (categoriaIds !== undefined) {
            updateData.categorias = {
                deleteMany: {},
                create: categoriaIds.map((categoriaId: string) => ({ categoriaId })),
            };
        }
        if (recursosDigitales !== undefined) {
            updateData.recursosDigitales = {
                deleteMany: {},
                create: recursosDigitales,
            };
        }

        return prisma.libro.update({
            where: { id },
            data: updateData,
            include: {
                editorial: true,
                autores: { include: { autor: true } },
                categorias: { include: { categoria: true } },
                recursosDigitales: true,
            },
        });
    },

    eliminar(id: string) {
        return prisma.libro.delete({ where: { id } });
    },

    async buscar(termino: string, pagina = 1, porPagina = 10) {
        const offset = (pagina - 1) * porPagina;

        // plainto_tsquery usa & (AND). Convertimos a | (OR) para buscar cualquier palabra
        const palabras = termino.trim().split(/\s+/).filter(Boolean);
        const tsqueryStr = palabras.map(p => `'${p.replace(/'/g, "''")}'`).join(' | ');
        console.log('[FTS] palabras:', palabras.length, '| tsquery:', tsqueryStr.substring(0, 200));

        const [filas, totalResult] = await Promise.all([
            prisma.$queryRaw<{ id: string; rank: number }[]>`
                SELECT l.id,
                       ts_rank(l.busqueda_fts, to_tsquery('spanish', ${tsqueryStr})) as rank
                FROM "libro" l
                WHERE l.busqueda_fts @@ to_tsquery('spanish', ${tsqueryStr})
                ORDER BY rank DESC
                LIMIT ${porPagina}
                OFFSET ${offset}
            `,
            prisma.$queryRaw<[{ count: bigint }]>`
                SELECT COUNT(*) as count
                FROM "libro"
                WHERE busqueda_fts @@ to_tsquery('spanish', ${tsqueryStr})
            `,
        ]);

        console.log('[FTS] resultados:', filas.length, 'total:', Number(totalResult[0].count));

        const total = Number(totalResult[0].count);
        const rankPorId = new Map(filas.map(f => [f.id, f.rank]));

        const data = filas.length > 0
            ? await prisma.libro.findMany({
                where: { id: { in: [...rankPorId.keys()] } },
                include: {
                    editorial: true,
                    autores: { include: { autor: true } },
                    categorias: { include: { categoria: true } },
                    ejemplares: { select: { id: true, codigoBarras: true, estado: true, ubicacion: true, fechaAdquisicion: true } },
                    recursosDigitales: true,
                },
            })
            : [];

        // Mantener el orden por rank de FTS
        data.sort((a, b) => (rankPorId.get(b.id) ?? 0) - (rankPorId.get(a.id) ?? 0));

        return {
            data,
            total,
            pagina,
            porPagina,
            totalPaginas: Math.ceil(total / porPagina),
        };
    },
};