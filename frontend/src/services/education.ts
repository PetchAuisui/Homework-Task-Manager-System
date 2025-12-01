import api from "./api";

export interface Level {
  level_id: number;
  name: string;
  institution_name?: string | null;
}

/* -----------------------------
   แก้สำคัญที่สุด → return array
----------------------------- */
export const getLevels = async (): Promise<Level[]> => {
  const res = await api.get("/api/education/levels");

  // ป้องกัน API ส่งรูปแบบผิด และกัน undefined
  if (res?.data?.levels && Array.isArray(res.data.levels)) {
    return res.data.levels;
  }

  console.error("รูปแบบข้อมูลผิดจาก API:", res.data);
  return []; // กัน React crash
};

/* -----------------------------
   createLevel → คืนเฉพาะ level
----------------------------- */
export const createLevel = async (data: {
  name: string;
  institution_name?: string | null;
}) => {
  const res = await api.post("/api/education/levels", data);

  // ป้องกันกรณี backend ส่งข้อมูลไม่ครบ
  if (res?.data?.level) {
    return res.data;
  }

  console.error("API createLevel ส่งข้อมูลผิด:", res.data);
  return { level: null };
};
