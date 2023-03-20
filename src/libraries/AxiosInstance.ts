import axios from "axios";
import authorization from "./TokenApp";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const instanciaAxios = axios.create({
    baseURL: BASE_URL,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
        Authorization: authorization
    }
});

export default instanciaAxios;