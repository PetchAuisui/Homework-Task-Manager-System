import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLevels } from "../services/education";
import { getSubjects } from "../services/subjects";

export default function LevelsSubjectsPage() {
  const [levels, setLevels] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any>({});
  const navigate = useNavigate();

  // โหลดระดับชั้นทั้งหมด
  const loadLevels = async () => {
    const data = await getLevels();
    setLevels(data);

    // โหลดวิชาแยกแต่ละระดับชั้น
    const subjectMap: any = {};
    for (let lv of data) {
      subjectMap[lv.level_id] = await getSubjects(lv.level_id);
    }
    setSubjects(subjectMap);
  };

  useEffect(() => {
    loadLevels();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">ระดับชั้นทั้งหมด</h1>
        <Link
          to="/levels/add"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + เพิ่มระดับชั้น
        </Link>
      </div>

      <div className="space-y-10">
        {levels.map((lv) => (
          <div key={lv.level_id} className="border rounded-lg p-5 shadow-sm bg-white">

            {/* ชื่อระดับชั้น + ปุ่มเพิ่มวิชา */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {lv.name}
              </h2>

              <button
                onClick={() =>
                  navigate(`/subjects/add?level_id=${lv.level_id}`)
                }
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
              >
                + เพิ่มวิชา
              </button>
            </div>

            {/* รายวิชาในระดับนี้ */}
            <div className="flex flex-wrap gap-3">
              {subjects[lv.level_id]?.length > 0 ? (
                subjects[lv.level_id].map((sb: any) => (
                  <div
                    key={sb.subject_id}
                    className="px-6 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium shadow-sm hover:bg-indigo-200 cursor-pointer"
                  >
                    {sb.name}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">ยังไม่มีวิชา</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
