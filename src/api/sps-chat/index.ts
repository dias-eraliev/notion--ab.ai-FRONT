import api from '..';

export const spsChatApi = {
    initSession: async (data?: { instructions?: string }) => {
        const response = await api.post('/sps-chat/init-session', data || {});
        return response.data;
    }
}