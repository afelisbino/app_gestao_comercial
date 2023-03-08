export interface cardapioProps {
    cdp_id: string;
    cdp_nome: string;
    cdp_valor: number;
    cdp_disponivel?: boolean | null;
    cdp_descricao?: string | null;
    cat_id: string;
}