import api from "@/api";

export class StudentsRequests {
    async fetchStudents() {
        try {
            return await api.get('/students');
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    }


    async fetchStudentsById(studentId: number) {
        try {
            return await api.get(`/students/${studentId}`);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    }
}