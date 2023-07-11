import { useId } from 'react'
import { Placeholder } from '../Loaders/Placeholder'
import { PlaceholderButton } from '../Loaders/PlaceholderButton'

interface tabelaCarregamentoProps {
  totalColunas: number
  opcao: boolean
}

export function TabelaCarregamento({
  totalColunas,
  opcao,
}: tabelaCarregamentoProps) {
  const idCarregamento = useId()

  return (
    <tr key={idCarregamento}>
      {(() => {
        const colunaCarregando = []

        for (let coluna = 0; coluna < totalColunas; coluna++) {
          if (coluna === 0) {
            colunaCarregando.push(
              <th
                scope="row"
                key={self.crypto.randomUUID()}
                className="w-auto m-0"
              >
                {opcao ? <PlaceholderButton /> : <Placeholder />}
              </th>,
            )
          } else {
            colunaCarregando.push(
              <td key={self.crypto.randomUUID()} className="w-auto m-0">
                <Placeholder />
              </td>,
            )
          }
        }

        return colunaCarregando
      })()}
    </tr>
  )
}
