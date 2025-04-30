import api from "@/api";

export class ScheduleRequests {
    async getScheduleAll(groupId: number) {
        try {

            return api.get(`/schedule?groupId=${groupId}`)

        } catch (e) {
            console.error("Error fetching scheduler:", e);
        }
    }
}