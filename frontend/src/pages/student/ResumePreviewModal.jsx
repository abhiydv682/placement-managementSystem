export default function ResumePreviewModal({
  url,
  onClose,
}) {
  if (!url) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 h-5/6 rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-2 text-red-500"
        >
          ✕
        </button>

        <iframe
          src={url}
          className="w-full h-full"
          title="Resume"
        />
      </div>
    </div>
  );
}
