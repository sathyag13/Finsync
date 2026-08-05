import api from "../api/axios";

export const getAccounts = async () => {
  const response = await api.get("/accounts");
  return response.data;
};

export const createAccount = async (account) => {
  const response = await api.post("/accounts", account);
  return response.data;
};