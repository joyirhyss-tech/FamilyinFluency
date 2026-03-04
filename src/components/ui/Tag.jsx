export function Tag({ children, active, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-sm text-sm font-bold border-2
        stamp-btn select-none
        ${active
          ? "border-ink bg-highlight-soft text-ink"
          : "border-paper-line bg-paper text-pencil hover:border-pencil-light"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
