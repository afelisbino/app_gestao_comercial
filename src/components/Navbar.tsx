import { UserCircle } from "phosphor-react";
import { menuPrincipalProps } from "../interfaces/interfaceMenu";
import { opcaoMenuProps } from "../interfaces/interfaceNavbar";

const menuApp: menuPrincipalProps[] = [
  {
    id: self.crypto.randomUUID(),
    categoria: "Home",
    admin: false,
  },
  {
    id: self.crypto.randomUUID(),
    categoria: "Administrar",
    admin: false,
    itens: [
      {
        id: self.crypto.randomUUID(),
        nome: "Categorias",
        telaItem: "Categoria",
        admin: true,
      },
      // {
      //   nome: "Cardápio",
      //   telaItem: "Cardapio",
      // },
      {
        id: self.crypto.randomUUID(),
        nome: "Fornecedores",
        telaItem: "Fornecedor",
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: "Produtos",
        telaItem: "Produtos",
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: "Estoque",
        telaItem: "Estoque",
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: "Movimentação de caixa",
        telaItem: "MovimentacaoCaixa",
        admin: false,
      },
      {
        id: self.crypto.randomUUID(),
        nome: "Vendas fiado",
        telaItem: "ListarFiado",
        admin: false,
      },
      // {
      //   nome: "Usuários",
      //   telaItem: "Usuario",
      // },
    ],
  },
  {
    id: self.crypto.randomUUID(),
    categoria: "Relatórios",
    admin: true,
    itens: [
      {
        id: self.crypto.randomUUID(),
        nome: "Vendas",
        telaItem: "RelatorioVenda",
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: "Caixa",
        telaItem: "RelatorioCaixa",
        admin: true,
      },
      {
        id: self.crypto.randomUUID(),
        nome: "Estoque",
        telaItem: "RelatorioEstoque",
        admin: true,
      },
    ],
  },
];

function logout() {
  localStorage.clear();
  window.location.reload();
}

const Navbar = ({ selecionarOpcaoMenu }: opcaoMenuProps) => {
  return (
    <nav className="navbar bg-light fixed-top shadow">
      <div className="container-fluid">
        <button
          className="navbar-toggler float-start"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-start"
          tabIndex={-1}
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Gescomm
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 ">
              {menuApp.map(({ id, categoria, itens, admin }) => {
                if (itens === undefined) {
                  return (
                    <li key={id} className="nav-item">
                      <a
                        key={id + "-categoria"}
                        className="nav-link"
                        href="#"
                        data-bs-dismiss="offcanvas"
                        onClick={() => {
                          selecionarOpcaoMenu(categoria);
                        }}
                      >
                        {categoria}
                      </a>
                    </li>
                  );
                } else {
                  return (
                    <li key={id} className="nav-item dropdown">
                      {localStorage.getItem("tipoUsuario") === "0" ? (
                        !admin ? (
                          <a
                            key={id + "-categoria"}
                            className="nav-link dropdown-toggle"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {categoria}
                          </a>
                        ) : (
                          <></>
                        )
                      ) : (
                        <a
                          key={id + "-categoria"}
                          className="nav-link dropdown-toggle"
                          href="#"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {categoria}
                        </a>
                      )}
                      <ul className="dropdown-menu">
                        {localStorage.getItem("tipoUsuario") === "0"
                          ? itens.map(({ id, telaItem, nome, admin }) => {
                              if (!admin) {
                                return (
                                  <li key={id}>
                                    <a
                                      key={id + "-item"}
                                      className="dropdown-item"
                                      href="#"
                                      data-bs-dismiss="offcanvas"
                                      onClick={() => {
                                        selecionarOpcaoMenu(telaItem);
                                      }}
                                    >
                                      {nome}
                                    </a>
                                  </li>
                                );
                              }
                            })
                          : itens.map(({ id, telaItem, nome }) => {
                              return (
                                <li key={id}>
                                  <a
                                    key={id + "-item"}
                                    className="dropdown-item"
                                    href="#"
                                    data-bs-dismiss="offcanvas"
                                    onClick={() => {
                                      selecionarOpcaoMenu(telaItem);
                                    }}
                                  >
                                    {nome}
                                  </a>
                                </li>
                              );
                            })}
                      </ul>
                    </li>
                  );
                }
              })}
            </ul>
            <hr />
            <div className="dropdown">
              <a
                href="#"
                className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <UserCircle size={32} color="#2a2828" />
                <strong>
                  {localStorage.getItem("tipoUsuario") === "1"
                    ? " Administrador"
                    : " Operador"}
                </strong>
              </a>
              <ul className="dropdown-menu text-small shadow">
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => logout()}
                  >
                    Sair
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
