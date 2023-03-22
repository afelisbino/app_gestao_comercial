import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const instanciaAxios = axios.create({
    baseURL: BASE_URL,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ` + localStorage.getItem('token')
    }
});

export default instanciaAxios;