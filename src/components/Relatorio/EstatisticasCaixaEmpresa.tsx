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

import imgNenhumDado from "../../assets/images/empty-data.svg";

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
      <div key={idEstatisticas} className="d-flex flex-column">
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
        <div className="row mt-3">
          {dados.resumo.valorTotalReceita === 0 &&
          dados.resumo.valorTotalSaida === 0 &&
          dados.resumo.valorTotalEntrada === 0 &&
          dados.resumo.valorTotalLucro === 0 &&
          dados.resumo.porcentagemTotalLucro === 0 ? (
            <div className="d-flex flex-column gap-3 p-3">
              <strong className="h4 text-center">
                Nenhuma informação pesquisado!
              </strong>
              <div className="d-flex justify-content-center">
                <img
                  src={imgNenhumDado}
                  alt="Nenhuma informação encontrado"
                  className="img-thumbnail border-0 imagem-vazio"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="col-12 col-md-6 col-lg-6 col-xxl-4">
                <Linha
                  tituloGrafico="Fechamentos"
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
                  tituloGrafico="Ganhos"
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
                  tituloGrafico="Movimentações manuais"
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
            </>
          )}
        </div>
      </div>
    </>
  );
}
