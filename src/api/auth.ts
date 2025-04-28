import api from ".";

export const authApi = {
    login: async (data: {
        username: string;
        password: string;
        rememberMe: boolean;
    }) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },
    me: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
}