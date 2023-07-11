import { categoriaProps } from '../../interfaces/interfaceCategoria'
import { Placeholder } from '../Loaders/Placeholder'
import { Pencil } from 'phosphor-react'
import { PlaceholderButton } from '../Loaders/PlaceholderButton'

interface tabelaProps {
  editar: (id: string, nome: string) => void
  listarCategoria: categoriaProps[]
  carregandoCategoria: boolean
  processandoRequisicao: boolean
}

export function TabelaCategoria({
  listarCategoria,
  carregandoCategoria,
  processandoRequisicao,
  editar,
}: tabelaProps) {
  return (
    <div className="table-responsive mt-3 tabela-tela">
      <table className="table border rounded">
        <caption>Lista de categorias</caption>
        <thead>
          <tr>
            <th scope="col">Opções</th>
            <th scope="col">Nome</th>
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {carregandoCategoria ? (
            <>
              <tr>
                <th scope="row" className="w-auto">
                  <PlaceholderButton />
                </th>
                <td className="w-auto">
                  <Placeholder />
                </td>
              </tr>
              <tr>
                <th scope="row" className="w-auto">
                  <PlaceholderButton />
                </th>
                <td className="w-50">
                  <Placeholder />
                </td>
              </tr>
              <tr>
                <th scope="row" className="w-auto">
                  <PlaceholderButton />
                </th>
                <td className="w-50">
                  <Placeholder />
                </td>
              </tr>
            </>
          ) : listarCategoria.length === 0 ? (
            <>
              <td colSpan={4} className="text-center p-3">
                Nenhuma categoria encontrada
              </td>
            </>
          ) : (
            listarCategoria.map((categoria) => {
              return (
                <>
                  <tr>
                    <th scope="row" className="w-auto">
                      <button
                        type="button"
                        title="Editar Categoria"
                        className="btn btn-warning shadow m-1"
                        disabled={processandoRequisicao}
                        onClick={() => {
                          editar(categoria.cat_id, categoria.cat_nome)
                        }}
                      >
                        <Pencil size={32} color="#ffffff" />
                      </button>
                    </th>
                    <td className="w-100">{categoria.cat_nome}</td>
                  </tr>
                </>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
