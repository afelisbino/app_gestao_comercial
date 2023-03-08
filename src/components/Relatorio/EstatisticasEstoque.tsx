import { FormEvent, useEffect, useState } from "react";
import { historicoEstoqueEmpresaProps } from "../../interfaces/interfaceHistoricoEstoqueEmpresa";
import { TabelaHistoricoEstoque } from "../Estoque/TabelaHistoricoEstoque";
import { buscarListaHistoricoEstoque } from "../../controllers/ProdutoController";
import { buscaEstatisticasEstoque } from "../../controllers/EstoqueController";
import { graficoRoscaDataSetsProps } from "../../interfaces/interfaceGraficos";
import { Rosca } from "../Graficos/Rosca";
import { Spinner } from "../Loaders/Spinner";
import {
  produtoMaisVendidoProps,
  quantidadeMovimentacoesEstoqueProps,
} from "../../interfaces/interfaceEstoque";
import { Alerta } from "../Alerta";
import { Cards } from "../Cards";

export function EstatisticasEstoque() {
  const [listaHistoricoEstoque, setarListaHistoricoEstoque] = useState<
    historicoEstoqueEmpresaProps[]
  >([]);

  const [carregandoEstatisticaEstoque, carregarEstatisticaEstoque] =
    useState(false);

  const [quantidadeProdutosEstoque, setarquantidadeProdutosEstoque] =
    useState<number>(0);
  const [
    quantidadeProdutosEstoqueMinimo,
    setarquantidadeProdutosEstoqueMinimo,
  ] = useState<number>(0);
  const [
    quantidadeProdutosEstoqueZerado,
    setarquantidadeProdutosEstoqueZerado,
  ] = useState<number>(0);
  const [quantidadeProdutosDesativados, setarquantidadeProdutosDesativados] =
    useState<number>(0);

  const [labelsGraficoProdutosVendidos, setarLabelGraficoProdutosVendidos] =
    useState<string[]>([]);
  const [dadosGraficoProdutosVendidos, setarDadosGraficoProdutosVendidos] =
    useState<graficoRoscaDataSetsProps[]>([]);
  const [
    labelsGraficoMovimentacaoEstoque,
    setarLabelGraficoMovimentacaoEstoque,
  ] = useState<string[]>([]);
  const [
    dadosGraficoMovimentacaoEstoque,
    setarDadosGraficoMovimentacaoEstoque,
  ] = useState<graficoRoscaDataSetsProps[]>([]);

  const [carregandoListaHistoricoEstoque, carregarListaHistoricoEstoque] =
    useState(false);
  const [dataInicio, setarDataInicio] = useState<Date | null>(null);
  const [dataFim, setarDataFim] = useState<Date | null>(null);

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  function buscaHistoricoEstoque(event: FormEvent) {
    event.preventDefault();

    if (dataInicio !== null && dataFim !== null) {
      if (dataInicio > dataFim) {
        alertarMensagemSistema(
          "warning",
          "A data final não pode ser maior que a data inicial!"
        );

        return;
      }
    }

    listarHistoricoEstoque();

    montaEstatisticasEstoque();
  }

  async function listarHistoricoEstoque() {
    carregarListaHistoricoEstoque(true);

    setarListaHistoricoEstoque(
      await buscarListaHistoricoEstoque(
        dataInicio?.toISOString() ?? null,
        dataFim?.toISOString() ?? null
      )
    );

    carregarListaHistoricoEstoque(false);
  }

  async function montaEstatisticasEstoque() {
    carregarEstatisticaEstoque(true);

    const dadosEstatisticosEstoque = await buscaEstatisticasEstoque(
      dataInicio?.toISOString() ?? null,
      dataFim?.toISOString() ?? null
    );

    setarquantidadeProdutosEstoque(dadosEstatisticosEstoque.quantidade_estoque);
    setarquantidadeProdutosDesativados(
      dadosEstatisticosEstoque.quantidade_estoque_desativado
    );
    setarquantidadeProdutosEstoqueMinimo(
      dadosEstatisticosEstoque.quantidade_estoque_minimo
    );
    setarquantidadeProdutosEstoqueZerado(
      dadosEstatisticosEstoque.quantidade_estoque_zerado
    );

    setarLabelGraficoProdutosVendidos(
      dadosEstatisticosEstoque.produtos_vendidos.map(
        (produto: produtoMaisVendidoProps) => produto.nome_produto
      )
    );

    setarDadosGraficoProdutosVendidos([
      {
        label: "Qtd. Vendido",
        data: dadosEstatisticosEstoque.produtos_vendidos.map(
          (produto: produtoMaisVendidoProps) => {
            return produto.quantidade_vendido;
          }
        ),
        backgroundColor: ["rgb(255,140,0)", "rgb(139,0,0)", "rgb(72,61,139)"],
        borderWidth: 1,
        hoverOffset: 8,
      },
    ]);

    setarLabelGraficoMovimentacaoEstoque(
      dadosEstatisticosEstoque.quantidade_movimentacoes.map(
        (movimentacao: quantidadeMovimentacoesEstoqueProps) =>
          movimentacao.tipo_movimentacao.toLocaleUpperCase("pt-BR")
      )
    );

    setarDadosGraficoMovimentacaoEstoque([
      {
        label: "Qtd. Movimentacao",
        data: dadosEstatisticosEstoque.quantidade_movimentacoes.map(
          (movimentacao: quantidadeMovimentacoesEstoqueProps) =>
            movimentacao.total_movimentacoes
        ),
        backgroundColor: ["rgb(255,99,71)", "rgb(144,238,144)"],
        borderWidth: 1,
        hoverOffset: 8,
      },
    ]);

    carregarEstatisticaEstoque(false);
  }

  useEffect(() => {
    listarHistoricoEstoque();
    montaEstatisticasEstoque();
  }, []);

  return (
    <>
      {mensagemAlerta !== null ? (
        <div className="row mt-4">
          <div className="col-12">
            <Alerta tipo={tipoAlerta} mensagem={mensagemAlerta} />
          </div>
        </div>
      ) : (
        <></>
      )}
      <form
        onSubmit={buscaHistoricoEstoque}
        className="row row-cols-lg-auto g-3 mt-5"
      >
        <div className="col-12 col-lg-5 col-md-5">
          <div className="form-floating">
            <input
              type="date"
              autoComplete="off"
              className="form-control"
              id="venDataInicio"
              disabled={carregandoListaHistoricoEstoque}
              onChange={(event) => setarDataInicio(event.target?.valueAsDate)}
              required
              placeholder="Data de inicio"
            />
            <label htmlFor="venDataInicio">Data de inicio</label>
          </div>
        </div>
        <div className="col-12 col-lg-5 col-md-5">
          <div className="form-floating">
            <input
              type="date"
              autoComplete="off"
              className="form-control"
              disabled={carregandoListaHistoricoEstoque}
              id="venDataFim"
              onChange={(event) => setarDataFim(event.target?.valueAsDate)}
              required
              placeholder="Data final"
            />
            <label htmlFor="venDataFim">Data final</label>
          </div>
        </div>
        <div className="col-12 col-lg-2 col-md-2">
          <div className="d-grid">
            {carregandoListaHistoricoEstoque ? (
              <button
                className="btn btn-success btn-lg shadow my-1"
                type="button"
                disabled
              >
                Buscando...
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-success btn-lg shadow my-1"
              >
                Buscar
              </button>
            )}
          </div>
        </div>
      </form>
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
                id="geral-tab"
                data-bs-toggle="tab"
                data-bs-target="#geral-tab-pane"
                type="button"
                role="tab"
                aria-controls="geral-tab-pane"
                aria-selected="true"
              >
                Visão geral
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link text-bg-light"
                id="detalhado-tab"
                data-bs-toggle="tab"
                data-bs-target="#detalhado-tab-pane"
                type="button"
                role="tab"
                aria-controls="detalhado-tab-pane"
                aria-selected="false"
              >
                Mais detalhes
              </button>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="geral-tab-pane"
              role="tabpanel"
              aria-labelledby="geral-tab"
              tabIndex={0}
            >
              <div className="row mt-3">
                <div className="d-flex justify-content-center flex-wrap align-items-center p-auto">
                  {carregandoEstatisticaEstoque ? (
                    <div className="m-auto">
                      <Spinner />
                    </div>
                  ) : (
                    <>
                      <div className="m-auto">
                        <Cards
                          nome="Produtos disponível em estoque"
                          valor={quantidadeProdutosEstoque}
                          cor={"text-bg-secondary"}
                        />
                      </div>
                      <div className="m-auto">
                        <Cards
                          nome="Produtos no estoque mínimo"
                          valor={quantidadeProdutosEstoqueMinimo}
                          cor={"text-bg-secondary"}
                        />
                      </div>
                      <div className="m-auto">
                        <Cards
                          nome="Produtos com estoque zerado"
                          valor={quantidadeProdutosEstoqueZerado}
                          cor={"text-bg-secondary"}
                        />
                      </div>
                      <div className="m-auto">
                        <Cards
                          nome="Produtos desativados"
                          valor={quantidadeProdutosDesativados}
                          cor={"text-bg-secondary"}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              {labelsGraficoMovimentacaoEstoque.length === 0 &&
              labelsGraficoProdutosVendidos.length === 0 ? (
                <></>
              ) : (
                <div className="row mt-4">
                  <div className="d-flex justify-content-center flex-wrap align-items-center p-auto">
                    <div className="m-auto">
                      <Rosca
                        tituloGrafico="Movimentações do estoque"
                        labels={labelsGraficoMovimentacaoEstoque}
                        datasets={dadosGraficoMovimentacaoEstoque}
                      />
                    </div>
                    <div className="m-auto">
                      <Rosca
                        tituloGrafico="Produtos mais vendidos"
                        labels={labelsGraficoProdutosVendidos}
                        datasets={dadosGraficoProdutosVendidos}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className="tab-pane fade"
              id="detalhado-tab-pane"
              role="tabpanel"
              aria-labelledby="detalhado-tab"
              tabIndex={0}
            >
              <div className="row mt-3">
                <div className="col-12">
                  <TabelaHistoricoEstoque
                    listaHistoricoEstoque={listaHistoricoEstoque}
                    carregandoListaHistorico={carregandoListaHistoricoEstoque}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
