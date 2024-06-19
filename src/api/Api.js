import axios from "axios";

const IP = {
    local: `http://localhost:8080/api`,
    //TODO: Implementação futura
    dominio: ''
}

const api = axios.create({
    baseURL: IP.local,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});


const apiImg = axios.create({
    baseURL: IP.img,
    timeout: 15000
});

export {
    api,
    apiImg
};

