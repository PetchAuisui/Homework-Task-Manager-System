// src/pages/Overview.tsx
import { Link } from "react-router-dom";

export default function Overview() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
        {/* Logo + ชื่อเว็บ */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Homework & Task Manager
              </h1>
              <p className="text-xs text-slate-500">
                จัดการการบ้าน งาน และเดดไลน์ในที่เดียว
              </p>
            </div>
          </div>

          <div className="hidden md:flex gap-3 text-sm">
            <Link
              to="/login"
              className="px-4 py-2 rounded-full border border-indigo-300 text-indigo-700 hover:bg-indigo-50 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-full bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition"
            >
              เริ่มใช้งานฟรี
            </Link>
          </div>
        </header>

        <main className="grid md:grid-cols-2 gap-10 items-center">
          {/* ด้านซ้าย – ข้อความหลัก */}
          <section>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium mb-4">
              📌 สำหรับนักเรียน–นักศึกษา ที่มีเดดไลน์เยอะไปหมด
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 text-slate-900">
              ไม่พลาดเดดไลน์อีกต่อไป 💡<br />
              แยก<strong className="text-indigo-600"> วิชา / งาน / เหตุการณ์ </strong>
              ชัดเจน
            </h2>
            <p className="text-sm md:text-base text-slate-600 mb-6 leading-relaxed">
              ระบบนี้ช่วยให้นายจัดการการบ้าน งานโปรเจกต์ และเหตุการณ์สำคัญ
              ได้เป็นระเบียบมากขึ้น โดยจัดตามลำดับ{" "}
              <span className="font-medium">
                ระดับชั้น → วิชา → งาน → งานย่อย
              </span>{" "}
              พร้อมแจ้งเตือนล่วงหน้าไม่ให้ลืมส่งงานอีกต่อไป
            </p>

            <ul className="space-y-2 text-sm text-slate-700 mb-8">
              <li className="flex gap-2">
                <span>✅</span>
                <span>เพิ่ม “ระดับชั้น / วิชา” ของตัวเองได้ตามใจ</span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>สร้างงาน + งานย่อยเป็น Tree ซ้อนได้หลายชั้น</span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>รองรับ Event เช่น สอบ, Portfolio, โปรเจกต์ใหญ่</span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>ตั้งแจ้งเตือนล่วงหน้าผ่านระบบ Reminder</span>
              </li>
            </ul>

            {/* ปุ่มส่วนกลาง (สำหรับ mobile ด้วย) */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/register"
                className="inline-flex justify-center items-center px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold text-sm shadow-md hover:bg-indigo-700 transition"
              >
                ✨ สมัครใช้งานฟรี
              </Link>
              <Link
                to="/login"
                className="inline-flex justify-center items-center px-6 py-3 rounded-full border border-indigo-200 text-indigo-700 text-sm font-medium hover:bg-indigo-50 transition"
              >
                มีบัญชีอยู่แล้ว? Login
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              * ข้อมูลถูกเก็บในบัญชีของนายเอง สามารถจัดระดับชั้น วิชา และงานได้ตามสไตล์ของตัวเอง
            </p>
          </section>

          {/* ด้านขวา – การ์ด Preview Dashboard */}
          <section>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-200/60 via-sky-200/40 to-purple-200/50 blur-2xl opacity-70" />
              <div className="relative bg-white/90 backdrop-blur shadow-xl rounded-2xl p-5 border border-indigo-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-800">
                    ตัวอย่าง Dashboard วันนี้
                  </h3>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-sky-50 text-sky-700">
                    นักศึกษา ปี 1
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="text-xs text-slate-500">งานใกล้ครบกำหนด</div>

                  <div className="rounded-xl border border-slate-100 p-3 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        ส่งรายงาน Lab 3 – ฟิสิกส์
                      </p>
                      <p className="text-xs text-slate-500">
                        วิชา: PHY101 · เดดไลน์พรุ่งนี้
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-[10px] bg-red-50 text-red-600 font-semibold">
                      ด่วนมาก
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 p-3 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        ทำสรุปบทที่ 1–3 ควิซคณิต
                      </p>
                      <p className="text-xs text-slate-500">
                        วิชา: MTH102 · ภายในสัปดาห์นี้
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-[10px] bg-amber-50 text-amber-600 font-semibold">
                      สำคัญ
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-100 p-3 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        เตรียม Portfolio สำหรับยื่นทุน
                      </p>
                      <p className="text-xs text-slate-500">
                        Event: Portfolio · มีงานย่อยหลายขั้นตอน
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-[10px] bg-emerald-50 text-emerald-600 font-semibold">
                      วางแผน
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                  <span>รองรับ Tag, Event, Sub-tasks แบบ Tree</span>
                  <span className="font-medium text-indigo-600">
                    ทุกอย่างในที่เดียว
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
