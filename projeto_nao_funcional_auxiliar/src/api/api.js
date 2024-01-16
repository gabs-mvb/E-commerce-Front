import axios from "axios";

const IP = {
    gabriel: `http://10.18.34.91:8080`,
    local: `http://localhost:8080`
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