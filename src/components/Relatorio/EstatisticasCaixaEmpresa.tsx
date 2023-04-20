import { useId } from "react";
import { Cards } from "../Cards";
import {
  estatisticaFechamentoCaixa,
  estatisticaMovimentacaoCaixa,
  estatisticaReceitaLucro,
  relatorioCaixa,
} from "../../interfaces/interfaceRelatorioCaixa";
import {
  adicionaMascaraValor,
  formataValorMoedaBrasileira,
} from "../../controllers/NumeroController";
import { Linha } from "../Graficos/Linha";
import { Barras } from "../Graficos/Barras";

interface estatisticaCaixaEmpresaProps {
  dados: relatorioCaixa;
}

export function EstatisticasCaixaEmpresa({
  dados,
}: estatisticaCaixaEmpresaProps) {
  const idEstatisticas = useId();

  const labelFechamentoCaixa = dados.fechamento.map(
    (label: estatisticaFechamentoCaixa) => label.data
  );
  const dadosGraficoFechamentoCaixa = dados.fechamento.map(
    (valorFechamento: estatisticaFechamentoCaixa) =>
      valorFechamento.valorFechamento
  );

  const labelReceitasLucros = dados.valoresReceitaLucro.map(
    (label: estatisticaReceitaLucro) => label.data
  );
  const dadosGraficoReceita = dados.valoresReceitaLucro.map(
    (valorReceita: estatisticaReceitaLucro) => valorReceita.valorReceita
  );
  const dadosGraficoLucro = dados.valoresReceitaLucro.map(
    (valorLucro: estatisticaReceitaLucro) => valorLucro.valorLucro
  );

  const labelMovimentacaoCaixa = dados.valoresMovimentacoes.map(
    (label: estatisticaMovimentacaoCaixa) => label.data
  );
  const dadosGraficoEntradaManualCaixa = dados.valoresMovimentacoes.map(
    (valorEntrada: estatisticaMovimentacaoCaixa) => valorEntrada.valorEntrada
  );
  const dadosGraficoSaidaManualCaixa = dados.valoresMovimentacoes.map(
    (valorSaida: estatisticaMovimentacaoCaixa) => valorSaida.valorSaida
  );

  return (
    <>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-start justify-content-xxl-center overflow-auto gap-2 py-3 px-3 px-xl-0">
          <div className="col-auto">
            <Cards
              nome={"Receitas"}
              valor={formataValorMoedaBrasileira(
                Number(dados.resumo.valorTotalReceita)
              )}
              cor={"text-bg-secondary bg-secondary bg-gradient"}
            />
          </div>
          <div className="col-auto">
            <Cards
              nome={"Saídas Manuais"}
              valor={formataValorMoedaBrasileira(
                Number(dados.resumo.valorTotalSaida)
              )}
              cor={"text-bg-secondary bg-secondary bg-gradient"}
            />
          </div>
          <div className="col-auto">
            <Cards
              nome={"Entradas Manuais"}
              valor={formataValorMoedaBrasileira(
                Number(dados.resumo.valorTotalEntrada)
              )}
              cor={"text-bg-secondary bg-secondary bg-gradient"}
            />
          </div>
          <div className="col-auto">
            <Cards
              nome={"Ganhos (R$)"}
              valor={formataValorMoedaBrasileira(
                Number(dados.resumo.valorTotalLucro)
              )}
              cor={"text-bg-secondary bg-secondary bg-gradient"}
            />
          </div>
          <div className="col-auto">
            <Cards
              nome={"Ganhos (%)"}
              valor={adicionaMascaraValor(
                dados.resumo.porcentagemTotalLucro.toString()
              )}
              cor={"text-bg-secondary bg-secondary bg-gradient"}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6 col-lg-6 col-xxl-4">
            <Linha
              tituloGrafico="Valores fechamento de caixa"
              labels={labelFechamentoCaixa}
              datasets={[
                {
                  label: "Total em caixa (R$)",
                  data: dadosGraficoFechamentoCaixa,
                  backgroundColor: "rgb(72,61,139)",
                  borderColor: "rgb(72,61,139)",
                },
              ]}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-6 col-xxl-4">
            <Linha
              tituloGrafico="Receita x Lucro"
              labels={labelReceitasLucros}
              datasets={[
                {
                  label: "Receita (R$)",
                  data: dadosGraficoReceita,
                  backgroundColor: "rgb(46,139,87)",
                  borderColor: "rgb(46,139,87)",
                },
                {
                  label: "Lucro (R$)",
                  data: dadosGraficoLucro,
                  backgroundColor: "rgb(152,251,152)",
                  borderColor: "rgb(152,251,152)",
                },
              ]}
            />
          </div>
          <div className="col-12 col-xxl-4">
            <Barras
              tituloGrafico="Entrada x Saídas manual do caixa"
              labels={labelMovimentacaoCaixa}
              datasets={[
                {
                  label: "Entrada (R$)",
                  data: dadosGraficoEntradaManualCaixa,
                  backgroundColor: "rgb(60,179,113)",
                },
                {
                  label: "Saida (R$)",
                  data: dadosGraficoSaidaManualCaixa,
                  backgroundColor: "rgb(178,34,34)",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
