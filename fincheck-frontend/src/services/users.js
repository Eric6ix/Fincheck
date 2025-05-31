import api from "./api";

export const fetchUserInfo = async () => {
  const response = await api.get("/user");
  return response.data;
};
export const fetchWalletUserInfo = async () => {
  const response = await api.get("/user");
  return response.data;
};
