import api from "@/api";

export class StudentsRequests {
    async fetchStudents() {
        try {
            const response = await api.get('/students');


            console.log(response.data.data.Parent)

            console.log(response.data.data.Parent?.user?.username);
            return response;
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    }
}