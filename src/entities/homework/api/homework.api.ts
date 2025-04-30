import axios from "axios";
import { Homework } from "../../../shared/types/homework";

const API_BASE = "https://localhost:8080";

export const getHomework = async (params: any): Promise<Homework[]> => {
  const res = await axios.get(`${API_BASE}/homework`, { params });
  return res.data;
};

export const submitSolution = async (homeworkId: number, solution: string) => {
  const res = await axios.post(`${API_BASE}/homework/${homeworkId}/solution`, { solution });
  return res.data;
};
