export interface menuPrincipalProps {
    id: string;
    categoria: string,
    admin: boolean | number
    telaItemCategoria?: any,
    itens?: {
        id: string;
        nome: string,
        telaItem: any,
        admin: boolean | number
    }[]
}