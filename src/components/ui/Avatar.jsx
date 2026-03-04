const SEAL_COLORS = [
  "#8b3a3a", "#6b4c3b", "#2c5f8a", "#5b3a7a", "#27774a",
  "#c4960c", "#7a3a6b", "#3a6b5b", "#6b3a3a", "#3a5b7a",
];

export function Avatar({ name, colorIdx = 0, size = 40 }) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const color = SEAL_COLORS[colorIdx % SEAL_COLORS.length];

  return (
    <div
      className="wax-seal font-[family-name:var(--font-hand)] select-none"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        backgroundColor: color,
      }}
    >
      {initials}
    </div>
  );
}
