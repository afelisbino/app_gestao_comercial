import { useId } from "react";
import { Cards } from "../Cards";
import {
  estatisticaFechamentoCaixa,
  estatisticaMovimentacaoCaixa,
  estatisticaReceitaLucro,
  relatorioCaixa,
} from "../../interfaces/interfaceRelatorioCaixa";
import { mascaraValorMoedaBrasileira } from "../../controllers/NumeroController";
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
      <div id={idEstatisticas} className="row mt-3">
        <div className="d-flex justify-content-center align-items-center flex-nowrap">
          <div className="m-auto">
            <Cards
              nome={"Receitas"}
              valor={mascaraValorMoedaBrasileira(
                Number(dados.resumo.valorTotalReceita)
              )}
              cor={"text-bg-secondary"}
            />
          </div>
          <div className="m-auto">
            <Cards
              nome={"Saídas Manuais"}
              valor={mascaraValorMoedaBrasileira(
                Number(dados.resumo.valorTotalSaida)
              )}
              cor={"text-bg-secondary"}
            />
          </div>
          <div className="m-auto">
            <Cards
              nome={"Entradas Manuais"}
              valor={mascaraValorMoedaBrasileira(
                Number(dados.resumo.valorTotalEntrada)
              )}
              cor={"text-bg-secondary"}
            />
          </div>
          <div className="m-auto">
            <Cards
              nome={"Lucros"}
              valor={mascaraValorMoedaBrasileira(
                Number(dados.resumo.valorTotalLucro)
              )}
              cor={"text-bg-secondary"}
            />
          </div>
        </div>
      </div>
      <div className="row overflow-auto" style={{ maxHeight: "30rem" }}>
        <div className="d-inline-flex flex-row flex-wrap">
          <div className="mx-auto col-6">
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
          <div className="mx-auto col-6">
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
          <div className="mx-auto col-12">
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
