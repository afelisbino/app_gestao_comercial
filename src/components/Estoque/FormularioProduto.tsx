import { FormEvent, useEffect, useState } from 'react'
import {
  adicionaMascaraValor,
  calculaPorcentagemLucroProduto,
  calculaValorLucroProduto,
  formataValorMoedaBrasileira,
  removeFormatoMoedaBrasileira,
} from '../../controllers/NumeroController'
import { OpcaoCategoria } from '../Categorias/OpcaoCategoria'
import { OpcaoFornecedor } from '../Fornecedores/OpcaoFornecedor'
import { produtoProps } from '../../interfaces/interfaceProdutos'
import { fornecedorProps } from '../../interfaces/interfaceFornecedor'
import { categoriaProps } from '../../interfaces/interfaceCategoria'
import { retornoRequisicaoProps } from '../../interfaces/interfaceReturnoRequisicao'
import {
  alterarProduto,
  cadastrarProduto,
} from '../../controllers/ProdutoController'
import { buscarListaFornecedores } from '../../controllers/FornecedorController'
import { buscarListaCategoria } from '../../controllers/CategoriaController'
import { FormularioCodigoBarras } from './FormularioCodigoBarras'
import { TabelaCodigoBarras } from './TabelaCodigoBarras'
import { codigoBarrasProps } from '../../interfaces/interfaceCodigoBarrasProduto'

interface formularioProdutoProps {
  alertarMensagem: (tipo: string, mensagem: string) => void
  atualizarListaProdutos: () => void
  processandoFormulario: (processando: boolean) => void
  dadosProduto?: produtoProps | null
}

