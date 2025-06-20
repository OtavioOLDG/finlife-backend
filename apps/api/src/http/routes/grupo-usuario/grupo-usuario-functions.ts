import type { grupo_financeiro } from "../../../generated/prisma"
import { prisma } from "../../../lib/prisma"
import { BadRequestError } from "../_errors/bad-request-error"

export async function getAllMembersId(group: grupo_financeiro): Promise<number[]> {
    const ids : number[] = []

    const members = await prisma.grupo_financeiro_usuario.findMany({
        where:{
            id_ativo: true,
            id_grupo_financeiro: group.id
        }
    })

    if(!members){
        throw new BadRequestError('Falha ao encontrar membros')
    }

    for(let i = 0; i < members.length; i++){
        ids.push(members[i].id_usuario_info)
    }

    return ids
}