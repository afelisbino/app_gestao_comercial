import axios from "axios";
import authorization from "./TokenApp";

const instanciaAxios = axios.create({
    baseURL: "http://localhost:8282/api/public/index.php/api/",
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json, multipart/form-data',
        Authorization: authorization
    }
});

export default instanciaAxios;