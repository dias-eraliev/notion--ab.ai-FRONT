import axios from "axios";
import { Payment } from "../../../shared/types/payment";

const API_BASE = "https://localhost:8080"; 

export const getPayments = async (params: any): Promise<Payment[]> => {
  const res = await axios.get(`${API_BASE}/payments`, { params });
  return res.data;
};
