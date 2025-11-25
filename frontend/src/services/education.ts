import api from "./api";

export interface Level {
  level_id: number;
  name: string;
  institution_name?: string | null;
}

export const getLevels = async (): Promise<Level[]> => {
  const res = await api.get("/api/education/levels");
  return res.data;
};

export const createLevel = async (data: {
  name: string;
  institution_name?: string | null;
}) => {
  const res = await api.post("/api/education/levels", data);
  return res.data;
};
