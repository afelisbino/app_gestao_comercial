import { Plus } from 'phosphor-react'
import { NumericFormat } from 'react-number-format'
import { SelectFormaPagamento } from '../FormaPagamento/SelectFormaPagamento'
import { FormEvent, useLayoutEffect, useState } from 'react'
import { formaPagamento } from '../../interfaces/interfaceFormaPagamento'
import { buscaListaFormaPagamento } from '../../controllers/FormaPagamentoController'

interface pagamentoVendaProps {
  adicionaPagamentoVenda: (
    valorPago: number,
    formaPagamento: string,
    formaPagamentoNome: string,
  ) => void
  alertarMensagem: (tipo: string, mensagem: string) => void
}

export function PagamentoVenda(props: pagamentoVendaProps) {
  const [listaFormaPagamento, setarListaFormaPagamento] = useState<
    formaPagamento[]
  >([])
  const [formaPagamentoSelecionado, selecionarFormaPagamento] =
    useState<string>('')

  const [valorPagoVenda, setarValorPagoVenda] = useState<number>(0)

  async function listarFormaPagamento() {
    setarListaFormaPagamento(await buscaListaFormaPagamento())
  }

  const adicionaPagamento = (event: FormEvent) => {
    event.preventDefault()

    if (
      formaPagamentoSelecionado === '' ||
      formaPagamentoSelecionado === null
    ) {
      props.alertarMensagem('warning', 'Forma de pagamento não selecionado!')
      return
    }

    if (valorPagoVenda <= 0) {
      props.alertarMensagem('warning', 'Valor pago não pode estar zerado!')
      return
    }

    const formaPagamentoNome = listaFormaPagamento.find(
      (formaPagamento) => formaPagamento.token === formaPagamentoSelecionado,
    )?.nome

    props.adicionaPagamentoVenda(
      valorPagoVenda,
      formaPagamentoSelecionado,
      formaPagamentoNome ?? '',
    )

    setarValorPagoVenda(0)
    selecionarFormaPagamento('')
  }

  useLayoutEffect(() => {
    listarFormaPagamento()
  }, [])

  return (
    <form onSubmit={adicionaPagamento}>
      <div className="d-flex flex-row justify-content-center justify-content-lg-between gap-2 mb-0">
        <div className="col-12 col-lg-5">
          <SelectFormaPagamento
            listaFormaPagamento={listaFormaPagamento}
            carregandoLista={false}
            selecionarFormaPagamento={selecionarFormaPagamento}
            formaPagamentoSelecionado={formaPagamentoSelecionado}
          />
        </div>
        <div className="col-12 col-lg-5">
          <div className="form-floating mb-3">
            <NumericFormat
              required
              className="form-control"
              displayType="input"
              decimalSeparator={','}
              thousandSeparator={'.'}
              allowLeadingZeros={true}
              decimalScale={2}
              allowNegative={false}
              value={valorPagoVenda}
              onValueChange={(value) => {
                setarValorPagoVenda(parseFloat(value.value) ?? 0)
              }}
            />
            <label htmlFor="valorPago">Valor pago</label>
          </div>
        </div>
        <div>
          <button
            className="btn btn-success btn-shadow btn-lg"
            type="submit"
            title="Adicionar pagamento"
          >
            <Plus size={32} color="#ffffff" />
          </button>
        </div>
      </div>
    </form>
  )
}
