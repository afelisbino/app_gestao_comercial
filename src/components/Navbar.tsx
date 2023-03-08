import { menuPrincipalProps } from "../interfaces/interfaceMenu";
import { opcaoMenuProps } from "../interfaces/interfaceNavbar";

const menuApp: menuPrincipalProps[] = [
  {
    categoria: "Home",
  },
  {
    categoria: "Administrar",
    itens: [
      {
        nome: "Categorias",
        telaItem: "Categoria",
      },
      // {
      //   nome: "Cardápio",
      //   telaItem: "Cardapio",
      // },
      {
        nome: "Fornecedores",
        telaItem: "Fornecedor",
      },
      {
        nome: "Produtos",
        telaItem: "Produtos",
      },
      {
        nome: "Estoque",
        telaItem: "Estoque",
      },
      {
        nome: "Movimentação de caixa",
        telaItem: "MovimentacaoCaixa",
      },
      {
        nome: "Vendas fiado",
        telaItem: "ListarFiado",
      },
      {
        nome: "Usuários",
        telaItem: "Usuario",
      },
    ],
  },
  {
    categoria: "Relatórios",
    itens: [
      {
        nome: "Vendas",
        telaItem: "RelatorioVenda",
      },
      {
        nome: "Caixa",
        telaItem: "RelatorioCaixa",
      },
      {
        nome: "Estoque",
        telaItem: "RelatorioEstoque",
      },
    ],
  },
];

export function Navbar({ selecionarOpcaoMenu }: opcaoMenuProps) {
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
              {menuApp.map(({ categoria, itens }) => {
                if (itens === undefined) {
                  return (
                    <li className="nav-item">
                      <a
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
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {categoria}
                      </a>
                      <ul className="dropdown-menu">
                        {itens.map(({ telaItem, nome }) => {
                          return (
                            <li>
                              <a
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
                <img
                  src={"https://github.com/mdo.png"}
                  width="32"
                  height="32"
                  className="rounded-circle me-2"
                />
                <strong>UserName</strong>
              </a>
              <ul className="dropdown-menu text-small shadow">
                <li>
                  <a className="dropdown-item" href="#">
                    New project...
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Settings
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
