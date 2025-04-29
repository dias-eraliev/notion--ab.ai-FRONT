import api from "@/api";

export class StudyPlansRequests {
    async fetchStudyPlans(page: number, limit: number) {
        try {
            return await api.get(`/study-plans?page=${page}&limit=${limit}`);
        } catch (error) {
            console.error("Error fetching StudyPlans:", error);
        }
    }

    async createStudyPlans(body: any) {
        try {

            return api.create({
                ...body
            })

        } catch (error) {
            console.error("Error fetching StudyPlans:", error);
        }
    }
}