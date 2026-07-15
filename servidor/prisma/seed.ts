import dotenv from 'dotenv';

dotenv.config();

import {PrismaClient} from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({adapter});

async function main() {

    const adminRol = await prisma.rol.upsert({
        where: {nombre: 'admin'},
        update: {},
        create: {nombre: 'admin', descripcion: 'Administrador del sistema'},
    });

    const biblioRol = await prisma.rol.upsert({
        where: {nombre: 'bibliotecario'},
        update: {},
        create: {nombre: 'bibliotecario', descripcion: 'Bibliotecario'},
    });

    const docenteRol = await prisma.rol.upsert({
        where: {nombre: 'docente'},
        update: {},
        create: {nombre: 'docente', descripcion: 'Docente'},
    });

    const estudianteRol = await prisma.rol.upsert({
        where: {nombre: 'estudiante'},
        update: {},
        create: {nombre: 'estudiante', descripcion: 'Estudiante'},
    });


    const hash = await bcrypt.hash('12345678', 10);

    await prisma.usuario.upsert({
        where: {correo: 'admin@biblioteca.edu'},
        update: {},
        create: {
            nombre: 'Admin',
            apellidos: 'Sistema',
            correo: 'admin@biblioteca.edu',
            passwordHash: hash,
            rolId: adminRol.id,
        },
    });

    await prisma.usuario.upsert({
        where: {correo: 'bibliotecario@biblioteca.edu'},
        update: {},
        create: {
            nombre: 'Bibliotecario',
            apellidos: 'General',
            correo: 'bibliotecario@biblioteca.edu',
            passwordHash: hash,
            rolId: biblioRol.id,
        },
    });

    await prisma.usuario.upsert({
        where: {correo: 'docente@biblioteca.edu'},
        update: {},
        create: {
            nombre: 'Docente',
            apellidos: 'Ejemplo',
            correo: 'docente@biblioteca.edu',
            passwordHash: hash,
            rolId: docenteRol.id,
        },
    });

    await prisma.usuario.upsert({
        where: {correo: 'estudiante@biblioteca.edu'},
        update: {},
        create: {
            nombre: 'Estudiante',
            apellidos: 'Ejemplo',
            correo: 'estudiante@biblioteca.edu',
            passwordHash: hash,
            rolId: estudianteRol.id,
        },
    });
    await prisma.configuracionMulta.upsert({
        where: {id: '00000000-0000-0000-0000-000000000001'},
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            tarifaDiaria: 1.50,
            diasMaxPrestamo: 14,
        },
    });
}


main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
