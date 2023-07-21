import { Trash } from 'phosphor-react'
import { pagamentoVenda } from '../../interfaces/interfaceVenda'
import { TabelaCabecalho } from '../Tabela/TabelaCabecalho'
import { formataValorMoedaBrasileira } from '../../controllers/NumeroController'

interface listaPagamentoProps {
  listaPagamentoVenda: pagamentoVenda[]
  excluirPagamento: (pagamentoId: string) => void
}

export function ListaPagamentos({
  listaPagamentoVenda,
  excluirPagamento,
}: listaPagamentoProps) {
  return (
    <div className="table-responsive mt-3 tabela-tela">
      <table className="table border rounded">
        <TabelaCabecalho
          colunas={['Opc', 'Forma de pagamento', 'Valor Pago (R$)']}
        />
        <tbody className="overflow-auto">
          {listaPagamentoVenda.length === 0 ? (
            <>
              <td colSpan={3} className="text-center p-3">
                Nenhum pagamento inserido
              </td>
            </>
          ) : (
            listaPagamentoVenda.map((pagamento) => {
              return (
                <tr key={pagamento.pagamentoId}>
                  <th className="w-25 m-0" scope="0">
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        title="Excluir pagamento"
                        key={self.crypto.randomUUID()}
                        className="btn btn-danger shadow"
                        onClick={() => {
                          excluirPagamento(pagamento.pagamentoId)
                        }}
                      >
                        <Trash size={32} color="#ffffff" />
                      </button>
                    </div>
                  </th>
                  <td className="w-auto m-0">
                    {pagamento.formaPagamentoNome ?? '--'}
                  </td>
                  <td className="w-auto m-0">
                    {formataValorMoedaBrasileira(pagamento.valorPago)}
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
