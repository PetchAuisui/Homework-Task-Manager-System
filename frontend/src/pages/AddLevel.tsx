import { useState } from "react";
import { createLevel } from "../services/education";
import { useNavigate } from "react-router-dom";

export default function AddLevel() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    institution_name: "",
  });

  const [msg, setMsg] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMsg("กรุณากรอกชื่อระดับชั้น");
      return;
    }

    try {
      await createLevel(form);
      navigate("/study"); // กลับไปหน้าหลัก
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "เพิ่มระดับชั้นไม่สำเร็จ");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">เพิ่มระดับชั้น</h1>

      {msg && <div className="mb-4 p-2 bg-yellow-100">{msg}</div>}

      <form className="space-y-3" onSubmit={submit}>
        <input
          type="text"
          className="border px-3 py-2 w-full rounded"
          placeholder="ชื่อระดับชั้น เช่น ม.4, ปี 1"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="text"
          className="border px-3 py-2 w-full rounded"
          placeholder="ชื่อสถาบัน (ไม่บังคับ)"
          value={form.institution_name}
          onChange={(e) =>
            setForm({ ...form, institution_name: e.target.value })
          }
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          บันทึก
        </button>
      </form>
    </div>
  );
}
