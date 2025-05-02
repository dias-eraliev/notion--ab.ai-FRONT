import api from "@/api";

export class HrRequests {
    async getHr(data?: any) {
        return api.get(`/hr`)
    }


    async addHr(body: any) {
        try {
            // Передаем оба поля в один объект
            return api.post('/hr', body);
        } catch (error) {
            console.error("Error add hr:", error);
            throw error;
        }
    }
}