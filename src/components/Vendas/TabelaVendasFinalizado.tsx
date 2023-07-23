import { ListNumbers, TrashSimple } from 'phosphor-react'
import { vendasFinalizadaProps } from '../../interfaces/interfaceRelatorioVendas'
import { formataValorMoedaBrasileira } from '../../controllers/NumeroController'
import { TabelaCarregamento } from '../Tabela/TabelaCarregamento'
import { TabelaCabecalho } from '../Tabela/TabelaCabecalho'

interface tabelaVendasFinalizadasProps {
  listaVendas: vendasFinalizadaProps[]
  buscandoLista: boolean
  buscandoItensVenda: boolean
  cancelandoVenda: boolean
  visualizarItensVenda: (ven_id: string) => void
  cancelarVenda: (ven_id: string) => void
}

export function TabelaVendasFinalizado({
  listaVendas,
  buscandoLista,
  buscandoItensVenda,
  cancelandoVenda,
  visualizarItensVenda,
  cancelarVenda,
}: tabelaVendasFinalizadasProps) {
  return (
    <div className="table-responsive mt-3 tabela-tela">
      <table className="table border rounded mb-5">
        <caption>Lista vendas finalizadas</caption>

        <TabelaCabecalho
          colunas={[
            'Opções',
            'Data/Hora',
            'Tipo da venda',
            'Forma de pagamento',
            'Valor da compra (R$)',
            'Desconto (R$)',
            'Ganhos (R$)',
            'Ganhos (%)',
          ]}
        />
        <tbody className="overflow-auto">
          {buscandoLista ? (
            <>
              <TabelaCarregamento totalColunas={9} opcao={true} />
              <TabelaCarregamento totalColunas={9} opcao={true} />
              <TabelaCarregamento totalColunas={9} opcao={true} />
            </>
          ) : listaVendas.length === 0 ? (
            <td colSpan={9} className="text-center p-3">
              Nenhum venda em aberta encontrada
            </td>
          ) : (
            listaVendas.map((venda) => {
              return (
                <tr key={venda.ven_id}>
                  <th className="w-auto" scope="row">
                    <div className="d-flex flex-row gap-2">
                      <button
                        title="Visualizar itens da compra"
                        type="button"
                        key={'btn-visualizar-itens-' + venda.ven_id}
                        className="btn btn-info shadow m-1"
                        disabled={buscandoItensVenda}
                        onClick={() => visualizarItensVenda(venda.ven_id)}
                        data-bs-toggle="modal"
                        data-bs-target="#itensCompradoVendaModal"
                      >
                        <ListNumbers size={32} color="#ffffff" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger shadow m-1"
                        title="Excluir venda"
                        disabled={cancelandoVenda || buscandoItensVenda}
                        onClick={() => cancelarVenda(venda.ven_id)}
                      >
                        <TrashSimple size={32} color="#ffffff" />
                      </button>
                    </div>
                  </th>
                  <td className="w-auto">{venda.ven_data}</td>
                  <td className="w-auto">{venda.ven_tipo}</td>
                  <td className="w-auto">{venda.ven_pagamento}</td>
                  <td className="w-auto">
                    {formataValorMoedaBrasileira(
                      Number(venda.ven_valor_compra),
                    )}
                  </td>
                  <td className="w-auto">
                    {formataValorMoedaBrasileira(Number(venda.ven_desconto))}
                  </td>
                  <td className="w-auto">
                    {formataValorMoedaBrasileira(Number(venda.ven_total))}
                  </td>
                  <td
                    className={
                      'w-auto fw-bold ' +
                      (venda.ven_lucro < 0 ? 'text-danger' : 'text-success')
                    }
                  >
                    {formataValorMoedaBrasileira(Number(venda.ven_lucro))}
                  </td>
                  <td
                    className={
                      'w-auto fw-bold ' +
                      (venda.ven_porcentagem_lucro < 0
                        ? 'text-danger'
                        : 'text-success')
                    }
                  >
                    {Number(venda.ven_porcentagem_lucro)}
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
