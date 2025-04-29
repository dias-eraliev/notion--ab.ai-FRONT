import api from "@/api";

export class ScheduleRequests {
    async getScheduleAll() {
        try {

            return api.get('/schedule')

        } catch (e) {
            console.error("Error fetching scheduler:", e);
        }
    }
}