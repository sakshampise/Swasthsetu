export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="pulse-dot h-2.5 w-2.5 rounded-full bg-teal-500" style={{ animationDelay: `${i * 180}ms` }} />
        ))}
      </div>
    </div>
  );
}
