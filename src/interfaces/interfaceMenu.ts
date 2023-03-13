export interface menuPrincipalProps {
    categoria: string,
    admin: boolean | number
    itens?: {
        nome: string,
        telaItem: string,
        admin: boolean | number
    }[]
}