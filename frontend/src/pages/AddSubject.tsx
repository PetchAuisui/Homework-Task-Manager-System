import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getLevels } from "../services/education";
import { createSubject } from "../services/subjects";

export default function AddSubject() {
  const navigate = useNavigate();
  const location = useLocation();

  const [levels, setLevels] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  // อ่าน level_id จาก URL
  const params = new URLSearchParams(location.search);
  const defaultLevelId = params.get("level_id");

  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    color_tag: "",
    level_id: defaultLevelId ? Number(defaultLevelId) : null,
  });

  useEffect(() => {
    getLevels().then(setLevels);
  }, []);

  const submit = async (e: any) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setMsg("กรุณากรอกชื่อวิชา");
      return;
    }

    try {
      await createSubject(form);
      navigate("/study");
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "เพิ่มวิชาไม่สำเร็จ");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">เพิ่มรายวิชา</h1>

      {msg && <div className="mb-3 bg-yellow-100 p-2 rounded">{msg}</div>}

      <form className="space-y-3" onSubmit={submit}>
        <input
          type="text"
          className="border px-3 py-2 w-full rounded"
          placeholder="ชื่อวิชา"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="text"
          className="border px-3 py-2 w-full rounded"
          placeholder="รหัสวิชา"
          value={form.code}
          onChange={(e) =>
            setForm({ ...form, code: e.target.value })
          }
        />

        <select
          className="border px-3 py-2 w-full rounded"
          value={form.level_id || ""}
          onChange={(e) =>
            setForm({
              ...form,
              level_id: e.target.value ? Number(e.target.value) : null,
            })
          }
        >
          <option value="">เลือกระดับชั้น</option>
          {levels.map((lv) => (
            <option key={lv.level_id} value={lv.level_id}>
              {lv.name}
            </option>
          ))}
        </select>

        <textarea
          className="border px-3 py-2 w-full rounded"
          placeholder="คำอธิบาย"
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        ></textarea>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded">
          บันทึก
        </button>
      </form>
    </div>
  );
}
