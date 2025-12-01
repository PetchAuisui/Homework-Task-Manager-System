import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AddTask() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [labels, setLabels] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [form, setForm] = useState({
    subject_id: "",
    title: "",
    description: "",
    due_date: "",
    priority: "LOW",
    label_ids: [] as number[],
    teacher_ids: [] as number[],
    reminders: [] as any[],
    subtasks: [] as any[],
  });

  // โหลดข้อมูลทั้งหมด
  useEffect(() => {
    loadSubjects();
    loadLabels();
    loadTeachers();
  }, []);

  const loadSubjects = async () => {
    try {
      const res = await api.get("/api/subjects/");
      setSubjects(res.data);
    } catch (error) {
      console.error("โหลดรายวิชาล้มเหลว:", error);
    }
  };

  const loadLabels = async () => {
    try {
      const res = await api.get("/api/labels");
      setLabels(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadTeachers = async () => {
    try {
      const res = await api.get("/api/teachers");
      setTeachers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // เปลี่ยนค่าในฟอร์ม
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Toggle Label
  const toggleLabel = (id: number) => {
    setForm((prev) => {
      const exists = prev.label_ids.includes(id);
      return {
        ...prev,
        label_ids: exists
          ? prev.label_ids.filter((x) => x !== id)
          : [...prev.label_ids, id],
      };
    });
  };

  // Toggle Teacher
  const toggleTeacher = (id: number) => {
    setForm((prev) => {
      const exists = prev.teacher_ids.includes(id);
      return {
        ...prev,
        teacher_ids: exists
          ? prev.teacher_ids.filter((x) => x !== id)
          : [...prev.teacher_ids, id],
      };
    });
  };

  // เพิ่ม Reminder
  const addReminder = () => {
    const msg = prompt("ข้อความแจ้งเตือน:");
    const time = prompt("เวลาที่ต้องแจ้งเตือน (YYYY-MM-DD HH:mm)");
    if (!msg || !time) return;

    setForm((prev) => ({
      ...prev,
      reminders: [...prev.reminders, { message: msg, notify_at: time }],
    }));
  };

  // เพิ่มงานย่อย
  const addSubtask = () => {
    const title = prompt("ชื่องานย่อย:");
    if (!title) return;

    setForm((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, { title, priority: "MEDIUM" }],
    }));
  };

  // ส่งข้อมูลไป backend
  const saveTask = async () => {
    if (!form.subject_id || !form.title) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      await api.post("/api/tasks/full-create", form);
      alert("เพิ่มงานสำเร็จ!");
      navigate("/study");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  // ---------------------------------------------------------
  // GROUP SUBJECTS BY: ปี — เทอม (แบบสั้น)
  // ---------------------------------------------------------
  const groupedSubjects = subjects.reduce((acc: any, s: any) => {
    const groupName = `${s.level_name} — ${s.term_name}`;
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto p-6 mt-6">

      <h2 className="text-2xl font-bold text-green-700 mb-6">
        เพิ่มงาน (ครบ field)
      </h2>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        {/* ------------------------- รายวิชา -------------------------- */}
        <div>
          <label className="font-semibold block mb-1">รายวิชา</label>
          <select
            name="subject_id"
            className="border p-2 rounded w-full"
            value={form.subject_id}
            onChange={handleChange}
          >
            <option value="">-- เลือกวิชา --</option>

            {Object.entries(groupedSubjects).map(([group, items]: any) => (
              <optgroup key={group} label={group}>
                {items.map((s: any) => (
                  <option key={s.subject_id} value={s.subject_id}>
                    {s.name}{s.code ? ` (${s.code})` : ""}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* ------------------------- หัวข้องาน -------------------------- */}
        <div>
          <label className="font-semibold block mb-1">หัวข้องาน</label>
          <input
            name="title"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
        </div>

        {/* ------------------------- รายละเอียด -------------------------- */}
        <div>
          <label className="font-semibold block mb-1">รายละเอียด</label>
          <textarea
            name="description"
            rows={3}
            className="w-full border p-2 rounded"
            onChange={handleChange}
          ></textarea>
        </div>

        {/* ------------------------- Due Date -------------------------- */}
        <div>
          <label className="font-semibold block mb-1">กำหนดส่ง</label>
          <input
            type="date"
            name="due_date"
            className="border p-2 rounded"
            onChange={handleChange}
          />
        </div>

        {/* ------------------------- Priority -------------------------- */}
        <div>
          <label className="font-semibold block mb-1">ระดับความสำคัญ</label>
          <select
            name="priority"
            className="border p-2 rounded"
            onChange={handleChange}
          >
            <option value="LOW">ต่ำ</option>
            <option value="MEDIUM">ปานกลาง</option>
            <option value="HIGH">สูง</option>
          </select>
        </div>

        {/* ------------------------- LABELS -------------------------- */}
        <div>
          <label className="font-semibold block mb-1">แท็ก</label>
          <div className="flex flex-wrap gap-2">
            {labels.map((l: any) => (
              <button
                key={l.label_id}
                type="button"
                onClick={() => toggleLabel(l.label_id)}
                className={`px-3 py-1 rounded-full border ${
                  form.label_ids.includes(l.label_id)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>

        {/* ------------------------- Teachers -------------------------- */}
        <div>
          <label className="font-semibold block mb-1">อาจารย์ที่เกี่ยวข้อง</label>
          <div className="flex flex-wrap gap-2">
            {teachers.map((t: any) => (
              <button
                key={t.teacher_id}
                type="button"
                onClick={() => toggleTeacher(t.teacher_id)}
                className={`px-3 py-1 rounded-full border ${
                  form.teacher_ids.includes(t.teacher_id)
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {t.full_name}
              </button>
            ))}
          </div>
        </div>

        {/* ------------------------- Reminders -------------------------- */}
        <div>
          <label className="font-semibold block mb-1">แจ้งเตือนล่วงหน้า</label>
          <button
            onClick={addReminder}
            className="bg-orange-600 text-white px-4 py-1 rounded"
          >
            + เพิ่มแจ้งเตือน
          </button>

          <ul className="mt-2 text-sm text-gray-600">
            {form.reminders.map((r, i) => (
              <li key={i}>• {r.message} ({r.notify_at})</li>
            ))}
          </ul>
        </div>

        {/* ------------------------- Subtasks -------------------------- */}
        <div>
          <label className="font-semibold block mb-1">งานย่อย</label>
          <button
            onClick={addSubtask}
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            + เพิ่มงานย่อย
          </button>

          <ul className="mt-2 text-sm text-gray-600">
            {form.subtasks.map((s, i) => (
              <li key={i}>• {s.title}</li>
            ))}
          </ul>
        </div>

        {/* ------------------------- SAVE -------------------------- */}
        <button
          onClick={saveTask}
          className="bg-green-700 text-white px-6 py-3 rounded-lg w-full text-lg font-semibold"
        >
          เพิ่มงาน
        </button>

      </div>
    </div>
  );
}
