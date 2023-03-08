import { categoriaProps } from './../interfaces/interfaceCategoria';
import instanciaAxios from "../libraries/AxiosInstance";

export async function buscarListaCategoria(): Promise<categoriaProps[]> {
    return await instanciaAxios
        .get<categoriaProps[]>("categoria/listar")
        .then(({ data }) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}