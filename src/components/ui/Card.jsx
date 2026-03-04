export function Card({ children, className = "", onClick, dogEar = false }) {
  return (
    <div
      onClick={onClick}
      className={`
        paper-card p-4
        ${dogEar ? "dog-ear" : ""}
        ${onClick ? "cursor-pointer stamp-btn" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
