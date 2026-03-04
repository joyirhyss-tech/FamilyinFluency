import { LANGS, PATHS, DIFFICULTY } from "../data/constants";
import { MexicoTile, JapanTile, KoreaTile, MedicalIcon, TravelIcon, BarrioIcon, SoCalIcon, ProfessionalIcon, BackArrow, CheckIcon } from "../components/icons/Icons";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Tag } from "../components/ui/Tag";

const LANG_TILES = {
  spanish: MexicoTile,
  japanese: JapanTile,
  korean: KoreaTile,
};

const PATH_ICONS = {
  medical: MedicalIcon,
  travel: TravelIcon,
  neighborhood: BarrioIcon,
  socal: SoCalIcon,
  business: ProfessionalIcon,
};

export function Join({
  playerCount,
  onBack,
  onJoin,
  joinName, setJoinName,
  joinLangs, toggleJoinLang,
  joinPaths, toggleJoinPath,
  joinDiff, setJoinDiff,
  joinLangDiffs, setJoinLangDiffs,
  joinPin, setJoinPin,
}) {
  const canJoin = joinName.trim() && playerCount < 10 && joinPaths.length > 0 && joinLangs.length > 0 && joinPin.length === 3;

  return (
    <div className="min-h-screen bg-paper px-4 py-6 page-enter">
      <button
        onClick={onBack}
        className="text-pencil text-sm mb-4 hover:text-ink flex items-center gap-1 stamp-btn"
      >
        <BackArrow size={14} /> Back
      </button>

      <Card className="max-w-md mx-auto">
        <h2 className="text-2xl font-[family-name:var(--font-hand)] font-bold text-ink mb-0.5">
          Be inFluently
        </h2>
        <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)] mb-6">
          {playerCount} of 10 members
        </p>

        {/* Name */}
        <label className="text-xs font-bold text-pencil uppercase tracking-wider block mb-1.5">
          Your Name
        </label>
        <input
          value={joinName}
          onChange={(e) => setJoinName(e.target.value)}
          placeholder="Write your name here..."
          maxLength={30}
          className="w-full px-4 py-3 bg-paper-dark border-2 border-paper-line rounded-sm text-sm mb-5 focus:border-ink outline-none"
        />

        {/* Languages - multi-select */}
        <label className="text-xs font-bold text-pencil uppercase tracking-wider block mb-1.5">
          Languages <span className="font-normal text-pencil-light">(pick one or more)</span>
        </label>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {Object.entries(LANGS).map(([k, v]) => {
            const Tile = LANG_TILES[k];
            const selected = joinLangs.includes(k);
            return (
              <button
                key={k}
                onClick={() => toggleJoinLang(k)}
                className={`
                  p-3 rounded-sm border-2 text-center stamp-btn relative
                  ${selected
                    ? "border-ink bg-highlight-soft"
                    : "border-paper-line hover:border-pencil-light"
                  }
                `}
              >
                {selected && (
                  <span className="absolute top-1 right-1">
                    <CheckIcon size={14} />
                  </span>
                )}
                <div className="flex justify-center mb-1">
                  <Tile size={32} />
                </div>
                <span className="text-sm font-bold block">{v.name}</span>
              </button>
            );
          })}
        </div>

        {joinLangs.length === 0 && (
          <p className="text-xs text-red-pen mb-3 text-center">
            Select at least one language
          </p>
        )}

        {/* Learning Goals */}
        <label className="text-xs font-bold text-pencil uppercase tracking-wider block mb-1.5">
          Learning Goals
        </label>
        <div className="flex flex-wrap gap-2 mb-5">
          {Object.entries(PATHS).map(([k, v]) => {
            const PathIcon = PATH_ICONS[k];
            return (
              <Tag
                key={k}
                active={joinPaths.includes(k)}
                onClick={() => toggleJoinPath(k)}
              >
                {PathIcon && <PathIcon size={12} className="inline mr-1" />}
                {v.name}
              </Tag>
            );
          })}
        </div>

        {/* Per-Language Starting Level */}
        <label className="text-xs font-bold text-pencil uppercase tracking-wider block mb-1.5">
          Starting Level
        </label>
        <p className="text-xs text-pencil-light mb-3">Set your level for each language</p>
        <div className="space-y-3 mb-6">
          {joinLangs.map((lang) => {
            const currentDiff = joinLangDiffs[lang] ?? 0;
            return (
              <div key={lang} className="paper-card p-3">
                <p className="text-sm font-bold text-ink mb-2">{LANGS[lang]?.name}</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {DIFFICULTY.map((d, i) => (
                    <button
                      key={d}
                      onClick={() => setJoinLangDiffs((prev) => ({ ...prev, [lang]: i }))}
                      className={`
                        py-1.5 rounded-sm border-2 text-xs font-bold stamp-btn
                        ${currentDiff === i
                          ? "border-ink bg-highlight-soft text-ink"
                          : "border-paper-line text-pencil hover:border-pencil-light"
                        }
                      `}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-Digit PIN */}
        <label className="text-xs font-bold text-pencil uppercase tracking-wider block mb-1.5">
          Your Secret Key
        </label>
        <p className="text-xs text-pencil-light mb-2">3 digits to protect your space</p>
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2].map((idx) => (
            <input
              key={idx}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={joinPin[idx] || ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 1);
                const next = [joinPin[0] || "", joinPin[1] || "", joinPin[2] || ""];
                next[idx] = val;
                setJoinPin(next.join(""));
                // Auto-focus next
                if (val && idx < 2) {
                  e.target.nextElementSibling?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !joinPin[idx] && idx > 0) {
                  e.target.previousElementSibling?.focus();
                }
              }}
              className="w-14 h-16 text-center text-2xl font-[family-name:var(--font-hand)] font-bold bg-paper-dark border-2 border-paper-line rounded-sm focus:border-ink outline-none"
            />
          ))}
        </div>

        <Button
          onClick={() => onJoin()}
          disabled={!canJoin}
          size="lg"
          className="w-full"
        >
          Start My Year
        </Button>

        {joinPaths.length === 0 && (
          <p className="text-xs text-red-pen mt-2 text-center">
            Select at least one learning goal
          </p>
        )}
      </Card>
    </div>
  );
}
