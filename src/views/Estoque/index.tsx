import { Minus, Plus } from 'phosphor-react'
import { useState, useEffect } from 'react'
import { NumericFormat } from 'react-number-format'
import { Alerta } from '../../components/Alerta'
import {
  registraEntradaProdutoEstoque,
  registraSaidaProdutoEstoque,
  buscaListaProdutosEstoque,
} from '../../controllers/EstoqueController'
import {
  ativarProduto,
  desativarProduto,
} from '../../controllers/ProdutoController'
import { estoqueProps } from '../../interfaces/interfaceEstoque'
import { Spinner } from '../../components/Loaders/Spinner'
import { ListaEstoque } from '../../components/Estoque/ListaEstoque'

const Estoque = () => {
  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null)
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>('info')

  const [alterandoStatusProdutoEstoque, alterarStatusProdutoEstoque] =
    useState(false)
  const [alterandoEstoque, alterarQuantidadeEstoque] = useState(false)
  const [carregandoListaProdutosEstoque, carregarListaProdutosEstoque] =
    useState(false)

  const [produtoToken, setarProdutoToken] = useState<string | null>(null)
  const [novaQuantidadeEstoque, setarNovaQuantidade] = useState<number>(0)
  const [filtroProdutoEstoque, setarFiltroProdutoEstoque] = useState<string>('')

  const [listaEstoque, setarListaEstoque] = useState<estoqueProps[]>([])

  const regexNumero = /^[0-9]+$/

  const listaProdutosEstoqueEmpresa =
    filtroProdutoEstoque.length === 0
      ? listaEstoque
      : regexNumero.test(filtroProdutoEstoque)
      ? filtraProdutoCodigoBarras(filtroProdutoEstoque)
      : filtraProdutoNome(filtroProdutoEstoque)

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo)
    alertarMensagem(mensagem)

    setTimeout(() => {
      alertarMensagem(null)
    }, 10000)
  }

  function diminuiQuantidadeEstoque() {
    setarNovaQuantidade(novaQuantidadeEstoque - 1)
  }

  function aumentaQuantidadeEstoque() {
    setarNovaQuantidade(novaQuantidadeEstoque + 1)
  }

  function zeraQuantidadeEstoque() {
    setarNovaQuantidade(0)
  }

  function alteraQuantidadeProdutoEstoque() {
    if (produtoToken) {
      if (novaQuantidadeEstoque > 0) {
        salvaEntradaEstoque(produtoToken, novaQuantidadeEstoque)
      } else if (novaQuantidadeEstoque < 0) {
        salvaSaidaEstoque(produtoToken, novaQuantidadeEstoque)
      } else {
        alertarMensagemSistema(
          'warning',
          'Quantidade precisa ser diferente de zero!',
        )
      }
    }
    zeraQuantidadeEstoque()
  }

  async function ativarProdutoEstoque(proId: string) {
    alterarStatusProdutoEstoque(true)

    await ativarProduto(proId)

    alterarStatusProdutoEstoque(false)
    buscaListaProdutoEstoque()
  }

  async function desativarProdutoEstoque(proId: string) {
    alterarStatusProdutoEstoque(true)

    await desativarProduto(proId)

    alterarStatusProdutoEstoque(false)
    buscaListaProdutoEstoque()
  }

  async function salvaEntradaEstoque(proId: string, quantidade: number) {
    alterarQuantidadeEstoque(true)

    const response = await registraEntradaProdutoEstoque(proId, quantidade)

    alterarQuantidadeEstoque(false)
    buscaListaProdutoEstoque()

    alertarMensagemSistema(
      response.status ? 'success' : 'warning',
      response.msg,
    )
  }

  async function salvaSaidaEstoque(proId: string, quantidade: number) {
    alterarQuantidadeEstoque(true)

    const response = await registraSaidaProdutoEstoque(proId, quantidade)

    alterarQuantidadeEstoque(false)
    buscaListaProdutoEstoque()

    alertarMensagemSistema(
      response.status ? 'success' : 'warning',
      response.msg,
    )
  }

  async function buscaListaProdutoEstoque() {
    carregarListaProdutosEstoque(true)
    setarListaEstoque(await buscaListaProdutosEstoque())
    carregarListaProdutosEstoque(false)
  }

  function filtraProdutoCodigoBarras(filtro: string): estoqueProps[] {
    const produtoCodigoBarras = listaEstoque.find((produto: estoqueProps) =>
      produto.pro_codigos.some((codigoBarras) => codigoBarras === filtro),
    )

    return produtoCodigoBarras ? [produtoCodigoBarras] : []
  }

  function filtraProdutoNome(filtro: string): estoqueProps[] {
    return listaEstoque.filter((produto: estoqueProps) =>
      produto.pro_nome.toLowerCase().includes(filtro.toLowerCase()),
    )
  }

  useEffect(() => {
    buscaListaProdutoEstoque()
  }, [])

  return (
    <>
      {mensagemAlerta !== null ? (
        <div className="row">
          <div className="col-12">
            <Alerta tipo={tipoAlerta} mensagem={mensagemAlerta} />
          </div>
        </div>
      ) : (
        <></>
      )}
      {alterandoStatusProdutoEstoque || alterandoEstoque ? (
        <div className="row">
          <Spinner />
        </div>
      ) : (
        <></>
      )}
      <div className="row">
        <div className="col-12">
          <div className="form-floating mb-3">
            <input
              type="text"
              disabled={carregandoListaProdutosEstoque}
              autoComplete="on"
              className="form-control"
              key="produtoPesquisa"
              placeholder="Buscar por nome do produto ou codigo de barras"
              onChange={(event) => {
                setarFiltroProdutoEstoque(event.target.value)
              }}
            />
            <label htmlFor="produtoPesquisa">
              Buscar por nome do produto ou codigo de barras
            </label>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-12">
          <ul
            className="nav nav-tabs justify-content-center"
            id="myTab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link text-bg-light active"
                id="visaoGeral-tab"
                data-bs-toggle="tab"
                data-bs-target="#visaoGeral-tab-pane"
                type="button"
                role="tab"
                aria-controls="visaoGeral-tab-pane"
                aria-selected="true"
              >
                Todos
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link text-bg-light"
                id="minimo-tab"
                data-bs-toggle="tab"
                data-bs-target="#minimo-tab-pane"
                type="button"
                role="tab"
                aria-controls="minimo-tab-pane"
                aria-selected="false"
              >
                Estoque Minimo
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link text-bg-light"
                id="zerado-tab"
                data-bs-toggle="tab"
                data-bs-target="#zerado-tab-pane"
                type="button"
                role="tab"
                aria-controls="zerado-tab-pane"
                aria-selected="false"
              >
                Estoque Zerado
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link text-bg-light"
                id="desativado-tab"
                data-bs-toggle="tab"
                data-bs-target="#desativado-tab-pane"
                type="button"
                role="tab"
                aria-controls="desativado-tab-pane"
                aria-selected="false"
              >
                Estoque Desativado
              </button>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="visaoGeral-tab-pane"
              role="tabpanel"
              aria-labelledby="visaoGeral-tab"
              tabIndex={0}
            >
              <ListaEstoque
                listaProdutos={listaProdutosEstoqueEmpresa}
                carregandoLista={carregandoListaProdutosEstoque}
                alterandoQuantidadeEstoque={alterandoEstoque}
                alterandoStatusProduto={alterandoStatusProdutoEstoque}
                alterarQuantidade={setarProdutoToken}
                ativarProdutoEstoque={ativarProdutoEstoque}
                desativarProdutoEstoque={desativarProdutoEstoque}
              />
            </div>

            <div
              className="tab-pane fade"
              id="minimo-tab-pane"
              role="tabpanel"
              aria-labelledby="minimo-tab"
              tabIndex={0}
            >
              <ListaEstoque
                listaProdutos={listaProdutosEstoqueEmpresa.filter(
                  (produto) =>
                    produto.pro_qtd_atual <= produto.pro_qtd_minimo &&
                    produto.pro_qtd_atual > 0,
                )}
                carregandoLista={carregandoListaProdutosEstoque}
                alterandoQuantidadeEstoque={alterandoEstoque}
                alterandoStatusProduto={alterandoStatusProdutoEstoque}
                alterarQuantidade={setarProdutoToken}
                ativarProdutoEstoque={ativarProdutoEstoque}
                desativarProdutoEstoque={desativarProdutoEstoque}
              />
            </div>

            <div
              className="tab-pane fade"
              id="zerado-tab-pane"
              role="tabpanel"
              aria-labelledby="zerado-tab"
              tabIndex={0}
            >
              <ListaEstoque
                listaProdutos={listaProdutosEstoqueEmpresa.filter(
                  (produto) => produto.pro_qtd_atual === 0,
                )}
                carregandoLista={carregandoListaProdutosEstoque}
                alterandoQuantidadeEstoque={alterandoEstoque}
                alterandoStatusProduto={alterandoStatusProdutoEstoque}
                alterarQuantidade={setarProdutoToken}
                ativarProdutoEstoque={ativarProdutoEstoque}
                desativarProdutoEstoque={desativarProdutoEstoque}
              />
            </div>

            <div
              className="tab-pane fade"
              id="desativado-tab-pane"
              role="tabpanel"
              aria-labelledby="desativado-tab"
              tabIndex={0}
            >
              <ListaEstoque
                listaProdutos={listaProdutosEstoqueEmpresa.filter(
                  (produto) => !produto.pro_disponivel,
                )}
                carregandoLista={carregandoListaProdutosEstoque}
                alterandoQuantidadeEstoque={alterandoEstoque}
                alterandoStatusProduto={alterandoStatusProdutoEstoque}
                alterarQuantidade={setarProdutoToken}
                ativarProdutoEstoque={ativarProdutoEstoque}
                desativarProdutoEstoque={desativarProdutoEstoque}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        tabIndex={-1}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        id="alterarQuantidadeEstoqueModal"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Alterar quantidade do estoque</h5>
              <button
                type="button"
                className="btn-close"
                disabled={alterandoEstoque}
                onClick={() => {
                  zeraQuantidadeEstoque()
                }}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <NumericFormat
                    className="form-control form-control-lg text-center"
                    displayType="input"
                    decimalSeparator={','}
                    thousandSeparator={'.'}
                    allowLeadingZeros={true}
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    value={novaQuantidadeEstoque}
                    onValueChange={(value) => {
                      setarNovaQuantidade(parseFloat(value.value) ?? 0)
                    }}
                  />
                </div>
              </div>
              <div className="row d-flex justify-content-center mt-2">
                <div className="col-auto">
                  <button
                    className="btn btn-danger btn-lg"
                    disabled={alterandoEstoque}
                    onClick={() => diminuiQuantidadeEstoque()}
                  >
                    <Minus size={32} color="#ffffff" />
                  </button>
                </div>

                <div className="col-auto">
                  <button
                    className="btn btn-success btn-lg"
                    disabled={alterandoEstoque}
                    onClick={() => aumentaQuantidadeEstoque()}
                  >
                    <Plus size={32} color="#ffffff" />
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                disabled={alterandoEstoque}
                onClick={() => {
                  zeraQuantidadeEstoque()
                }}
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success"
                disabled={alterandoEstoque}
                onClick={() => {
                  alteraQuantidadeProdutoEstoque()
                }}
                data-bs-dismiss="modal"
              >
                Alterar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Estoque
