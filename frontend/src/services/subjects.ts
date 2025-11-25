import api from "./api";

export interface Subject {
  subject_id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  color_tag?: string | null;
  level_id?: number | null;
}

export const getSubjects = async (
  level_id?: number | null
): Promise<Subject[]> => {
  const url = level_id ? `/api/subjects/?level_id=${level_id}` : "/api/subjects/";
  const res = await api.get(url);
  return res.data;
};

export const createSubject = async (data: {
  name: string;
  code?: string | null;
  description?: string | null;
  color_tag?: string | null;
  level_id?: number | null;
}) => {
  const res = await api.post("/api/subjects/", data);
  return res.data;
};
