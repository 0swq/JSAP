// @ts-nocheck
import {ApiError} from '@utils/ApiError';
import {CrearLibroDto, ActualizarLibroDto, RespuestaLibroDto} from './libro.dto';
import {libroRepositorio} from './libro.repository';
import {iaServicio} from "@modules/ia/ia.service";

const OPENALEX_BASE = 'https://api.openalex.org';
const OPENALEX_CONTACTO = 'tu-email@ejemplo.com';

function clampNumNodos(n: any): number {
    const num = Number(n);
    if (!Number.isFinite(num) || num < 1) return 5;
    return Math.min(num, 5);
}

async function fetchConReintento(url: string, opciones: RequestInit = {}, maxIntentos = 4): Promise<Response> {
    for (let intento = 1; intento <= maxIntentos; intento++) {
        const respuesta = await fetch(url, opciones);

        if (respuesta.status !== 429 && respuesta.status < 500) {
            return respuesta;
        }
        if (intento === maxIntentos) {
            return respuesta;
        }

        const retryAfter = respuesta.headers.get('retry-after');
        const espera = retryAfter
            ? Number(retryAfter) * 1000
            : Math.min(1000 * Math.pow(2, intento - 1), 8000);

        console.warn(`[fetchConReintento] status=${respuesta.status} url=${url.split('?')[0]} reintentando en ${espera}ms (intento ${intento}/${maxIntentos})`);
        await new Promise(resolve => setTimeout(resolve, espera));
    }
    return fetch(url, opciones);
}

function extraerIdCorto(openalexUrl: string): string {
    if (!openalexUrl) return '';
    const partes = String(openalexUrl).split('/');
    return partes[partes.length - 1];
}

function extraerDoiOpenAlex(work: any): string | null {
    if (!work?.doi) return null;
    return String(work.doi).replace('https://doi.org/', '').toLowerCase().trim();
}

