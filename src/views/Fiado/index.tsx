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

const Fiado = () => {
  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null)
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>('info')

  const [tokenVenda, setarTokenVenda] = useState<string>('')

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

  const pagaVendaFiado = async () => {
    if (listaPagamento.length === 0) {
      alertarMensagemSistema(
        'warning',
        'Precisa selecionar o tipo de pagamento!',
      )
    } else if (tokenVenda === '') {
      alertarMensagemSistema(
        'warning',
        'Venda não encontrada, entre em contato com o desenvolvedor!',
      )
    } else {
      processarPagamentoVendaFiado(true)

      const status = await processaPagamentoVendaFiado(
        tokenVenda,
        listaPagamento,
      )

      processarPagamentoVendaFiado(false)
      buscaListaVendas()
      selecionarTipoPagamento('')
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
      <TabelaVendasFiadoAberto
        listaVendasFiado={listaVendasFiado}
        carregandoListaItensVenda={carregandoListaItensVenda}
        carregandoListaVendasFiados={carregandoListaVendasFiados}
        processandoPagamento={processandoPagamento}
        buscaItensSacolaVenda={buscaItensSacolaVenda}
        finalizarVendaFiado={setarTokenVenda}
      />
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
              <PagamentoVenda
                alertarMensagem={alertarMensagemSistema}
                adicionaPagamentoVenda={adicionarPagamento}
              />
              <div className="row">
                <div className="col-12">
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
                </div>
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
