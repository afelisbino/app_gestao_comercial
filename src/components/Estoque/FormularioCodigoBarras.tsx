import { useRef } from 'react'

interface formularioCodigoBarrasProps {
  adicionaCodigoBarras: (codigoBarras: string) => void
  limparListaCodigoBarras: () => void
  cadastroProduto: boolean
  cadastrandoCodigo: boolean
}

export function FormularioCodigoBarras({
  adicionaCodigoBarras,
  limparListaCodigoBarras,
  cadastroProduto,
  cadastrandoCodigo,
}: formularioCodigoBarrasProps) {
  const codigoBarraProdutoRef = useRef<HTMLInputElement>(null)

  function adicionar() {
    const codigoBarraProduto = codigoBarraProdutoRef.current?.value ?? null

    if (codigoBarraProduto) adicionaCodigoBarras(codigoBarraProduto)

    if (codigoBarraProdutoRef.current) codigoBarraProdutoRef.current.value = ''

    if (codigoBarraProdutoRef.current) codigoBarraProdutoRef.current.focus()
  }

  return (
    <>
      <div className="row align-middle gap-2">
        <div className="col-12 col-md-4 col-lg-4">
          <div className="form-floating">
            <input
              type="text"
              name="pcb_codigo_cadastro_produto"
              id="pcb_codigo_cadastro_produto"
              className="form-control"
              placeholder="Codigo de barras"
              ref={codigoBarraProdutoRef}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()

                  adicionar()
                }
              }}
            />
            <label htmlFor="pcb_codigo_cadastro_produto">
              Codigo de barras
            </label>
          </div>
        </div>
        <div className="col-12 col-md-4 col-lg-4 d-grid">
          <button
            type="button"
            className="btn btn-lg btn-success shadow"
            disabled={cadastrandoCodigo && !cadastroProduto}
            onClick={() => adicionar()}
          >
            {cadastrandoCodigo ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
        {cadastroProduto ? (
          <div className="col-12 col-md-4 col-lg-4 d-grid">
            <button
              type="button"
              className="btn btn-lg btn-danger shadow"
              onClick={limparListaCodigoBarras}
            >
              Remover todos
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
