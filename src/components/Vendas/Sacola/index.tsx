import { useId } from "react";
import { itemSacolaProp } from "../../../interfaces/interfaceSacola";
import { ItemSacola } from "./ItemSacola";
import { formataValorMoedaBrasileira } from "../../../controllers/NumeroController";

interface sacolaVendaProps {
  itensSacola: itemSacolaProp[];
  processandoVenda: boolean;
  excluirItemSacola: (idItem: string) => void;
}

export function Sacola({
  itensSacola,
  processandoVenda,
  excluirItemSacola,
}: sacolaVendaProps) {
  const idSacola = useId();
  const totalCompra = itensSacola.reduce(
    (total: number, produto: itemSacolaProp) => {
      return (total += produto.scl_sub_total);
    },
    0
  );

  return (
    <div key={idSacola} className="sacola-venda border rounded p-2">
      <h3 className="text-center mt-2">Itens do carrinho</h3>
      <div>
        <h1 id="venTotal" className="text-center border rounded py-3">
          {formataValorMoedaBrasileira(totalCompra)}
        </h1>
      </div>
      <ul className="list-group overflow-auto">
        {itensSacola.length === 0 ? (
          <>
            <hr />
            <h5 className="text-center">Nenhum item adicionado!</h5>
          </>
        ) : (
          itensSacola.map((item: itemSacolaProp) => {
            return (
              <ItemSacola
                processandoVenda={processandoVenda}
                id={item.id}
                scl_qtd={item.scl_qtd}
                scl_sub_total={item.scl_sub_total}
                pro_nome={item.pro_nome}
                excluirItem={excluirItemSacola}
              />
            );
          })
        )}
      </ul>
    </div>
  );
}
