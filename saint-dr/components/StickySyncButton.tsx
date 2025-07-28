"use client";
export default function StickySyncButton() {
  const handleClick = async () => {
    const res = await fetch("/api/sync-now", { method: "POST" });
    if (res.ok) {
      alert("✅ System cleanup + sync triggered.");
    } else {
      alert("❌ Failed to trigger sync.");
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      <button
        onClick={handleClick}
        className="bg-emerald-700 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-all"
      >
        🔁 Run Cleanup / Sync
      </button>
    </div>
  );
}
