import { PrismaClient } from "../src/generated/prisma"

const prisma = new PrismaClient()

async function seed() {
    await prisma.saida_prioridade.deleteMany()
    // await prisma.pagamento_entrada_tipo.deleteMany()
    // await prisma.pagamento_saida_tipo.deleteMany()


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

    const entradasTipo = await prisma.pagamento_entrada_tipo.createMany({
        data: [
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Pix',
                publico: true
            },
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Cartão de crédito',
                publico: true
            },
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Cartão de débito',
                publico: true
            },
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Em dinheiro',
                publico: true
            },
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Serviços',
                publico: true
            },
        ]
    })

    if(!entradasTipo){
        throw new Error('Erro interno')
    }

    
    const saidasTipo = await prisma.pagamento_saida_tipo.createMany({
        data: [
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Pix',
                publico: true
            },
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Cartão de crédito',
                publico: true
            },
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Cartão de débito',
                publico: true
            },
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Em dinheiro',
                publico: true
            },
            {
                id_ativo: true,
                dthr_cadastro: new Date(),
                nome: 'Serviços',
                publico: true
            },
        ]
    })

    if(!saidasTipo){
        throw new Error('Erro interno')
    }


}

seed().then(() => {
    console.log('Database seeded')
})
