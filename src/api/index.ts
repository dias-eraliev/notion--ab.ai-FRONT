import axios from 'axios';

const api = axios.create({
    baseURL: "https://backend.abai.live",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default api;