import { FormEvent, useEffect, useRef, useState } from 'react'
import {
  atualizaFormaPagamento,
  atualizaStatusFormaPagamento,
  buscaListaFormaPagamento,
  buscarListaCategoriaFormaCarregamento,
  salvaFormaPagamento,
} from '../../controllers/FormaPagamentoController'
import { Alerta } from '../../components/Alerta'
import { Spinner } from 'phosphor-react'
import { TabelaFormaPagamento } from '../../components/Tabela/TabelaFormaPagamento'
import {
  categoriaFormaPgamento,
  formaPagamento,
} from '../../interfaces/interfaceFormaPagamento'
import { retornoRequisicaoProps } from '../../interfaces/interfaceReturnoRequisicao'
import ButtonLoader from '../../components/Loaders/ButtonLoader'

const FormaPagamento = () => {
  const [processandoRequisicao, processarRequisicao] = useState(false)
  const [carregandoLista, carregarLista] = useState(false)

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null)
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>('info')

  const [listaFormaPagamento, setarListaFormaPagamento] = useState<
    formaPagamento[]
  >([])

  const [categoriaFormaPagamento, setarListaFormaCarregamento] =
    useState<categoriaFormaPgamento[]>()
  const [buscandoCategoria, buscarCategoria] = useState(false)

  const [formaPagamentoToken, setarFormaPagamentoToken] = useState<
    string | null
  >(null)
  const [formaPagamentoNome, setarFormaPagamentoNome] = useState<string>()
  const [categoriaPagamentoSelecionado, selecionarCategoriaPagamento] =
    useState<string | null>(null)

  const inputNomeFormaPagamentoRef = useRef<HTMLInputElement>(null)

  async function buscaCategoriaFormaPagamento() {
    buscarCategoria(true)
    setarListaFormaCarregamento(await buscarListaCategoriaFormaCarregamento())
    buscarCategoria(false)
  }

  function limparCampos() {
    setarFormaPagamentoToken(null)
    setarFormaPagamentoNome('')
    selecionarCategoriaPagamento(null)

    if (inputNomeFormaPagamentoRef.current) {
      inputNomeFormaPagamentoRef.current.focus()
    }
  }

  async function listarFormaPagamento() {
    carregarLista(true)
    setarListaFormaPagamento(await buscaListaFormaPagamento())
    carregarLista(false)
  }

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo)
    alertarMensagem(mensagem)

    setTimeout(() => {
      alertarMensagem(null)
    }, 10000)
  }

  async function processarFormulario(event: FormEvent) {
    event.preventDefault()

    processarRequisicao(true)

    const retornoRequisicao: retornoRequisicaoProps = !formaPagamentoToken
      ? await salvaFormaPagamento(
          formaPagamentoNome ?? '',
          categoriaPagamentoSelecionado ?? '',
        )
      : await atualizaFormaPagamento(
          formaPagamentoToken,
          formaPagamentoNome ?? '',
          categoriaPagamentoSelecionado ?? '',
        )

    processarRequisicao(false)

    if (retornoRequisicao.status) {
      limparCampos()
      listarFormaPagamento()
      alertarMensagemSistema('success', 'Forma de pagamento salvo com sucesso!')
    } else {
      alertarMensagemSistema('danger', retornoRequisicao.msg)
    }
  }

  async function alteraStatusFormaPagamento(
    tokenFormaPagamento: string,
    statusAtivo: boolean,
  ) {
    processarRequisicao(true)

    const retornoRequisicao: retornoRequisicaoProps =
      await atualizaStatusFormaPagamento(tokenFormaPagamento, statusAtivo)

    processarRequisicao(false)

    if (retornoRequisicao.status) {
      listarFormaPagamento()
      alertarMensagemSistema(
        'success',
        'Status da forma de pagamento alterado com sucesso!',
      )
    } else {
      alertarMensagemSistema('danger', retornoRequisicao.msg)
    }
  }

  useEffect(() => {
    listarFormaPagamento()
    buscaCategoriaFormaPagamento()
    if (inputNomeFormaPagamentoRef.current) {
      inputNomeFormaPagamentoRef.current.focus()
    }
  }, [])

  return (
    <>
      <div className="d-flex flex-column">
        {processandoRequisicao ? (
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
        <form onSubmit={processarFormulario}>
          <div className="row">
            <div className="col-12 col-md-6 col-lg-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="inputNomeFormaPagamento"
                  placeholder="Nome da forma de pagamento"
                  ref={inputNomeFormaPagamentoRef}
                  disabled={processandoRequisicao}
                  required
                  value={formaPagamentoNome ?? ''}
                  onChange={(event) => {
                    setarFormaPagamentoNome(event.target.value)
                  }}
                />
                <label htmlFor="inputNomeFormaPagamento">
                  Nome da forma de pagamento
                </label>
              </div>
            </div>
            <div className="col-12 col-lg-6 col-md-6">
              <div className="form-floating">
                <select
                  id="selectCategoriaPagamento"
                  className="form-select"
                  defaultValue={''}
                  value={categoriaPagamentoSelecionado ?? ''}
                  onChange={(event) =>
                    selecionarCategoriaPagamento(event.target.value)
                  }
                  required
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {!categoriaFormaPagamento ||
                  categoriaFormaPagamento.length === 0 ? (
                    <option value="" disabled>
                      Nenhuma categoria encontrado!
                    </option>
                  ) : (
                    categoriaFormaPagamento.map((categoria) => {
                      return (
                        <option key={categoria.codigo} value={categoria.codigo}>
                          {categoria.nome}
                        </option>
                      )
                    })
                  )}
                </select>
                <label htmlFor="selectCategoriaPagamento">
                  Categoria de pagamento
                </label>
              </div>
            </div>
          </div>
          <div className="d-flex flex-row gap-2 d-grid mt-2">
            {processandoRequisicao ? (
              <ButtonLoader cor={'success'} mensagem={'Processando...'} />
            ) : (
              <button
                className="btn btn-success btn-lg shadow-sm"
                type="submit"
                disabled={buscandoCategoria}
              >
                Salvar
              </button>
            )}
            <button
              className="btn btn-danger btn-lg shadow-sm"
              type="button"
              disabled={processandoRequisicao}
              onClick={limparCampos}
            >
              Cancelar
            </button>
          </div>
        </form>
        <hr />
        <TabelaFormaPagamento
          editarFormaPagamento={(
            formaPagamentoId: string,
            formaPagamentoNome: string,
            categoriaPagamento: string,
          ) => {
            setarFormaPagamentoNome(formaPagamentoNome)
            setarFormaPagamentoToken(formaPagamentoId)
            selecionarCategoriaPagamento(categoriaPagamento)
          }}
          alterarStatusFormaPagamento={alteraStatusFormaPagamento}
          processandoRequisicao={processandoRequisicao}
          carregandoListaFormaPagamento={carregandoLista}
          listaFormaPagamento={listaFormaPagamento}
        />
      </div>
    </>
  )
}

export default FormaPagamento