export function FormularioProduto({
  dadosProduto,
  processandoFormulario,
  alertarMensagem,
  atualizarListaProdutos,
}: formularioProdutoProps) {
  const [nomeProduto, setarNomeProduto] = useState<string | null>(null)
  const [descricaoProduto, setarDescricaoProduto] = useState<string | null>(
    null,
  )

  const [categoriaSelecionado, selecionarOpcaoCategoria] = useState<string>('')
  const [fornecedorSelecionado, selecionarOpcaoFornecedor] =
    useState<string>('')

  const [listaFornecedores, setarListaFornecedor] = useState<fornecedorProps[]>(
    [],
  )
  const [listaCategorias, setarListaCategorias] = useState<categoriaProps[]>([])

  const [carregandoFornecedores, carregarFornecedor] = useState(false)
  const [carregandoCategorias, carregarCategorias] = useState(false)

  const [precoVendaProduto, setarPrecoVenda] = useState<string | null>(null)
  const [valorCustoProduto, setarValorCustoProduto] = useState<string | null>(
    null,
  )

  const [qtdAtualEstoque, setarQtdAtualEstoque] = useState<string | null>(null)
  const [qtdMinimaEstoque, setarQtdMinimaEstoque] = useState<string | null>(
    null,
  )

  const [listaCodigoBarras, setarListaCodigoBarras] = useState<
    codigoBarrasProps[]
  >([])
  const [enviandoDados, enviarDados] = useState<boolean>(false)

  const percentualLucro =
    precoVendaProduto || valorCustoProduto
      ? adicionaMascaraValor(
          calculaPorcentagemLucroProduto(
            removeFormatoMoedaBrasileira(precoVendaProduto ?? '0'),
            removeFormatoMoedaBrasileira(valorCustoProduto ?? '0'),
          ).toString(),
        )
      : adicionaMascaraValor(
          calculaPorcentagemLucroProduto(
            dadosProduto?.pro_valor_venda ?? 0,
            dadosProduto?.pro_preco_custo ?? 0,
          ).toString(),
        )

  const valorLucro =
    precoVendaProduto || valorCustoProduto
      ? formataValorMoedaBrasileira(
          calculaValorLucroProduto(
            removeFormatoMoedaBrasileira(precoVendaProduto ?? '0'),
            removeFormatoMoedaBrasileira(valorCustoProduto ?? '0'),
          ),
        )
      : formataValorMoedaBrasileira(
          calculaValorLucroProduto(
            dadosProduto?.pro_valor_venda ?? 0,
            dadosProduto?.pro_preco_custo ?? 0,
          ),
        )

  const salvar = async (event: FormEvent) => {
    event.preventDefault()

    enviarDados(true)
    processandoFormulario(true)

    const status: retornoRequisicaoProps = !dadosProduto?.pro_id
      ? await cadastrarProduto(
          JSON.stringify({
            nomeProduto,
            precoVendaProduto: removeFormatoMoedaBrasileira(
              precoVendaProduto ?? '0,00',
            ),
            precoCompraProduto: removeFormatoMoedaBrasileira(
              valorCustoProduto ?? '0,00',
            ),
            descricaoProduto,
            tokenCategoria: categoriaSelecionado,
            tokenFornecedor: fornecedorSelecionado,
            estoqueAtualProduto: removeFormatoMoedaBrasileira(
              qtdAtualEstoque ?? '0,00',
            ),
            estoqueMinimoProduto: removeFormatoMoedaBrasileira(
              qtdMinimaEstoque ?? '0,00',
            ),
            codigoBarrasProduto: listaCodigoBarras,
          }),
        )
      : await alterarProduto(
          JSON.stringify({
            tokenProduto: dadosProduto?.pro_id,
            nomeProduto: (nomeProduto || dadosProduto.pro_nome) ?? '',
            precoVendaProduto: removeFormatoMoedaBrasileira(
              (precoVendaProduto ||
                adicionaMascaraValor(
                  dadosProduto.pro_valor_venda.toString(),
                )) ??
                '0,00',
            ),
            precoCompraProduto: removeFormatoMoedaBrasileira(
              (valorCustoProduto ||
                adicionaMascaraValor(
                  dadosProduto.pro_preco_custo.toString(),
                )) ??
                '0,00',
            ),
            descricaoProduto:
              (descricaoProduto || dadosProduto?.pro_descricao) ?? '',
            tokenCategoria:
              (categoriaSelecionado || dadosProduto?.cat_token) ?? '',
            tokenFornecedor:
              (fornecedorSelecionado || dadosProduto?.frn_token) ?? '',
            estoqueAtualProduto: removeFormatoMoedaBrasileira(
              (qtdAtualEstoque ||
                adicionaMascaraValor(dadosProduto.est_qtd_atual.toString())) ??
                '0,00',
            ),
            estoqueMinimoProduto: removeFormatoMoedaBrasileira(
              (qtdMinimaEstoque ||
                adicionaMascaraValor(dadosProduto.est_qtd_minimo.toString())) ??
                '0,00',
            ),
          }),
        )
    alertarMensagem(status.status ? 'success' : 'warning', status.msg)
    limpaFormulario()
    processandoFormulario(false)
    enviarDados(false)
    atualizarListaProdutos()
  }

  const limpaFormulario = () => {
    setarNomeProduto(null)
    setarDescricaoProduto(null)
    setarPrecoVenda(null)
    setarValorCustoProduto(null)
    setarQtdAtualEstoque(null)
    setarQtdMinimaEstoque(null)
  }

  async function listarFornecedores() {
    carregarFornecedor(true)

    setarListaFornecedor(await buscarListaFornecedores())

    carregarFornecedor(false)
  }

  async function listarCategorias() {
    carregarCategorias(true)

    setarListaCategorias(await buscarListaCategoria())

    carregarCategorias(false)
  }

  useEffect(() => {
    listarCategorias()
    listarFornecedores()
  }, [])

  return (
    <form onSubmit={salvar}>
      <div className="row gap-2 gap-lg-0">
        <div className="col-12">
          <div className="form-floating mb-2">
            <input
              type="text"
              name="pro_nome"
              id="pro_nome"
              className="form-control"
              placeholder="Nome do produto"
              value={(nomeProduto || dadosProduto?.pro_nome) ?? ''}
              onChange={(event) => setarNomeProduto(event.target.value)}
              required
            />
            <label htmlFor="pro_nome">Nome do produto</label>
          </div>
        </div>
        <div className="col-md-2 col-lg-2 col-sm-12">
          <div className="form-floating">
            <input
              type="text"
              name="pro_qtd_atual"
              id="pro_qtd_atual"
              className="form-control"
              placeholder="Qtd. Atual"
              value={(qtdAtualEstoque || dadosProduto?.est_qtd_atual) ?? '0'}
              onChange={(event) => setarQtdAtualEstoque(event.target.value)}
              onBlur={() => {
                setarQtdAtualEstoque(
                  adicionaMascaraValor(
                    (qtdAtualEstoque ||
                      dadosProduto?.est_qtd_atual.toString()) ??
                      '0',
                  ),
                )
              }}
              required
            />
            <label htmlFor="pro_qtd_atual">Qtd. Atual</label>
          </div>
        </div>
        <div className="col-md-2 col-lg-2 col-sm-12">
          <div className="form-floating">
            <input
              type="text"
              name="pro_qtd_minimo"
              id="pro_qtd_minimo"
              className="form-control"
              placeholder="Qtd. Mínimo"
              value={(qtdMinimaEstoque || dadosProduto?.est_qtd_minimo) ?? '0'}
              onChange={(event) => setarQtdMinimaEstoque(event.target.value)}
              onBlur={() => {
                setarQtdMinimaEstoque(
                  adicionaMascaraValor(
                    (qtdMinimaEstoque ||
                      dadosProduto?.est_qtd_minimo.toString()) ??
                      '0',
                  ),
                )
              }}
              required
            />
            <label htmlFor="pro_qtd_minimo">Qtd. Mínimo</label>
          </div>
        </div>
        <div className="col-md-2 col-lg-2 col-sm-12">
          <div className="form-floating">
            <input
              type="text"
              name="pro_preco_custo"
              id="pro_preco_custo"
              className="form-control"
              placeholder="Preço de custo"
              value={
                valorCustoProduto ||
                adicionaMascaraValor(
                  dadosProduto?.pro_preco_custo.toString() ?? '0',
                )
              }
              onChange={(event) => {
                setarValorCustoProduto(event.target.value)
              }}
              onBlur={() =>
                setarValorCustoProduto(
                  adicionaMascaraValor(
                    (valorCustoProduto ||
                      dadosProduto?.pro_preco_custo.toString()) ??
                      '0',
                  ),
                )
              }
            />
            <label htmlFor="pro_preco_custo">Preço de custo</label>
          </div>
        </div>
        <div className="col-md-2 col-lg-2 col-sm-12">
          <div className="form-floating">
            <input
              type="text"
              name="pro_preco_venda"
              id="pro_preco_venda"
              className="form-control"
              placeholder="Preço de venda"
              value={
                precoVendaProduto ||
                adicionaMascaraValor(
                  dadosProduto?.pro_valor_venda.toString() ?? '0',
                )
              }
              onChange={(event) => {
                setarPrecoVenda(event.target.value)
              }}
              onBlur={() => {
                setarPrecoVenda(
                  adicionaMascaraValor(
                    (precoVendaProduto ||
                      dadosProduto?.pro_valor_venda.toString()) ??
                      '0',
                  ),
                )
              }}
              required
            />
            <label htmlFor="pro_preco_venda">Preço de venda</label>
          </div>
        </div>

        <div className="col-md-2 col-lg-2 col-sm-12">
          <div className="form-floating">
            <input
              type="text"
              name="pro_lucro_produto"
              id="pro_lucro_produto"
              className="form-control"
              placeholder="Lucro produto"
              value={valorLucro}
              disabled
            />
            <label htmlFor="pro_lucro_produto">Lucro (R$)</label>
          </div>
        </div>
        <div className="col-md-2 col-lg-2 col-sm-12">
          <div className="form-floating">
            <input
              type="text"
              name="pro_porcentagem_lucro"
              id="pro_porcentagem_lucro"
              className="form-control"
              placeholder="Margem de lucro"
              value={percentualLucro}
              disabled
            />
            <label htmlFor="pro_porcentagem_lucro">Lucro (%)</label>
          </div>
        </div>
        <div className="col-sm-12 col-lg-6 col-md-6 mt-2">
          <OpcaoCategoria
            listaCategoria={listaCategorias}
            carregandoCategorias={carregandoCategorias}
            nomeSelect="cat_id_produto_estoque"
            categoriaEscolhida={
              (categoriaSelecionado || dadosProduto?.cat_token) ?? ''
            }
            selecionarOpcaoCategoria={selecionarOpcaoCategoria}
          />
        </div>
        <div className="col-sm-12 col-lg-6 col-md-6 mt-2">
          <OpcaoFornecedor
            listaFornecedor={listaFornecedores}
            carregandoFornecedores={carregandoFornecedores}
            nomeSelect="frn_id_produto_estoque"
            fornecedorSelecionado={
              (dadosProduto?.frn_token || fornecedorSelecionado) ?? ''
            }
            selecionarOpcaoFornecedor={selecionarOpcaoFornecedor}
          />
        </div>
        <div className="col-12 mb-3 mt-2">
          <div className="form-floating">
            <textarea
              className="form-control"
              placeholder="Descrição do produto"
              id="pro_descricao"
              style={{ height: '5rem' }}
              value={(descricaoProduto || dadosProduto?.pro_descricao) ?? ''}
              onChange={(event) => setarDescricaoProduto(event.target.value)}
            ></textarea>
            <label htmlFor="pro_descricao">Descrição</label>
          </div>
        </div>
      </div>
      {dadosProduto?.pro_id ? (
        <></>
      ) : (
        <>
          <FormularioCodigoBarras
            cadastroProduto={true}
            cadastrandoCodigo={enviandoDados}
            limparListaCodigoBarras={() => setarListaCodigoBarras([])}
            adicionaCodigoBarras={(codigoBarras) => {
              setarListaCodigoBarras([
                ...listaCodigoBarras,
                { pcb_codigo: codigoBarras },
              ])
            }}
          />
          <div className="row mt-2 ">
            <div className="col-12">
              <TabelaCodigoBarras
                listaCodigoBarras={listaCodigoBarras}
                processandoRequisicao={false}
                buscandoListaCodigoBarras={false}
                removerCodigoBarras={(id, item) => {
                  setarListaCodigoBarras([
                    ...listaCodigoBarras.slice(0, item),
                    ...listaCodigoBarras.slice(item + 1),
                  ])
                }}
              />
            </div>
          </div>
        </>
      )}
      <div className="row">
        <div className="col-sm-12 col-md-2 col-lg-2">
          <div className="d-grid gap-2 mx-auto">
            <button
              type="submit"
              id="btnCadastraProduto"
              className="btn btn-success btn-lg shadow"
              data-bs-dismiss="modal"
              disabled={enviandoDados}
            >
              {enviandoDados ? 'Salvando ...' : 'Salvar'}
            </button>
          </div>
        </div>
        <div className="col-sm-12 col-md-2 col-lg-2">
          <div className="d-grid gap-2 mx-auto">
            <button
              type="button"
              id="btnCancelaCadastroProduto"
              className="btn btn-danger btn-lg shadow"
              data-bs-dismiss="modal"
              onClick={limpaFormulario}
              disabled={enviandoDados}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
