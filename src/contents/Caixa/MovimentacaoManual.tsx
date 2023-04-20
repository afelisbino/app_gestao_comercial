import { useState } from "react";
import { registraMovimentacao } from "../../controllers/MovimentacaoCaixaController";
import { retornoRequisicaoProps } from "../../interfaces/interfaceReturnoRequisicao";
import { Spinner } from "../../components/Loaders/Spinner";
import { Alerta } from "../../components/Alerta";
import { FormularioMovimentacaoManual } from "../../components/Caixa/FormularioMovimentacaoManual";

const MovimentacaoManual = () => {
  const [processandoFormulario, processsarFormulario] = useState(false);

  const [mensagemAlerta, alertarMensagem] = useState<string | null>(null);
  const [tipoAlerta, adicionarTipoAlerta] = useState<string>("info");

  function alertarMensagemSistema(tipo: string, mensagem: string) {
    adicionarTipoAlerta(tipo);
    alertarMensagem(mensagem);

    setTimeout(() => {
      alertarMensagem(null);
    }, 10000);
  }

  async function salvaMovimentacao(
    movimentacaoValor: number,
    movimentacaoTipo: string,
    movimentacaoData: Date | null,
    movimentacaoComentario: string | null
  ) {
    if (movimentacaoValor <= 0) {
      alertarMensagemSistema(
        "warning",
        "Valor da movimentação tem que ser maior que zero!"
      );
      return;
    }

    processsarFormulario(true);

    let status: retornoRequisicaoProps = await registraMovimentacao(
      movimentacaoValor,
      movimentacaoTipo,
      movimentacaoComentario,
      movimentacaoData?.toISOString() ?? null
    );

    alertarMensagemSistema(status.status ? "success" : "warning", status.msg);
    processsarFormulario(false);
  }

  return (
    <>
      {processandoFormulario ? (
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
      <div>
        <FormularioMovimentacaoManual
          processandoFormulario={processandoFormulario}
          salvarMovimentacao={salvaMovimentacao}
        />
      </div>
    </>
  );
};

export default MovimentacaoManual;
