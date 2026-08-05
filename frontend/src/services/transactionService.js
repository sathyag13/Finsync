import api from "../api/axios";

export const getTransactions = async () => {
  const response = await api.get("/transactions");
  return response.data;
};

export const deposit = async (data) => {
  const response = await api.post("/transactions/deposit", data);
  return response.data;
};

export const withdraw = async (data) => {
  const response = await api.post("/transactions/withdraw", data);
  return response.data;
};

export const transfer = async (data) => {
  const response = await api.post("/transactions/transfer", data);
  return response.data;
};