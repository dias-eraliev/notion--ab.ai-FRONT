import api from "@/api";

export class HrRequests {
    async getHr(data?: any) {
        return api.get(`/hr`)
    }
}