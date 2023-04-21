import { useEffect, useState } from "react";
import { Alerta } from "../../components/Alerta";
import { Cards } from "../../components/Cards";
import {
  informacaoEstoqueProps,
  produtoMaisVendidoProps,
  quantidadeMovimentacoesEstoqueProps,
} from "../../interfaces/interfaceEstoque";
import { PlaceholderCardInfos } from "../../components/Loaders/PlaceholderCardInfos";
import { graficoRoscaDataSetsProps } from "../../interfaces/interfaceGraficos";
import { Rosca } from "../../components/Graficos/Rosca";
import { TabelaHistoricoEstoque } from "../../components/Estoque/TabelaHistoricoEstoque";
import { historicoEstoqueEmpresaProps } from "../../interfaces/interfaceHistoricoEstoqueEmpresa";
import { buscarListaHistoricoEstoque } from "../../controllers/ProdutoController";
import { buscaEstatisticasEstoque } from "../../controllers/EstoqueController";
import { Spinner } from "../../components/Loaders/Spinner";
import { adicionaMascaraValor } from "../../controllers/NumeroController";
import { FormularioFiltroDiarioRelatorio } from "../../components/Relatorio/FormularioFiltroDiarioRelatorio";
import { LoaderImage } from "../../components/Loaders/LoaderImage";

const Estoque = () => {
  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  const [estatisticaEstoque, setarEstatisticaEstoque] =
    useState<informacaoEstoqueProps>({
      quantidade_estoque: 0,
      quantidade_estoque_desativado: 0,
      quantidade_estoque_minimo: 0,
      quantidade_estoque_zerado: 0,
    });

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
  const [listaHistoricoEstoque, setarListaHistoricoEstoque] = useState<
    historicoEstoqueEmpresaProps[]
  >([]);

  const [carregandoInformacoesEstoque, carregarInformacoesEstoque] =
    useState(false);
  const [carregandoListaHistoricoEstoque, carregarListaHistoricoEstoque] =
    useState(false);

  async function listarHistoricoEstoque(
    dataInicio: string | null,
    dataFim: string | null
  ) {
    carregarListaHistoricoEstoque(true);

    setarListaHistoricoEstoque(
      await buscarListaHistoricoEstoque(dataInicio ?? null, dataFim ?? null)
    );

    carregarListaHistoricoEstoque(false);
  }

  async function montaEstatisticasEstoque(
    dataInicio: string | null,
    dataFim: string | null
  ) {
    carregarInformacoesEstoque(true);

    let dadosEstatisticosEstoque = await buscaEstatisticasEstoque(
      dataInicio ?? null,
      dataFim ?? null
    );

    setarEstatisticaEstoque(dadosEstatisticosEstoque.estatistica_estoque);
    setarLabelGraficoProdutosVendidos(
      dadosEstatisticosEstoque.produtos_mais_vendidos.map(
        (produto: produtoMaisVendidoProps) => produto.nome_produto
      )
    );

    setarDadosGraficoProdutosVendidos([
      {
        label: "Qtd. Vendido",
        data: dadosEstatisticosEstoque.produtos_mais_vendidos.map(
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

    carregarInformacoesEstoque(false);
  }

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  function aplicaFiltroBusca(dataInicioFiltro: string, dataFimFiltro: string) {
    listarHistoricoEstoque(dataInicioFiltro, dataFimFiltro);
    montaEstatisticasEstoque(dataInicioFiltro, dataFimFiltro);
  }

  useEffect(() => {
    listarHistoricoEstoque(null, null);
    montaEstatisticasEstoque(null, null);
  }, []);

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
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-start justify-content-xl-center overflow-auto gap-2 pb-3 pb-xl-0 pb-lg-0 px-3 px-xl-0">
          <>
            <div className="col-auto">
              <Cards
                nome="Produtos disponível em estoque"
                valor={adicionaMascaraValor(
                  estatisticaEstoque.quantidade_estoque.toString()
                )}
                cor={"text-bg-success bg-success bg-gradient"}
              />
            </div>
            <div className="col-auto">
              <Cards
                nome="Produtos no estoque mínimo"
                valor={estatisticaEstoque.quantidade_estoque_minimo}
                cor={"text-bg-warning bg-warning bg-gradient"}
              />
            </div>
            <div className="col-auto">
              <Cards
                nome="Produtos com estoque zerado"
                valor={estatisticaEstoque.quantidade_estoque_zerado}
                cor={"text-bg-danger bg-danger bg-gradient"}
              />
            </div>
            <div className="col-auto">
              <Cards
                nome="Produtos desativados"
                valor={estatisticaEstoque.quantidade_estoque_desativado}
                cor={"text-bg-secondary bg-secondary bg-gradient"}
              />
            </div>
          </>
        </div>
        <hr />
        <FormularioFiltroDiarioRelatorio
          filtrandoRelatorio={carregandoInformacoesEstoque}
          filtrarRelatorio={aplicaFiltroBusca}
          alertarMensagem={alertarMensagemSistema}
        />
        <hr />
        {carregandoInformacoesEstoque ? (
          <LoaderImage />
        ) : (
          <div className="d-flex justify-content-start justify-content-md-center justify-content-lg-center justify-content-xl-center overflow-auto gap-3 py-3 px-xl-0">
            <div className="col-12 col-md-auto col-lg-auto col-xl-auto">
              <Rosca
                tituloGrafico="Produtos mais vendidos"
                labels={labelsGraficoProdutosVendidos}
                datasets={dadosGraficoProdutosVendidos}
              />
            </div>

            <div className="col-12 col-md-auto col-lg-auto col-xl-auto">
              <Rosca
                tituloGrafico="Movimentações do estoque"
                labels={labelsGraficoMovimentacaoEstoque}
                datasets={dadosGraficoMovimentacaoEstoque}
              />
            </div>
          </div>
        )}
        <hr />
        <div>
          <TabelaHistoricoEstoque
            listaHistoricoEstoque={listaHistoricoEstoque}
            carregandoListaHistorico={carregandoListaHistoricoEstoque}
          />
        </div>
      </div>
    </>
  );
};

export default Estoque;
