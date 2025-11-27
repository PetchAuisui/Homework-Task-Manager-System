import ReactDOM from "react-dom";

export default function Modal({ title, children, onClose }: any) {
  const root = document.getElementById("modal-root");
  if (!root) return null;

  return ReactDOM.createPortal(
    <>
      {/* background that does NOT block clicks */}
      <div
        className="fixed inset-0 z-[99998] bg-black bg-opacity-40 pointer-events-none"
      ></div>

      {/* modal box - pointerEvents enabled */}
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-auto"
        style={{ pointerEvents: "auto" }}
      >
        <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>

          {children}
        </div>
      </div>
    </>,
    root
  );
}
