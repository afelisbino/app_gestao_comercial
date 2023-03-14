import axios from "axios";
import authorization from "./TokenApp";

const instanciaAxios = axios.create({
    baseURL: "https://api.manstock.com.br/public/index.php/api/",
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json, multipart/form-data',
        Authorization: authorization
    }
});

export default instanciaAxios;