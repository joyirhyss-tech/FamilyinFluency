import { useRef, useState, useMemo } from "react";
import html2canvas from "html2canvas";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { YEAR_DAYS } from "../data/constants";
import { Button } from "../components/ui/Button";
import { BackArrow } from "../components/icons/Icons";

const HAND_FONTS = [
  "'Caveat', cursive",
  "'Patrick Hand', cursive",
  "'Indie Flower', cursive",
  "'Shadows Into Light', cursive",
];

const MEMBER_COLORS = [
  "#8b3a3a", "#6b4c3b", "#2c5f8a", "#5b3a7a", "#27774a",
  "#c4960c", "#7a3a6b", "#3a6b5b", "#6b3a3a", "#3a5b7a",
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Deterministic pseudo-random from seed
function seeded(i) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function YearCollage({ familyName, createdAt, dailyWordsKey, players, yearComplete, onBack }) {
  const collageRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [dailyWords] = useLocalStorage(dailyWordsKey, []);

  // Year range
  const startDate = new Date(createdAt);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + YEAR_DAYS);
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const yearLabel = startYear === endYear ? `${startYear}` : `${startYear} \u2014 ${endYear}`;

  // Sort words by date
  const allWords = useMemo(() => {
    return [...dailyWords].sort((a, b) => a.date.localeCompare(b.date));
  }, [dailyWords]);

  // Player lookup
  const playerMap = useMemo(() => {
    const map = {};
    players.forEach((p) => { map[p.id] = p; });
    return map;
  }, [players]);

  // Word counts per player
  const wordCounts = useMemo(() => {
    const c = {};
    allWords.forEach((w) => { c[w.playerId] = (c[w.playerId] || 0) + 1; });
    return c;
  }, [allWords]);

  // Word frequency for sizing
  const wordFreq = useMemo(() => {
    const freq = {};
    allWords.forEach((w) => {
      const key = w.word.toLowerCase();
      freq[key] = (freq[key] || 0) + 1;
    });
    return freq;
  }, [allWords]);

  // Build words with month dividers
  const itemsToRender = useMemo(() => {
    const items = [];
    let lastMonth = null;
    allWords.forEach((w, i) => {
      const month = w.date.slice(0, 7); // "2026-03"
      if (month !== lastMonth) {
        const monthIdx = parseInt(month.slice(5, 7)) - 1;
        items.push({ type: "month", label: MONTHS[monthIdx], key: `month-${month}` });
        lastMonth = month;
      }
      items.push({ type: "word", ...w, idx: i, key: `${w.playerId}-${w.date}` });

      // Sprinkle decorative stars every ~12 words
      if (i > 0 && i % 12 === 0) {
        const star = seeded(i) > 0.5 ? "\u2726" : "\u2727";
        items.push({ type: "star", char: star, key: `star-${i}` });
      }
    });
    return items;
  }, [allWords]);

  const downloadCollage = async () => {
    if (!collageRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(collageRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f5f0e8",
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${familyName}-year-of-words.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      // Silent fail
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper page-enter">
      {/* Header */}
      <div className="bg-ink px-5 pt-6 pb-5 text-paper">
        <button
          onClick={onBack}
          className="text-pencil-light text-sm mb-2 hover:text-paper flex items-center gap-1 stamp-btn"
        >
          <BackArrow size={14} /> Back
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-[family-name:var(--font-hand)] font-bold">
              Year of Words
            </h1>
            <p className="text-pencil-light text-xs font-[family-name:var(--font-typed)]">
              {allWords.length} {allWords.length === 1 ? "reflection" : "reflections"} collected
            </p>
          </div>
          <Button
            onClick={downloadCollage}
            variant="outline"
            size="sm"
            disabled={downloading || allWords.length === 0}
            className="text-paper border-pencil-light hover:bg-pencil"
          >
            {downloading ? "Saving..." : "Download"}
          </Button>
        </div>
      </div>

      <div className="px-4 -mt-2 pb-6">
        {/* ─── THE COLLAGE ─── */}
        <div
          ref={collageRef}
          style={{
            background: "linear-gradient(180deg, #f5f0e8 0%, #ebe4d6 50%, #f5f0e8 100%)",
            border: "2px solid #d4cdc0",
            borderRadius: "6px",
            padding: "2rem 1.25rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative washi tape — top */}
          <div style={{
            position: "absolute", top: "8px", left: "50%",
            transform: "translateX(-50%) rotate(-1.5deg)",
            width: "80px", height: "14px",
            background: "rgba(168, 200, 232, 0.5)",
            borderRadius: "1px",
          }} />

          {/* ── HEADER ── */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem", paddingTop: "0.5rem" }}>
            <h2 style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "2.6rem",
              fontWeight: 700,
              color: "#2d2a26",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              margin: 0,
            }}>
              {familyName}
            </h2>
            <p style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.8rem",
              color: "#9e9790",
              letterSpacing: "0.15em",
              marginTop: "0.25rem",
            }}>
              {yearLabel}
            </p>
            <p style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: "1.05rem",
              color: "#6b6560",
              marginTop: "0.15rem",
            }}>
              {yearComplete ? "\u2726 Our Year of Words \u2726" : "Our Year of Words"}
            </p>
            <div style={{
              width: "60px",
              borderBottom: "2px dashed #d4cdc0",
              margin: "0.75rem auto 0",
            }} />
          </div>

          {/* ── WORD CLOUD ── */}
          {allWords.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <p style={{
                fontFamily: "'Patrick Hand', cursive",
                fontSize: "1.2rem",
                color: "#9e9790",
              }}>
                Your words will appear here...
              </p>
              <p style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.7rem",
                color: "#c0b8a8",
                marginTop: "0.5rem",
              }}>
                Submit daily one-word reflections in the Family Hub
              </p>
            </div>
          ) : (
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "baseline",
              gap: "3px 6px",
              padding: "0.5rem 0 1rem",
              lineHeight: 1.7,
            }}>
              {itemsToRender.map((item) => {
                if (item.type === "month") {
                  return (
                    <span
                      key={item.key}
                      style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: "0.5rem",
                        color: "#c0b8a8",
                        width: "100%",
                        textAlign: "center",
                        display: "block",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        margin: "0.5rem 0 0.15rem",
                      }}
                    >
                      {"\u2014"} {item.label} {"\u2014"}
                    </span>
                  );
                }

                if (item.type === "star") {
                  return (
                    <span
                      key={item.key}
                      style={{
                        fontSize: "0.75rem",
                        color: "#c4960c",
                        opacity: 0.5,
                        padding: "0 4px",
                      }}
                    >
                      {item.char}
                    </span>
                  );
                }

                // Word
                const player = playerMap[item.playerId];
                const color = MEMBER_COLORS[(player?.colorIdx || 0) % MEMBER_COLORS.length];
                const fontIdx = item.idx % HAND_FONTS.length;
                const font = HAND_FONTS[fontIdx];
                const r = seeded(item.idx);
                const freq = wordFreq[item.word.toLowerCase()] || 1;

                // Size: bigger for repeated words, with slight randomness
                const baseSize = freq > 4 ? 1.9 : freq > 2 ? 1.6 : freq > 1 ? 1.35 : 1.15;
                const size = baseSize + (r * 0.3 - 0.15);

                // Slight rotation for organic feel
                const rotation = (seeded(item.idx * 7 + 3) - 0.5) * 10;

                return (
                  <span
                    key={item.key}
                    style={{
                      fontFamily: font,
                      fontSize: `${size}rem`,
                      fontWeight: r > 0.3 ? 700 : 500,
                      color,
                      transform: `rotate(${rotation}deg)`,
                      display: "inline-block",
                      opacity: 0.7 + r * 0.3,
                      padding: "0 2px",
                    }}
                  >
                    {item.word}
                  </span>
                );
              })}
            </div>
          )}

          {/* ── DIVIDER ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "0.75rem 0 1rem",
          }}>
            <div style={{ flex: 1, borderBottom: "1px solid rgba(158, 151, 144, 0.3)" }} />
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.6rem",
              color: "#9e9790",
              whiteSpace: "nowrap",
            }}>
              {allWords.length} {allWords.length === 1 ? "word" : "words"} {yearComplete ? "\u2726 year complete" : `\u00b7 ${YEAR_DAYS} days`}
            </span>
            <div style={{ flex: 1, borderBottom: "1px solid rgba(158, 151, 144, 0.3)" }} />
          </div>

          {/* ── MEMBER LEGEND ── */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "1.5rem",
          }}>
            {players.map((p) => {
              const color = MEMBER_COLORS[(p.colorIdx || 0) % MEMBER_COLORS.length];
              return (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", gap: "4px",
                }}>
                  <div style={{
                    width: "22px", height: "22px", borderRadius: "50%",
                    backgroundColor: color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", color: "white",
                    fontFamily: "'Caveat', cursive", fontWeight: 700,
                    boxShadow: "inset 0 1px 3px rgba(255,255,255,0.3), inset 0 -1px 3px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.1)",
                  }}>
                    {(p.name || "?")[0].toUpperCase()}
                  </div>
                  <span style={{
                    fontSize: "0.75rem", fontWeight: 700, color: "#2d2a26",
                    fontFamily: "'Patrick Hand', cursive",
                  }}>
                    {p.name}
                  </span>
                  <span style={{
                    fontSize: "0.6rem", color: "#9e9790",
                    fontFamily: "'Courier New', monospace",
                  }}>
                    ({wordCounts[p.id] || 0})
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── YEAR COMPLETE STAMP ── */}
          {yearComplete && (
            <div style={{
              textAlign: "center",
              marginBottom: "1rem",
            }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px", height: "80px",
                borderRadius: "50%",
                backgroundColor: "#c4960c",
                boxShadow: "inset 0 2px 6px rgba(255,255,255,0.3), inset 0 -2px 6px rgba(0,0,0,0.2), 0 3px 8px rgba(0,0,0,0.15)",
              }}>
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                }}>
                  <span style={{
                    fontFamily: "'Caveat', cursive", fontSize: "0.65rem",
                    color: "white", fontWeight: 700, letterSpacing: "0.1em",
                  }}>
                    YEAR
                  </span>
                  <span style={{
                    fontFamily: "'Caveat', cursive", fontSize: "1.4rem",
                    color: "white", fontWeight: 700, lineHeight: 1,
                  }}>
                    {"\u2713"}
                  </span>
                  <span style={{
                    fontFamily: "'Courier New', monospace", fontSize: "0.4rem",
                    color: "rgba(255,255,255,0.8)", letterSpacing: "0.15em",
                  }}>
                    COMPLETE
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── FOOTER ── */}
          <div style={{
            textAlign: "center",
            paddingTop: "1rem",
            borderTop: "1px dashed rgba(158, 151, 144, 0.4)",
          }}>
            <p style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "1.15rem",
              color: "#6b6560",
              fontWeight: 700,
              margin: 0,
            }}>
              Family inFluency
            </p>
            <p style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "0.5rem",
              color: "#9e9790",
              letterSpacing: "0.25em",
              marginTop: "0.15rem",
            }}>
              by AidedEQ Corp.
            </p>
          </div>

          {/* Decorative washi tape — bottom right */}
          <div style={{
            position: "absolute", bottom: "12px", right: "16px",
            transform: "rotate(3deg)",
            width: "60px", height: "12px",
            background: "rgba(232, 184, 200, 0.4)",
            borderRadius: "1px",
          }} />

          {/* Decorative washi tape — bottom left */}
          <div style={{
            position: "absolute", bottom: "20px", left: "12px",
            transform: "rotate(-2deg)",
            width: "50px", height: "12px",
            background: "rgba(184, 216, 200, 0.4)",
            borderRadius: "1px",
          }} />
        </div>

        {/* Download button below collage */}
        {allWords.length > 0 && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={downloadCollage}
              variant="stamp"
              size="lg"
              disabled={downloading}
              className="w-full max-w-xs"
            >
              {downloading ? "Creating Your Collage..." : "Download Collage"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
