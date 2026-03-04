const variants = {
  primary: "bg-ink text-paper border-ink hover:bg-pencil",
  stamp: "bg-wax-seal text-paper border-wax-seal hover:bg-wax-seal-light",
  success: "bg-green-check text-paper border-green-check",
  danger: "bg-red-pen text-paper border-red-pen",
  outline: "bg-transparent text-ink border-pencil-light hover:bg-paper-dark",
  ghost: "bg-transparent text-pencil border-transparent hover:text-ink",
  blue: "bg-blue-ink text-paper border-blue-ink",
};

const sizes = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        stamp-btn inline-flex items-center justify-center gap-1.5
        font-[family-name:var(--font-print)] font-bold
        border-2 rounded-sm
        disabled:opacity-30 disabled:pointer-events-none
        select-none
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
