import axios from "axios";

const IP = {
    local: `http://localhost:8080/api`,
    //Melhoria futura
    dominio: ``
}

const api = axios.create({
    baseURL: IP.local,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});

export default api;