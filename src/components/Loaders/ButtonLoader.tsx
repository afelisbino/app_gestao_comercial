interface buttonLoaderProps {
  cor: string | null
  mensagem: string | null
}

const ButtonLoader = ({ cor, mensagem }: buttonLoaderProps) => {
  return (
    <button className={'btn btn-' + (cor ?? 'primary')} type="button" disabled>
      <span
        className="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span>
      {mensagem ?? 'Carregando...'}
    </button>
  )
}

export default ButtonLoader
