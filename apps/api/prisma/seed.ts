import { PrismaClient } from "../src/generated/prisma"

const prisma = new PrismaClient()

async function seed() {
    await prisma.saida_prioridade.deleteMany()

    const categorias = await prisma.saida_prioridade.createMany({
        data: [
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Desnecessário',
                nivel: 1,
            },
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Supérfluo',
                nivel: 2,
            },
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Moderado',
                nivel: 3,
            },
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Importante',
                nivel: 4,
            },
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Essencial',
                nivel: 5,
            },
        ]
    })

    if(!categorias){
        throw new Error('Erro interno')
    }



}

seed().then(() => {
    console.log('Database seeded')
})
