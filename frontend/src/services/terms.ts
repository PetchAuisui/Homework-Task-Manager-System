import api from "./api";

export const createTerm = async (data: any) => {
  const res = await api.post("/api/terms/", data);
  return res.data;
};

export const getTerms = async (level_id: number) => {
  const res = await api.get(`/api/terms/?level_id=${level_id}`);
  return res.data.terms;
};
