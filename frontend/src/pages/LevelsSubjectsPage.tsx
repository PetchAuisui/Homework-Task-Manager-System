import { useEffect, useState } from "react";

// สมมติว่า service functions คืนค่า object ที่มี key เป็น 'level', 'term', 'subject'
import { getLevels, createLevel } from "../services/education";
import { getTerms, createTerm } from "../services/terms";
import { getSubjects, createSubject } from "../services/subjects";

// กำหนด Type พื้นฐานเพื่อความปลอดภัยในการพัฒนา (ถ้าคุณใช้ TypeScript)
interface Level {
  level_id: number;
  name: string;
  institution_name: string;
}

interface Term {
  term_id: number;
  name: string;
  level_id: number;
}

interface Subject {
  subject_id: number;
  name: string;
  code: string;
  description: string;
  color_tag: string;
}

// ใช้ Record เพื่อกำหนด Type ให้กับ Map ของ Terms และ Subjects
type TermsMap = Record<number, Term[]>;
type SubjectsMap = Record<number, Record<number, Subject[]>>;


export default function LevelsSubjectsPage() {
  // ใช้ Type ที่ชัดเจนยิ่งขึ้น
  const [levels, setLevels] = useState<Level[]>([]);
  const [terms, setTerms] = useState<TermsMap>({});
  const [subjects, setSubjects] = useState<SubjectsMap>({});

  const [openLevelModal, setOpenLevelModal] = useState(false);
  const [openTermModal, setOpenTermModal] = useState(false);
  const [openSubjectModal, setOpenSubjectModal] = useState(false);

  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);

  const [levelForm, setLevelForm] = useState({
    name: "",
    institution_name: "",
  });

  const [termForm, setTermForm] = useState({ name: "" });

  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    description: "",
    color_tag: "",
  });

  // โหลดข้อมูลทั้งหมด (ดึงแบบ Synchronous ในลูป)
  const loadAll = async () => {
    try {
      const lv: Level[] = await getLevels();
      setLevels(lv);

      const tMap: TermsMap = {};
      const sMap: SubjectsMap = {};

      // **ข้อสังเกต:** การดึงข้อมูลในลูปแบบนี้จะช้า ควรพิจารณาใช้ Promise.all เพื่อดึงแบบขนาน
      for (let level of lv) {
        const t: Term[] = await getTerms(level.level_id);
        tMap[level.level_id] = t;

        for (let tm of t) {
          const sb: Subject[] = await getSubjects(level.level_id, tm.term_id);

          if (!sMap[level.level_id]) sMap[level.level_id] = {};
          sMap[level.level_id][tm.term_id] = sb;
        }
      }

      setTerms(tMap);
      setSubjects(sMap);
    } catch (error) {
      console.error("Failed to load initial data:", error);
      // อาจแสดงข้อความแจ้งเตือนผู้ใช้
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ===========================
      SUBMIT FUNCTIONS (ปรับปรุง: เพิ่ม try/catch และอัปเดต State โดยตรง)
      =========================== */

  const submitLevel = async () => {
    if (!levelForm.name.trim()) {
        alert("กรุณากรอกชื่อระดับชั้น");
        return;
    }

    try {
      const res: any = await createLevel(levelForm);

      // อัปเดต levels state โดยตรง แทนการเรียก loadAll()
      setLevels((prevLevels) => [...prevLevels, res.level]);

      setOpenLevelModal(false);
      setLevelForm({ name: "", institution_name: "" });

    } catch (error) {
      console.error("Error creating level:", error);
      alert("บันทึกระดับชั้นไม่สำเร็จ! โปรดตรวจสอบการเชื่อมต่อหรือข้อมูลที่ส่ง");
    }
  };

  const submitTerm = async () => {
    if (!selectedLevel) {
        alert("ไม่พบระดับชั้นที่ถูกเลือก"); 
        return;
    }
    if (!termForm.name.trim()) {
        alert("กรุณากรอกชื่อเทอม");
        return;
    }

    try {
      const res: any = await createTerm({
        name: termForm.name,
        level_id: selectedLevel,
      });

      const newTerm: Term = res.term; // สมมติว่า API คืน object ชื่อ 'term'

      // อัปเดต terms state โดยตรง
      setTerms((prevTerms) => ({
        ...prevTerms,
        [selectedLevel]: [...(prevTerms[selectedLevel] || []), newTerm],
      }));

      setOpenTermModal(false);
      setTermForm({ name: "" });

    } catch (error) {
        console.error("Error creating term:", error);
        alert("บันทึกเทอมไม่สำเร็จ! โปรดตรวจสอบการเชื่อมต่อหรือข้อมูลที่ส่ง");
    }
  };

  const submitSubject = async () => {
    if (!selectedLevel || !selectedTerm) {
        alert("ไม่พบระดับชั้นหรือเทอมที่ถูกเลือก");
        return;
    }
    if (!subjectForm.name.trim()) {
        alert("กรุณากรอกชื่อวิชา");
        return;
    }

    try {
      const res: any = await createSubject({
        level_id: selectedLevel,
        term_id: selectedTerm,
        ...subjectForm,
      });

      const newSubject: Subject = res.subject; // สมมติว่า API คืน object ชื่อ 'subject'
      
      // อัปเดต subjects state โดยตรง
      setSubjects((prevSubjects) => {
        const updatedLevel = { ...prevSubjects[selectedLevel] };
        
        updatedLevel[selectedTerm] = [
          ...(updatedLevel[selectedTerm] || []),
          newSubject,
        ];

        return {
          ...prevSubjects,
          [selectedLevel]: updatedLevel,
        };
      });

      setOpenSubjectModal(false);
      setSubjectForm({
        name: "",
        code: "",
        description: "",
        color_tag: "",
      });
      
    } catch (error) {
        console.error("Error creating subject:", error);
        alert("บันทึกวิชาไม่สำเร็จ! โปรดตรวจสอบการเชื่อมต่อหรือข้อมูลที่ส่ง");
    }
  };

  /* ===========================
      RENDER
      =========================== */

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">จัดการชั้นเรียน / เทอม / วิชา</h1>

        <button
          onClick={() => setOpenLevelModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + เพิ่มระดับชั้น
        </button>
      </div>
      
      {/* --- */}

      {/* LEVELS */}
      <div className="space-y-10">
        {levels.length === 0 && <p className="text-gray-500">ยังไม่มีระดับชั้น กรุณากด "+ เพิ่มระดับชั้น" เพื่อเริ่มต้น</p>}
        {levels.map((lv) => (
          <div
            key={lv.level_id}
            className="border rounded-lg p-5 shadow-sm bg-white"
          >
            {/* LEVEL HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{lv.name} ({lv.institution_name})</h2>

              <button
                onClick={() => {
                  setSelectedLevel(lv.level_id);
                  setOpenTermModal(true);
                }}
                className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
              >
                + เพิ่มเทอม
              </button>
            </div>

            {/* TERMS */}
            {terms[lv.level_id]?.length > 0 ? (
              terms[lv.level_id].map((tm: Term) => (
                <div key={tm.term_id} className="ml-4 mt-4 border-l pl-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-indigo-700">
                      {tm.name}
                    </h3>

                    <button
                      onClick={() => {
                        setSelectedLevel(lv.level_id);
                        setSelectedTerm(tm.term_id);
                        setOpenSubjectModal(true);
                      }}
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                    >
                      + เพิ่มวิชา
                    </button>
                  </div>

                  {/* SUBJECTS */}
                  <div className="flex flex-wrap gap-3">
                    {subjects[lv.level_id]?.[tm.term_id]?.length > 0 ? (
                      subjects[lv.level_id][tm.term_id].map((sb: Subject) => (
                        <div
                          key={sb.subject_id}
                          // **ข้อสังเกต:** คุณสามารถใช้ sb.color_tag ที่นี่เพื่อกำหนดสีพื้นหลัง
                          className="px-6 py-2 rounded-full bg-indigo-100 text-indigo-800 font-medium shadow-sm hover:bg-indigo-200"
                        >
                          {sb.name}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm ml-2">ยังไม่มีวิชา</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 ml-4">ยังไม่มีเทอม</p>
            )}
          </div>
        ))}
      </div>
      
      {/* --- */}

      {/* ===========================
          MODALS
      ============================ */}

      {/* Add Level Modal */}
      {openLevelModal && (
        <Modal title="เพิ่มระดับชั้น" onClose={() => setOpenLevelModal(false)}>
          <input
            className="border px-3 py-2 w-full rounded mb-2"
            placeholder="ชื่อระดับชั้น เช่น ม.4"
            value={levelForm.name}
            onChange={(e) =>
              setLevelForm({ ...levelForm, name: e.target.value })
            }
          />

          <input
            className="border px-3 py-2 w-full rounded mb-4"
            placeholder="ชื่อสถาบัน"
            value={levelForm.institution_name}
            onChange={(e) =>
              setLevelForm({
                ...levelForm,
                institution_name: e.target.value,
              })
            }
          />

          <button
            type="button"
            onClick={submitLevel}
            className="bg-green-600 text-white w-full py-2 rounded"
          >
            บันทึก
          </button>
        </Modal>
      )}

      {/* Add Term Modal */}
      {openTermModal && (
        <Modal title="เพิ่มเทอม" onClose={() => setOpenTermModal(false)}>
          <input
            className="border px-3 py-2 w-full rounded mb-4"
            placeholder="ชื่อเทอม เช่น เทอม 1"
            value={termForm.name}
            onChange={(e) => setTermForm({ name: e.target.value })}
          />

          <button
            type="button"
            onClick={submitTerm}
            className="bg-orange-600 text-white w-full py-2 rounded"
          >
            บันทึก
          </button>
        </Modal>
      )}

      {/* Add Subject Modal */}
      {openSubjectModal && (
        <Modal title="เพิ่มวิชา" onClose={() => setOpenSubjectModal(false)}>
          <input
            className="border px-3 py-2 w-full rounded mb-2"
            placeholder="ชื่อวิชา"
            value={subjectForm.name}
            onChange={(e) =>
              setSubjectForm({ ...subjectForm, name: e.target.value })
            }
          />

          <input
            className="border px-3 py-2 w-full rounded mb-2"
            placeholder="รหัสวิชา"
            value={subjectForm.code}
            onChange={(e) =>
              setSubjectForm({ ...subjectForm, code: e.target.value })
            }
          />

          <textarea
            className="border px-3 py-2 w-full rounded mb-3"
            placeholder="คำอธิบาย"
            rows={3}
            value={subjectForm.description}
            onChange={(e) =>
              setSubjectForm({ ...subjectForm, description: e.target.value })
            }
          />
          
          {/* คุณอาจเพิ่ม Field สำหรับ color_tag ที่นี่ เช่น input type="color" หรือ dropdown */}

          <button
            type="button"
            onClick={submitSubject}
            className="bg-indigo-600 text-white w-full py-2 rounded"
          >
            บันทึก
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ===============================
    MODAL COMPONENT (Use this one)
    =============================== */

function Modal({ title, children, onClose }: any) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      style={{ background: "rgba(0,0,0,0.3)" }}
    >
      <div className="bg-white w-full max-w-md rounded shadow-lg p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}