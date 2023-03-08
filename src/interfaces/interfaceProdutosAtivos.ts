import { codigoBarrasProps } from './interfaceCodigoBarrasProduto';

export interface produtoAtivosProps {
    pro_id: string;
    pro_nome: string;
    pro_valor: number;
    cat_token: string;
    frn_token: string;
    est_qtd_atual: number;
    pro_codigos: codigoBarrasProps[];
}