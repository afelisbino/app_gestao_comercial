import { useEffect, useState } from "react";

import { Vendas } from "./Vendas";
import { Navbar } from "./Navbar";
import { TelaProps } from "../interfaces/interfaceTela";

import "../assets/app.css";
import { Login } from "../components/Login";
import { Categorias } from "./Categorias";
import { Fornecedores } from "./Fornecedores";
import { Listar } from "./Vendas/Fiado/Listar";
import { MovimentacoesCaixa } from "./MovimentacoesCaixa";
import { EstatisticasVenda } from "./Relatorio/EstatisticasVenda";
import { Produto } from "./Estoque/Produto";
import { Estoque } from "./Estoque";
import { EstatisticasEstoque } from "./Relatorio/EstatisticasEstoque";
import { EstatisticasCaixa } from "./Relatorio/EstatisticasCaixa";

export function AppHome() {
  const [opcaoMenu, selecionarOpcao] = useState<string | null>("");
  const [autenticado, validarAutenticacaoUsuario] = useState<boolean>(false);

  function CarregarTela({ nomeTela }: TelaProps) {
    verificarAutorizacao();

    switch (nomeTela) {
      case "Home":
        return <Vendas />;
      case "Categoria":
        return <Categorias />;
      case "Fornecedor":
        return <Fornecedores />;
      case "Produtos":
        return <Produto />;
      case "Estoque":
        return <Estoque />;
      case "ListarFiado":
        return <Listar />;
      case "MovimentacaoCaixa":
        return <MovimentacoesCaixa />;
      case "RelatorioVenda":
        return <EstatisticasVenda />;
      case "RelatorioEstoque":
        return <EstatisticasEstoque />;
      case "RelatorioCaixa":
        return <EstatisticasCaixa />;
      default:
        return <Vendas />;
    }
  }

  function verificarAutorizacao() {
    validarAutenticacaoUsuario(localStorage.getItem("token") ? true : false);
  }

  useEffect(() => {
    verificarAutorizacao();
  }, []);

  return (
    <>
      {autenticado ? (
        <header className="p-3 mb-3 border-bottom">
          <Navbar selecionarOpcaoMenu={selecionarOpcao} />
        </header>
      ) : (
        <></>
      )}

      <main className="container-fluid">
        {autenticado ? (
          <CarregarTela nomeTela={opcaoMenu} />
        ) : (
          <Login autenticarUsuarioAdm={validarAutenticacaoUsuario} />
        )}
      </main>
    </>
  );
}
