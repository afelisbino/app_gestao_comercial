export interface produtoProps {
    pro_id: string;
    pro_nome: string;
    pro_descricao: string | null;
    pro_valor_venda: number;
    pro_preco_custo: number;
    pro_disponivel: boolean;
    cat_token: string;
    frn_token: string;
    est_qtd_atual: number;
    est_qtd_minimo: number;
}