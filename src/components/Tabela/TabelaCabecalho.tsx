import { useId } from 'react'

interface cabecalhoTabelaProps {
  colunas: Array<string>
}

export function TabelaCabecalho({ colunas }: cabecalhoTabelaProps) {
  const idCabecalho = useId()

  return (
    <thead key={idCabecalho}>
      <tr>
        {colunas.map((coluna, index) => {
          return index === 0 ? (
            <th key={self.crypto.randomUUID()} scope="col" className="w-auto">
              {coluna}
            </th>
          ) : (
            <th key={self.crypto.randomUUID()} scope="col">
              {coluna}
            </th>
          )
        })}
      </tr>
    </thead>
  )
}
