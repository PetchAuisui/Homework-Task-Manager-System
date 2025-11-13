import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-lg font-bold">งานทั้งหมด</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-lg font-bold">รายวิชา</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-lg font-bold">งานที่ต้องส่งวันนี้</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">0</p>
          </div>

        </div>
      </div>
    </div>
  );
}
