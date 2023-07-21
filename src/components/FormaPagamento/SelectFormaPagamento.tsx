import { useId } from 'react'
import { formaPagamento } from '../../interfaces/interfaceFormaPagamento'

interface selectFormaPagamentoProps {
  listaFormaPagamento: formaPagamento[]
  carregandoLista: boolean
  formaPagamentoSelecionado: string
  selecionarFormaPagamento: (token: string) => void
}

export function SelectFormaPagamento({
  listaFormaPagamento,
  carregandoLista,
  formaPagamentoSelecionado,
  selecionarFormaPagamento,
}: selectFormaPagamentoProps) {
  const idSelectFormaPagamento = useId()

  return (
    <div className="form-floating">
      <select
        disabled={carregandoLista}
        className="form-select"
        key={idSelectFormaPagamento}
        value={formaPagamentoSelecionado}
        onChange={(event) => {
          selecionarFormaPagamento(event.target.value)
        }}
      >
        <option value={''} disabled>
          {!carregandoLista ? 'Selecione' : 'Carregando formas de pagamento...'}
        </option>
        {listaFormaPagamento.map((formaPagamento) => {
          return formaPagamento.status ? (
            <option value={formaPagamento.token} key={formaPagamento.token}>
              {formaPagamento.nome}
            </option>
          ) : (
            <></>
          )
        })}
      </select>
      <label htmlFor={idSelectFormaPagamento}>Forma de pagamento</label>
    </div>
  )
}
