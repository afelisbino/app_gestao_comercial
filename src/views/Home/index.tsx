import React, { Suspense, useState } from "react";
import Menu from "../../components/Menu";
import { Spinner } from "../../components/Loaders/Spinner";

const Home = () => {
  const [menuSelecionado, selecionarMenu] = useState<any>(import("../Venda"));

  const Tela = React.lazy(async () => menuSelecionado);

  return (
    <>
      <header>
        <Menu selecionarOpcaoMenu={selecionarMenu} />
      </header>
      <main className="container-fluid pt-5 mt-5">
        <Suspense fallback={<Spinner />}>
          <Tela />
        </Suspense>
      </main>
    </>
  );
};

export default Home;