function normalizarTitulo(t: string): string {
    return (t ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
}

function titulosCoinciden(a: string, b: string): boolean {
    const na = normalizarTitulo(a);
    const nb = normalizarTitulo(b);
    if (!na || !nb) return false;
    return na === nb || na.includes(nb) || nb.includes(na);
}

export const libroServicio = {
    async obtenerTodos(filtros: {
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
        const pagina = filtros.pagina ?? 1;
        const porPagina = filtros.porPagina; // undefined = sin límite
        const data = await libroRepositorio.obtenerTodos(filtros);
        return {data, pagina, porPagina};
    },

    async obtenerPorId(id: string): Promise<RespuestaLibroDto> {
        const libro = await libroRepositorio.obtenerPorId(id);
        if (!libro) throw ApiError.noEncontrado('Libro no encontrado');
        return libro;
    },

    crear(data: CrearLibroDto): Promise<RespuestaLibroDto> {
        return libroRepositorio.crear(data);
    },

    async actualizar(id: string, data: ActualizarLibroDto): Promise<RespuestaLibroDto> {
        await this.obtenerPorId(id);
        return libroRepositorio.actualizar(id, data);
    },

    async eliminar(id: string): Promise<void> {
        await this.obtenerPorId(id);
        await libroRepositorio.eliminar(id);
    },

    async solicitarGrafo(termino: string) {
        const resultado = await this.buscar(termino, 1, 50);
        const libros = resultado.data;

        if (!libros || libros.length === 0) {
            return {nodes: [], edges: [], ordenLectura: []};
        }
        const librosFormateados = libros.map((l: any) => ({
            id: l.id,
            titulo: l.titulo,
            descripcion: l.descripcion ?? '',
            isbn: l.isbn ?? '',
            anio: l.anioPublicacion ?? '',
            idioma: l.idioma ?? '',
            editorial: l.editorial?.nombre ?? '',
            autores: (l.autores ?? []).map((a: any) =>
                `${a.autor?.nombre ?? ''} ${a.autor?.apellidos ?? ''}`.trim()
            ),
            categorias: (l.categorias ?? []).map((c: any) => c.categoria?.nombre ?? ''),
        }));

        const sistema = `Eres un asistente experto en bibliotecas universitarias y análisis de conocimiento.

Tu tarea es analizar una consulta de investigación de un estudiante y un conjunto de libros disponibles en una biblioteca.

Debes:
1. Evaluar qué libros son más relevantes para resolver la necesidad del estudiante.
2. Asignar una puntuación de relevancia del 0 al 100 a cada libro.
3. Explicar brevemente por qué cada libro puede ayudar.
4. Crear relaciones entre libros o temas cuando exista una conexión conceptual.
5. Generar un grafo de conocimiento en formato JSON compatible con Vis Network.
6. Sugerir un orden de lectura de los libros incluidos, del más fundamental al más avanzado.

Reglas:
- No inventes libros que no estén en la lista.
- Usa únicamente la información proporcionada.
- La relevancia debe basarse en la relación entre la solicitud del usuario y la descripción del libro.
- Máximo 3 niveles de profundidad en las relaciones.
- Todo libro incluido en "nodes" DEBE tener al menos una conexión en "edges" (como "from" o "to"). No incluyas libros aislados sin relación con ningún otro nodo o tema.
- Si un libro es relevante para la consulta pero no tiene ninguna relación conceptual con otros libros de la lista, NO lo incluyas en el grafo.
- Prioriza incluir libros que formen cadenas o grupos temáticos que le permitan al estudiante continuar su investigación una vez terminado un libro (ej: introductorio -> intermedio -> avanzado).
- "ordenLectura" debe incluir únicamente los mismos ids presentes en "nodes", ordenados del más fundamental al más especializado.
- El campo "posicion" en "ordenLectura" debe ser un entero consecutivo empezando en 1, sin saltos ni repeticiones.
- Devuelve únicamente JSON válido, sin explicaciones adicionales.

Formato de salida obligatorio:

{
  "nodes": [],
  "edges": [],
  "ordenLectura": []
}

Estructura de nodo:

{
  "id": "id_del_libro",
  "label": "titulo",
  "group": "libro",
  "value": relevancia,
  "data": {
    "razon": "motivo de recomendación"
  }
}

Estructura de conexión:

{
  "from": "id_origen",
  "to": "id_destino"
}

Estructura de orden de lectura:

{
  "id": "id_del_libro",
  "posicion": 1,
  "motivo": "breve justificación de por qué va en este punto de la secuencia"
}`;

        const prompt = `Consulta de investigación: "${termino}"

Libros disponibles:
        ${JSON.stringify(librosFormateados, null, 2)}`;

        const respuesta = await iaServicio.completar(sistema, prompt);
        console.log('[IA grafo respuesta]:', respuesta.substring(0, 400));
        const match = respuesta.match(/\{[\s\S]*\}/);
        if (!match) {
            console.error('[IA grafo] No se encontró JSON en la respuesta');
            return {nodes: [], edges: [], ordenLectura: []};
        }

        const {nodes, edges, ordenLectura} = JSON.parse(match[0]) as {
            nodes: any[];
            edges: any[];
            ordenLectura: any[];
        };
        console.log('[IA grafo] nodes:', nodes?.length, 'edges:', edges?.length, 'orden:', ordenLectura?.length);

        const idsConectados = new Set<string>();
        (edges ?? []).forEach((e: any) => {
            idsConectados.add(e.from);
            idsConectados.add(e.to);
        });

        const nodesFiltrados = (nodes ?? []).filter((n: any) => idsConectados.has(n.id));
        const edgesFiltrados = (edges ?? []).filter(
            (e: any) => idsConectados.has(e.from) && idsConectados.has(e.to)
        );
        const ordenLecturaFiltrado = (ordenLectura ?? [])
            .filter((o: any) => idsConectados.has(o.id))
            .sort((a: any, b: any) => a.posicion - b.posicion);

        return {
            nodes: nodesFiltrados,
            edges: edgesFiltrados,
            ordenLectura: ordenLecturaFiltrado,
        };
    },

    async buscar(termino: string, pagina = 1, porPagina = 10) {
        let terminoMejorado = termino.replace(/[^\w\sáéíóúñü]/gi, '');
        try {
            const respuesta = await iaServicio.completar(
                `Eres un asistente de búsqueda para una biblioteca. El usuario buscará un tema o concepto ESPECÍFICO.
         Tu tarea es expandir ese término con sinónimos, subtemas y conceptos ESTRECHAMENTE RELACIONADOS al tema exacto que el usuario busca.
         NO incluyas términos genéricos de la categoría padre ni temas tangenciales.
         Ejemplo: si buscan "java", devuelve términos como "jvm", "spring boot", "jakarta ee", "maven", "gradle", NO "python", "javascript", "programación".
         Ejemplo: si buscan "cálculo", devuelve "derivadas", "integrales", "límites", NO "álgebra", "estadística".
         Devuelve SOLO un JSON. Formato estricto: { "terminos": ["palabra1", "palabra2", ...] }
         Sin explicaciones ni markdown.`,
                termino
            );
            const {terminos} = JSON.parse(respuesta) as { terminos: string[] };
            terminoMejorado = [...terminos, termino]
                .join(' ')
                .replace(/[^\w\sáéíóúñü]/gi, '');
        } catch (err: any) {
        }
        return libroRepositorio.buscar(terminoMejorado, pagina, porPagina);
    },

    async buscarPaperEnOpenAlex(query: string): Promise<any | null> {
        const url = `${OPENALEX_BASE}/works?search=${encodeURIComponent(query)}&per-page=1`
            + `&select=id,display_name,doi,publication_year,cited_by_count,referenced_works`
            + `&mailto=${encodeURIComponent(OPENALEX_CONTACTO)}`;

        const respuesta = await fetchConReintento(url);
        if (!respuesta.ok) {
            const texto = await respuesta.text().catch(() => '');
            console.error(`[OpenAlex search] status=${respuesta.status} body=${texto.slice(0, 300)}`);
            throw new Error(`OpenAlex search respondió ${respuesta.status}`);
        }

        const data = await respuesta.json();
        return data.results?.[0] ?? null;
    },

    async buscarCitantesEnOpenAlex(openalexId: string, limite: number): Promise<any[]> {
        const url = `${OPENALEX_BASE}/works?filter=cites:${openalexId}&sort=cited_by_count:desc&per-page=${limite}`
            + `&select=id,display_name,doi,publication_year,cited_by_count,referenced_works`
            + `&mailto=${encodeURIComponent(OPENALEX_CONTACTO)}`;

        const respuesta = await fetchConReintento(url);
        if (!respuesta.ok) {
            const texto = await respuesta.text().catch(() => '');
            console.error(`[OpenAlex citations] status=${respuesta.status} body=${texto.slice(0, 300)}`);
            throw new Error(`OpenAlex citations respondió ${respuesta.status}`);
        }

        const data = await respuesta.json();
        return data.results ?? [];
    },


    detectarReferenciasCruzadas(
        nuevos: { idFinal: string; openalexId: string; referencedWorks: string[] }[],
        historial: { nodes: any[]; edges: any[] } = {nodes: [], edges: []}
    ): { from: string; to: string }[] {
        if (!nuevos.length) return [];

        const mapaOpenAlexAIdFinal = new Map<string, string>();
        (historial.nodes ?? []).forEach((n: any) => {
            if (n.openalexId) mapaOpenAlexAIdFinal.set(n.openalexId, n.id);
        });
        nuevos.forEach(n => mapaOpenAlexAIdFinal.set(n.openalexId, n.idFinal));

        const cruzadas: { from: string; to: string }[] = [];
        nuevos.forEach(n => {
            (n.referencedWorks ?? []).forEach(refCorto => {
                const idFinalRef = mapaOpenAlexAIdFinal.get(refCorto);
                if (idFinalRef && idFinalRef !== n.idFinal) {
                    cruzadas.push({from: n.idFinal, to: idFinalRef});
                }
            });
        });
        return cruzadas;
    },

    async solicitarInformacionLibro(
        id: string,
        numNodos: number = 5,
        historial: { nodes: any[]; edges: any[] } = {nodes: [], edges: []}
    ) {
        const limite = clampNumNodos(numNodos);
        const idsVistos = new Set<string>((historial.nodes ?? []).map((n: any) => n.id).filter(Boolean));

        const libro = await this.obtenerPorId(id);
        const queryBusqueda = libro.isbn ? `${libro.titulo} ${libro.isbn}` : libro.titulo;

        let seed: any = null;
        try {
            seed = await this.buscarPaperEnOpenAlex(queryBusqueda);
        } catch (err: any) {
            console.error('[solicitarInformacionLibro] Error buscando seed en OpenAlex:', err.message);
            console.error('cause:', err.cause);
        }

        const libroNode: any = {
            id: libro.id,
            label: libro.titulo,
            group: 'libro_catalogo',
            shape: 'triangleDown',
            value: 100,
        };
        if (seed) libroNode.openalexId = extraerIdCorto(seed.id);

        const nodesMap = new Map<string, any>();
        nodesMap.set(libro.id, libroNode);

        if (!seed) {
            return {nodes: Array.from(nodesMap.values()), edges: []};
        }

        const edges: any[] = [];
        const nuevosParaCruce: { idFinal: string; openalexId: string; referencedWorks: string[] }[] = [];

        function formatearEdge(from: string, to: string, extra: any = {}) {
            const yaExiste = edges.some(e => e.from === from && e.to === to);
            if (yaExiste || from === to) return;
            edges.push({from, to, ...extra});
        }

        const citantes = await this.buscarCitantesEnOpenAlex(extraerIdCorto(seed.id), limite);

        citantes.forEach((work: any) => {
            const openalexIdCorto = extraerIdCorto(work.id);
            const doi = extraerDoiOpenAlex(work);
            const idFinal = doi ?? openalexIdCorto;
            if (!idFinal || idsVistos.has(idFinal)) return;
            idsVistos.add(idFinal);

            nodesMap.set(idFinal, {
                id: idFinal,
                openalexId: openalexIdCorto,
                label: work.display_name ?? 'Sin título',
                group: 'paper_semanticscholar',
                value: 1,
                anio: work.publication_year ?? null,
                doi: doi ?? null,
                citas: work.cited_by_count ?? 0,
                url: doi ? `https://doi.org/${doi}` : work.id,
            });

            formatearEdge(idFinal, libro.id, {arrows: 'to'});
            nuevosParaCruce.push({
                idFinal,
                openalexId: openalexIdCorto,
                referencedWorks: (work.referenced_works ?? []).map(extraerIdCorto),
            });
        });

        const cruzadas = this.detectarReferenciasCruzadas(nuevosParaCruce, historial);
        cruzadas.forEach(c => formatearEdge(c.from, c.to, {arrows: 'to', tipo: 'cruzada'}));

        return {
            nodes: Array.from(nodesMap.values()),
            edges,
        };
    },

    async solicitarExpansionNodo(
        query: string,
        nodoOrigenId: string,
        numNodos: number = 5,
        historial: { nodes: any[]; edges: any[] } = {nodes: [], edges: []}
    ) {
        try {
            const limite = clampNumNodos(numNodos);
            const idsVistos = new Set<string>((historial.nodes ?? []).map((n: any) => n.id).filter(Boolean));

            const nodoOrigenHistorial = (historial.nodes ?? []).find((n: any) => n.id === nodoOrigenId);
            let openalexIdOrigen: string | null = nodoOrigenHistorial?.openalexId ?? null;

            if (!openalexIdOrigen) {
                console.log(`[expandir] nodo origen sin openalexId guardado, buscando por título: "${query}"`);
                const seed = await this.buscarPaperEnOpenAlex(query);
                if (!seed) {
                    console.log('[expandir] no se encontró el paper origen en OpenAlex');
                    return {nodes: [], edges: []};
                }
                openalexIdOrigen = extraerIdCorto(seed.id);
            }

            console.log(`[expandir] openalexIdOrigen="${openalexIdOrigen}" nodoOrigenId="${nodoOrigenId}" limite=${limite}`);
            const citantes = await this.buscarCitantesEnOpenAlex(openalexIdOrigen, limite);
            console.log(`[expandir] citantes obtenidos: ${citantes.length}`);

            const nodesMap = new Map<string, any>();
            const edges: any[] = [];
            const nuevosParaCruce: { idFinal: string; openalexId: string; referencedWorks: string[] }[] = [];

            citantes.forEach((work: any) => {
                const openalexIdCorto = extraerIdCorto(work.id);
                const doi = extraerDoiOpenAlex(work);
                const idFinal = doi ?? openalexIdCorto;
                if (!idFinal || idsVistos.has(idFinal)) return;
                idsVistos.add(idFinal);

                nodesMap.set(idFinal, {
                    id: idFinal,
                    openalexId: openalexIdCorto,
                    label: work.display_name ?? 'Sin título',
                    group: 'paper_semanticscholar',
                    value: 1,
                    anio: work.publication_year ?? null,
                    doi: doi ?? null,
                    citas: work.cited_by_count ?? 0,
                    url: doi ? `https://doi.org/${doi}` : work.id,
                });

                edges.push({from: idFinal, to: nodoOrigenId, arrows: 'to'});
                nuevosParaCruce.push({
                    idFinal,
                    openalexId: openalexIdCorto,
                    referencedWorks: (work.referenced_works ?? []).map(extraerIdCorto),
                });
            });

            const cruzadas = this.detectarReferenciasCruzadas(nuevosParaCruce, historial);
            cruzadas.forEach(c => {
                const yaExiste = edges.some(e => e.from === c.from && e.to === c.to);
                if (!yaExiste && c.from !== c.to) edges.push({from: c.from, to: c.to, arrows: 'to', tipo: 'cruzada'});
            });

            console.log(`[expandir] OK - devolviendo ${nodesMap.size} nodos, ${edges.length} edges`);
            return {
                nodes: Array.from(nodesMap.values()),
                edges,
            };
        } catch (err: any) {
            console.error('[expandir] ERROR:', err.message);
            console.error(err.stack);
            throw err;
        }
    },


    async buscarEnSemanticScholarPorTitulo(titulo: string): Promise<{ paperId: string; tldr?: string } | null> {
        const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(titulo)}&fields=title,tldr&limit=1`;
        const respuesta = await fetchConReintento(url, {}, 3);
        if (!respuesta.ok) {
            console.warn(`[SemanticScholar search] status=${respuesta.status}`);
            return null;
        }
        const data = await respuesta.json();
        const paper = data.data?.[0];
        if (!paper) return null;
        return {paperId: paper.paperId, tldr: paper.tldr?.text};
    },

    async obtenerCitantesConContexto(paperId: string, limite = 50): Promise<any[]> {
        const url = `https://api.semanticscholar.org/graph/v1/paper/${paperId}/citations?fields=title,contexts,tldr&limit=${limite}`;
        const respuesta = await fetchConReintento(url, {}, 3);
        if (!respuesta.ok) {
            console.warn(`[SemanticScholar citations] status=${respuesta.status}`);
            return [];
        }
        const data = await respuesta.json();
        return (data.data ?? []).map((d: any) => d.citingPaper ?? d);
    },

    async explicarRelacion(tituloOrigen: string, tituloDestino: string, contextoManual?: string) {
        let contexto = contextoManual;
        let tldrOrigen: string | undefined;
        let tldrDestino: string | undefined;

        if (!contexto) {
            try {
                const destinoInfo = await this.buscarEnSemanticScholarPorTitulo(tituloDestino);
                if (destinoInfo) {
                    tldrDestino = destinoInfo.tldr;
                    const citantes = await this.obtenerCitantesConContexto(destinoInfo.paperId, 50);
                    const coincidencia = citantes.find((c: any) => titulosCoinciden(c.title ?? '', tituloOrigen));
                    if (coincidencia) {
                        contexto = coincidencia.contexts?.[0];
                        tldrOrigen = coincidencia.tldr?.text;
                    }
                }
            } catch (err: any) {
                console.warn('[explicarRelacion] No se pudo obtener contexto de Semantic Scholar:', err.message);
            }
        }

        const sistema = `Eres un asistente experto en literatura académica.
Tu tarea es explicar, en 1 o 2 oraciones y en lenguaje simple, la relación entre dos publicaciones académicas.

Clasifica la relación en uno de estos tipos: "apoya", "refuta", "extiende", "menciona".

Reglas:
- Si hay un fragmento de cita textual, básate en él como fuente principal.
- Si no hay fragmento pero sí resúmenes breves, apóyate en ellos.
- Si no hay ni fragmento ni resúmenes, basa tu respuesta solo en los títulos y sé conservador (usa "menciona" si no es claro).
- Devuelve únicamente JSON válido, sin explicaciones adicionales.

Formato de salida obligatorio:
{
  "tipo": "apoya" | "refuta" | "extiende" | "menciona",
  "explicacion": "explicación breve en lenguaje simple"
}`;

        let prompt: string;
        if (contexto) {
            prompt = `Artículo A: "${tituloOrigen}"\nArtículo B: "${tituloDestino}"\n\nFragmento donde A cita a B: "${contexto}"`;
        } else if (tldrOrigen || tldrDestino) {
            prompt = `Artículo A: "${tituloOrigen}"${tldrOrigen ? `\nResumen de A: "${tldrOrigen}"` : ''}\nArtículo B: "${tituloDestino}"${tldrDestino ? `\nResumen de B: "${tldrDestino}"` : ''}\n\nNo se encontró el fragmento textual de la cita.`;
        } else {
            prompt = `Artículo A: "${tituloOrigen}"\nArtículo B: "${tituloDestino}"\n\nNo se encontró el fragmento textual de la cita ni resúmenes disponibles.`;
        }

        const respuesta = await iaServicio.completar(sistema, prompt);
        const match = respuesta.match(/\{[\s\S]*\}/);
        if (!match) {
            return {tipo: 'menciona', explicacion: 'No se pudo determinar la relación.'};
        }
        return JSON.parse(match[0]);
    },

};