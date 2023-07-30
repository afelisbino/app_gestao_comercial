import { ChangeEvent, useState } from 'react'
import { vendaFiadoProps } from '../../../interfaces/interfaceVenda'
import { ListNumbers } from 'phosphor-react'
import { formataValorMoedaBrasileira } from '../../../controllers/NumeroController'
import { TabelaCabecalho } from '../../Tabela/TabelaCabecalho'
import { TabelaCarregamento } from '../../Tabela/TabelaCarregamento'

interface tabelaFiadoProps {
  listaVendasFiado: vendaFiadoProps[]
  carregandoListaVendasFiados: boolean
  carregandoListaItensVenda: boolean
  processandoPagamento: boolean
  vendasSelecionadas: Array<string>
  buscaItensSacolaVenda: (vendaId: string) => void
  selecionarVenda: (vendaId: Array<string>) => number
}

export function TabelaVendasFiadoAberto({
  listaVendasFiado,
  carregandoListaItensVenda,
  carregandoListaVendasFiados,
  processandoPagamento,
  vendasSelecionadas,
  buscaItensSacolaVenda,
  selecionarVenda,
}: tabelaFiadoProps) {
  const [filtroCliente, setarFiltroCliente] = useState<string>('')
  const [valorTotalSerPago, setarValorPago] = useState<number>(0)

  const listaVendasFiadoFiltro =
    filtroCliente.length === 0
      ? []
      : listaVendasFiado.filter((cliente: vendaFiadoProps) =>
          cliente.ven_cliente
            .toLowerCase()
            .includes(filtroCliente.toLowerCase()),
        )

  const selecionaVenda = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setarValorPago(
        selecionarVenda([...vendasSelecionadas, event.target.value]),
      )
    } else {
      setarValorPago(
        selecionarVenda(
          vendasSelecionadas.filter((venda) => venda !== event.target.value),
        ),
      )
    }
  }
  return (
    <>
      <div className="d-flex flex-column">
        <div className="form-floating mb-3">
          <input
            type="text"
            disabled={
              carregandoListaVendasFiados || listaVendasFiado.length === 0
            }
            className="form-control"
            key="filtroClienteFiado"
            placeholder="Filtrar pelo nome do cliente"
            onChange={(event) => {
              setarFiltroCliente(event.target.value)
            }}
          />
          <label htmlFor="filtroClienteFiado">
            Filtrar pelo nome do cliente
          </label>
        </div>
        {vendasSelecionadas.length > 0 && (
          <div className="d-flex flex-row justify-content-between">
            <div>
              <button
                title="Pagar dívida"
                type="button"
                key={'btn-pagar'}
                disabled={carregandoListaItensVenda || processandoPagamento}
                className="btn btn-success shadow m-1"
                data-bs-toggle="modal"
                data-bs-target="#finalizarFiadoVendaModal"
              >
                Pagar vendas selecionadas
              </button>
            </div>
            <div>
              <h3 className="text-center text-danger">
                Total: {formataValorMoedaBrasileira(valorTotalSerPago)}
              </h3>
            </div>
          </div>
        )}
        <div className="table-responsive mt-3">
          <table className="table border rounded">
            <caption>Lista de vendas em abertos</caption>
            <TabelaCabecalho
              colunas={[
                'Selecione',
                'Itens Comprados',
                'Cliente',
                'Data/Hora da Compra',
                'Valor (R$)',
              ]}
            />
            <tbody className="overflow-auto">
              {carregandoListaVendasFiados ? (
                <>
                  <TabelaCarregamento opcao={true} totalColunas={5} />
                  <TabelaCarregamento opcao={true} totalColunas={5} />
                  <TabelaCarregamento opcao={true} totalColunas={5} />
                </>
              ) : listaVendasFiado.length === 0 ? (
                <td colSpan={4} className="text-center p-3">
                  Nenhum venda em aberta encontrada
                </td>
              ) : listaVendasFiadoFiltro.length > 0 ? (
                listaVendasFiadoFiltro.map((venda) => {
                  return (
                    <tr key={crypto.randomUUID()}>
                      <th>
                        <div className="form-check">
                          <input
                            className="form-check-input shadow-sm"
                            style={{ width: '1.3rem', height: '1.3rem' }}
                            type="checkbox"
                            checked={vendasSelecionadas.includes(venda.ven_id)}
                            onChange={selecionaVenda}
                            value={venda.ven_id}
                            key={self.crypto.randomUUID()}
                          />
                        </div>
                      </th>
                      <td className="w-auto" scope="row">
                        <button
                          title="Visualizar itens da compra"
                          type="button"
                          key={'btn-visualizar-itens-' + venda.ven_id}
                          className="btn btn-info shadow m-1"
                          onClick={() => buscaItensSacolaVenda(venda.ven_id)}
                          data-bs-toggle="modal"
                          data-bs-target="#itensCompradoVendaModal"
                        >
                          <ListNumbers size={32} color="#ffffff" />
                        </button>
                      </td>
                      <td className="w-50">{venda.ven_cliente}</td>
                      <td className="w-auto">{venda.ven_data}</td>
                      <td className="w-auto">
                        {formataValorMoedaBrasileira(Number(venda.ven_total))}
                      </td>
                    </tr>
                  )
                })
              ) : (
                listaVendasFiado.map((venda) => {
                  return (
                    <tr key={crypto.randomUUID()}>
                      <th className="w-auto">
                        <div className="form-check m-3">
                          <input
                            className="form-check-input shadow-sm"
                            style={{ width: '1.3rem', height: '1.3rem' }}
                            type="checkbox"
                            checked={vendasSelecionadas.includes(venda.ven_id)}
                            onChange={selecionaVenda}
                            value={venda.ven_id}
                            key={self.crypto.randomUUID()}
                          />
                        </div>
                      </th>
                      <td className="w-auto" scope="row">
                        <button
                          title="Visualizar itens da compra"
                          type="button"
                          key={'btn-visualizar-itens-' + venda.ven_id}
                          className="btn btn-info shadow m-1"
                          disabled={carregandoListaItensVenda}
                          onClick={() => buscaItensSacolaVenda(venda.ven_id)}
                          data-bs-toggle="modal"
                          data-bs-target="#itensCompradoVendaModal"
                        >
                          <ListNumbers size={32} color="#ffffff" />
                        </button>
                      </td>
                      <td className="w-50">{venda.ven_cliente}</td>
                      <td className="w-auto">{venda.ven_data}</td>
                      <td className="w-auto">
                        {formataValorMoedaBrasileira(Number(venda.ven_total))}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
