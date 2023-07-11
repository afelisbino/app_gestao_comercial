import { TabelaCabecalho } from './TabelaCabecalho'
import { formaPagamento } from '../../interfaces/interfaceFormaPagamento'
import { TabelaCarregamento } from './TabelaCarregamento'
import { Eye, EyeSlash, Pencil } from 'phosphor-react'

interface tabelaFormaPagamentoProps {
  editarFormaPagamento: (
    formaPagamentoId: string,
    nomeFormaPagamento: string,
    codigoCategoria: string,
  ) => void
  alterarStatusFormaPagamento: (
    formaPagamentoId: string,
    formaPagamentoAtivo: boolean,
  ) => void
  processandoRequisicao: boolean
  listaFormaPagamento: formaPagamento[]
  carregandoListaFormaPagamento: boolean
}

export function TabelaFormaPagamento({
  editarFormaPagamento,
  alterarStatusFormaPagamento,
  processandoRequisicao,
  listaFormaPagamento,
  carregandoListaFormaPagamento,
}: tabelaFormaPagamentoProps) {
  return (
    <div className="table-responsive mt-3 tabela-tela">
      <table className="table border rounded">
        <caption>Lista de formas de pagamento</caption>
        <TabelaCabecalho colunas={['Opc', 'Forma de pagamento']} />
        <tbody className="overflow-auto">
          {carregandoListaFormaPagamento ? (
            <>
              <TabelaCarregamento totalColunas={2} opcao={true} />
              <TabelaCarregamento totalColunas={2} opcao={true} />
              <TabelaCarregamento totalColunas={2} opcao={true} />
            </>
          ) : listaFormaPagamento.length === 0 ? (
            <>
              <td colSpan={2} className="text-center p-3">
                Nenhuma forma de pagamento encontrado
              </td>
            </>
          ) : (
            listaFormaPagamento.map((formaPagamento) => {
              return (
                <tr key={formaPagamento.token}>
                  <th className="w-25 m-0" scope="0">
                    <div className="d-flex gap-2">
                      {formaPagamento.status ? (
                        <button
                          type="button"
                          key={self.crypto.randomUUID()}
                          title="Desativar forma de pagamento"
                          onClick={() => {
                            alterarStatusFormaPagamento(
                              formaPagamento.token,
                              false,
                            )
                          }}
                          className="btn btn-danger shadow"
                          disabled={processandoRequisicao}
                        >
                          <EyeSlash size={32} color="#ffffff" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          key={self.crypto.randomUUID()}
                          title="Ativar forma de pagamento"
                          onClick={() => {
                            alterarStatusFormaPagamento(
                              formaPagamento.token,
                              true,
                            )
                          }}
                          className="btn btn-success shadow"
                          disabled={processandoRequisicao}
                        >
                          <Eye size={32} color="#ffffff" />
                        </button>
                      )}
                      <button
                        type="button"
                        title="Editar forma de pagamento"
                        key={self.crypto.randomUUID()}
                        className="btn btn-warning shadow"
                        disabled={processandoRequisicao}
                        onClick={() => {
                          editarFormaPagamento(
                            formaPagamento.token,
                            formaPagamento.nome,
                            formaPagamento.categoria,
                          )
                        }}
                      >
                        <Pencil size={32} color="#ffffff" />
                      </button>
                    </div>
                  </th>
                  <td className="w-auto m-0">{formaPagamento.nome}</td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
