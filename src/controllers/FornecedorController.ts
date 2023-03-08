import instanciaAxios from "../libraries/AxiosInstance";

import { fornecedorProps } from './../interfaces/interfaceFornecedor';

export async function buscarListaFornecedores(): Promise<fornecedorProps[]> {
    return await instanciaAxios
        .get<fornecedorProps[]>("fornecedor/listar")
        .then(({ data }) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}