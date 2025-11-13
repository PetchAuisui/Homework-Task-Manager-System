export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <h1 className="text-xl font-bold text-green-600">Homework Manager</h1>

      <div className="flex items-center gap-4 text-gray-700">
        <a href="/dashboard" className="hover:text-green-600">Dashboard</a>
        <a href="/tasks" className="hover:text-green-600">งานทั้งหมด</a>
        <a href="/subjects" className="hover:text-green-600">รายวิชา</a>
        <a href="/profile" className="hover:text-green-600">โปรไฟล์</a>
      </div>
    </nav>
  );
}
