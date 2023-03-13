import { FormEvent, useState } from "react";
import instanciaAxios from "../../libraries/AxiosInstance";
import { usuarioProps } from "../../interfaces/interfaceUsuario";
import { Alerta } from "../Alerta";

interface loginProps {
  autenticarUsuarioSistema: (validado: boolean) => void;
}

export function Login({ autenticarUsuarioSistema }: loginProps) {
  const [nomeUsuario, setarNomeUsuario] = useState<string>("");
  const [senhaUsuario, setarSenhaUsuario] = useState<string>("");
  const [autenticandoUsuario, carregarAutenticacaoUsuario] = useState(false);
  const [disparaAlerta, dispararAlerta] = useState<boolean>(false);
  const [mensagemAlerta, setarMensagemAlerta] = useState<string>("");

  async function autenticarUsuario(event: FormEvent) {
    event.preventDefault();

    carregarAutenticacaoUsuario(true);

    await instanciaAxios
      .post<usuarioProps>("usuario/autenticacao/login", {
        usuarioNome: nomeUsuario,
        usuarioSenha: senhaUsuario,
      })
      .then(({ data }) => {
        if (data.status) {
          localStorage.setItem("token", data.token);

          if (data.admin) {
            localStorage.setItem("tipoUsuario", "1");
          } else {
            localStorage.setItem("tipoUsuario", "0");
          }

          autenticarUsuarioSistema(true);
        } else {
          setarMensagemAlerta(data.msg);
          dispararAlerta(true);
          autenticarUsuarioSistema(false);
        }
      })
      .finally(() => carregarAutenticacaoUsuario(false));
  }

  return (
    <div
      className="modal modal-signin position-static d-block py-5"
      tabIndex={-1}
      role="dialog"
      id="modalSignin"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content rounded-4 border border-0 shadow-lg">
          <div className="modal-header p-5 pb-4 border-bottom-0"></div>

          <div className="modal-body p-5 pt-0">
            {disparaAlerta ? (
              <Alerta tipo="warning" mensagem={mensagemAlerta} />
            ) : (
              <></>
            )}
            <form onSubmit={autenticarUsuario}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control rounded-3"
                  id="nomeUsuarioInput"
                  placeholder="Usuario"
                  required
                  value={nomeUsuario ?? ""}
                  onChange={(event) => {
                    setarNomeUsuario(event.target.value);
                  }}
                  onPaste={(event) => {
                    setarNomeUsuario(event.clipboardData.getData);
                  }}
                />
                <label htmlFor="nomeUsuarioInput">Usuario</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="senhaUsuarioInput"
                  placeholder="Senha"
                  required
                  value={senhaUsuario ?? ""}
                  onChange={(event) => {
                    setarSenhaUsuario(event.target.value);
                  }}
                  onPaste={(event) => {
                    setarSenhaUsuario(event.clipboardData.getData);
                  }}
                />
                <label htmlFor="senhaUsuarioInput">Senha</label>
              </div>
              <button
                className="w-100 mb-2 btn btn-lg rounded-3 btn-success shadow"
                type="submit"
                disabled={autenticandoUsuario}
              >
                {autenticandoUsuario ? (
                  <>
                    <span
                      className="spinner-border spinner-border shadow"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Aguarde...</span>
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
              <hr className="my-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
