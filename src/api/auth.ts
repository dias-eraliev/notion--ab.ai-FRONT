import api from ".";
import { LoginDto } from "../types/dto/auth.dto";

export const authApi = {
    login: async (data: LoginDto) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    }
}