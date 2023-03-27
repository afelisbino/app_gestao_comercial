export interface menuPrincipalProps {
    id: string;
    categoria: string,
    admin: boolean | number
    itens?: {
        id: string;
        nome: string,
        telaItem: string,
        admin: boolean | number
    }[]
}