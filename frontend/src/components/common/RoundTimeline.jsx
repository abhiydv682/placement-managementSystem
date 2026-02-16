export default function RoundTimeline({ rounds }) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-4 overflow-x-auto">
        {rounds?.map((round, index) => (
          <div
            key={index}
            className="flex flex-col items-center min-w-[120px]"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                round.status === "Cleared"
                  ? "bg-green-500"
                  : round.status === "Rejected"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            >
              {index + 1}
            </div>
            <p className="text-xs mt-2 text-center">
              {round.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
