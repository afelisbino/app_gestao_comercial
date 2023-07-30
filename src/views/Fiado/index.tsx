import { useEffect, useState } from 'react'
import { TabelaItensVenda } from '../../components/Vendas/TabelaItensVenda'
import {
  itensVendaProps,
  pagamentoVenda,
  vendaFiadoProps,
} from '../../interfaces/interfaceVenda'
import {
  listaItensVenda,
  listaVendaFiadoAberto,
  processaPagamentoVendaFiado,
} from '../../controllers/VendaController'
import { Spinner } from '../../components/Loaders/Spinner'
import { Alerta } from '../../components/Alerta'
import { TabelaVendasFiadoAberto } from '../../components/Vendas/Fiado/TabelaVendasFiadoAberto'
import { ListaPagamentos } from '../../components/Vendas/ListaPagamentos'
import { PagamentoVenda } from '../../components/Vendas/PagamentoVenda'
import { formataValorMoedaBrasileira } from '../../controllers/NumeroController'

const Fiado = () => {
  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null)
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>('info')

  const [carregandoListaVendasFiados, carregarListaVendas] = useState(false)
  const [carregandoListaItensVenda, carregarListaItensVenda] = useState(false)
  const [processandoPagamento, processarPagamentoVendaFiado] = useState(false)

  const [listaItensSacolaVenda, setarListaItensSacolaVenda] = useState<
    itensVendaProps[]
  >([])
  const [listaVendasFiado, setarListaVendasFiado] = useState<vendaFiadoProps[]>(
    [],
  )
  const [listaPagamento, setarListaPagamento] = useState<pagamentoVenda[]>([])
  const [vendaSelecionada, selecionarVenda] = useState<{
    listaVendaFiadoSelecionado: Array<string>
    totalPagar: number
  }>({
    listaVendaFiadoSelecionado: [],
    totalPagar: 0,
  })

  const calculaTotalVendaSelecionado = (
    vendaSelecionada: Array<string>,
  ): number => {
    const totalPagar: Array<number> = []

    vendaSelecionada.forEach((venda) => {
      const vendasFiado = listaVendasFiado.find(
        (vendaFiado) => vendaFiado.ven_id === venda,
      )
      totalPagar.push(Number(vendasFiado?.ven_total ?? 0))
    })

    selecionarVenda({
      listaVendaFiadoSelecionado: vendaSelecionada,
      totalPagar: totalPagar.reduce(
        (total, valorPagar) => total + valorPagar,
        0,
      ),
    })

    return totalPagar.reduce((total, valorPagar) => total + valorPagar, 0)
  }

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo)
    alertarMensagem(mensagem)

    setTimeout(() => {
      alertarMensagem(null)
    }, 10000)
  }

  function adicionarPagamento(
    valorPago: number,
    formaPagamentoSelecionado: string,
    formaPagamentoNome: string,
  ) {
    setarListaPagamento([
      ...listaPagamento,
      {
        formaPagamentoNome,
        formaPagamentoToken: formaPagamentoSelecionado,
        valorPago,
        pagamentoId: self.crypto.randomUUID(),
      },
    ])
  }

  const valorPago = listaPagamento.reduce(
    (valorPago, pagamento) => valorPago + pagamento.valorPago,
    0,
  )
  const valorTrocoCompra: number =
    valorPago > 0 ? valorPago - vendaSelecionada.totalPagar : 0

  const pagaVendaFiado = async () => {
    const valorSerPago = vendaSelecionada.totalPagar

    if (listaPagamento.length === 0) {
      alertarMensagemSistema(
        'warning',
        'Precisa selecionar o tipo de pagamento!',
      )
    } else if (vendaSelecionada.listaVendaFiadoSelecionado.length === 0) {
      alertarMensagemSistema(
        'warning',
        'Precisa selecionar ao menos uma venda!',
      )
    } else if (valorPago < valorSerPago || valorPago <= 0) {
      alertarMensagemSistema(
        'warning',
        'Total pago está inferior ao valor total da conta!',
      )
    } else {
      processarPagamentoVendaFiado(true)

      const status = await processaPagamentoVendaFiado(
        vendaSelecionada.listaVendaFiadoSelecionado,
        listaPagamento,
      )

      processarPagamentoVendaFiado(false)
      selecionarVenda({
        listaVendaFiadoSelecionado: [],
        totalPagar: 0,
      })
      setarListaPagamento([])
      buscaListaVendas()
      alertarMensagemSistema(status.status ? 'success' : 'warning', status.msg)
    }
  }

  async function buscaListaVendas() {
    carregarListaVendas(true)
    setarListaVendasFiado(await listaVendaFiadoAberto())
    carregarListaVendas(false)
  }

  async function buscaItensSacolaVenda(vendaToken: string) {
    carregarListaItensVenda(true)

    setarListaItensSacolaVenda(await listaItensVenda(vendaToken))

    carregarListaItensVenda(false)
  }

  useEffect(() => {
    buscaListaVendas()
  }, [])

  return (
    <>
      {processandoPagamento ? (
        <div className="row">
          <Spinner />
        </div>
      ) : (
        <></>
      )}
      {mensagemAlerta !== null ? (
        <div className="row">
          <div className="col-12">
            <Alerta tipo={tipoAlerta} mensagem={mensagemAlerta} />
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="d-flex flex-column">
        <TabelaVendasFiadoAberto
          listaVendasFiado={listaVendasFiado}
          carregandoListaItensVenda={carregandoListaItensVenda}
          carregandoListaVendasFiados={carregandoListaVendasFiados}
          processandoPagamento={processandoPagamento}
          vendasSelecionadas={vendaSelecionada.listaVendaFiadoSelecionado}
          buscaItensSacolaVenda={buscaItensSacolaVenda}
          selecionarVenda={calculaTotalVendaSelecionado}
        />
      </div>

      <div
        className="modal fade"
        id="itensCompradoVendaModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="itensCompradoVendaModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id="itensCompradoVendaModalLabel"
              >
                Itens comprados
              </h1>
              <button
                type="button"
                className="btn-close"
                disabled={carregandoListaItensVenda}
                onClick={() => {
                  setarListaItensSacolaVenda([])
                }}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <TabelaItensVenda
                listaItensVenda={listaItensSacolaVenda}
                carregandoListaItens={carregandoListaItensVenda}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="finalizarFiadoVendaModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="finalizarFiadoVendaModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id="finalizarFiadoVendaModalLabel"
              >
                Processar pagamento fiado
              </h1>
            </div>
            <div className="modal-body">
              <div className="d-flex flex-row border rounded py-2 my-3">
                <div className="col-12 col-lg-6">
                  <h4 className="text-center text-muted">
                    {'Valor a ser pago: '.concat(
                      formataValorMoedaBrasileira(vendaSelecionada.totalPagar),
                    )}
                  </h4>
                </div>
                <div className="col-12 col-lg-6">
                  <h4 className="text-center text-muted">
                    {'Total pago: ' +
                      formataValorMoedaBrasileira(
                        listaPagamento.reduce(
                          (totalPago, pagamento) =>
                            totalPago + pagamento.valorPago,
                          0,
                        ),
                      )}
                  </h4>
                </div>
              </div>
              <PagamentoVenda
                alertarMensagem={alertarMensagemSistema}
                adicionaPagamentoVenda={adicionarPagamento}
              />
              <ListaPagamentos
                listaPagamentoVenda={listaPagamento}
                excluirPagamento={(pagamentoId) => {
                  setarListaPagamento(
                    listaPagamento.filter(
                      (pagamento) => pagamento.pagamentoId !== pagamentoId,
                    ),
                  )
                }}
              />
              <hr />
              <div className="d-flex flex-row justify-content-center">
                <h1 className="text-danger text-center p-2 mt-1">
                  {'Troco: ' + formataValorMoedaBrasileira(valorTrocoCompra)}
                </h1>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Voltar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={pagaVendaFiado}
                data-bs-dismiss="modal"
              >
                Processar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Fiado
