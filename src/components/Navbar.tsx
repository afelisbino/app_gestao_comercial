import { menuPrincipalProps } from "../interfaces/interfaceMenu";
import { opcaoMenuProps } from "../interfaces/interfaceNavbar";

const menuApp: menuPrincipalProps[] = [
  {
    categoria: "Home",
    admin: false,
  },
  {
    categoria: "Administrar",
    admin: false,
    itens: [
      {
        nome: "Categorias",
        telaItem: "Categoria",
        admin: true,
      },
      // {
      //   nome: "Cardápio",
      //   telaItem: "Cardapio",
      // },
      {
        nome: "Fornecedores",
        telaItem: "Fornecedor",
        admin: true,
      },
      {
        nome: "Produtos",
        telaItem: "Produtos",
        admin: true,
      },
      {
        nome: "Estoque",
        telaItem: "Estoque",
        admin: true,
      },
      {
        nome: "Movimentação de caixa",
        telaItem: "MovimentacaoCaixa",
        admin: true,
      },
      {
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
    categoria: "Relatórios",
    admin: true,
    itens: [
      {
        nome: "Vendas",
        telaItem: "RelatorioVenda",
        admin: true,
      },
      {
        nome: "Caixa",
        telaItem: "RelatorioCaixa",
        admin: true,
      },
      {
        nome: "Estoque",
        telaItem: "RelatorioEstoque",
        admin: true,
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
              {menuApp.map(({ categoria, itens, admin }) => {
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
                      {localStorage.getItem("tipoUsuario") === "0" ? (
                        !admin ? (
                          <a
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
                          ? itens.map(({ telaItem, nome, admin }) => {
                              if (!admin) {
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
                              }
                            })
                          : itens.map(({ telaItem, nome }) => {
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
          </div>
        </div>
      </div>
    </nav>
  );
}
