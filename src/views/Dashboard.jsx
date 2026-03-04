import { LANGS, PATHS, DIFFICULTY, DIFFICULTY_SHORT, SEAL_COLORS } from "../data/constants";
import { getLevelProgress } from "../utils/xp";
import {
  DrillIcon, SpeakIcon, FamilyIcon, BookIcon, NotebookIcon,
  FlameIcon, TrophyIcon, BackArrow, InkSplat, WaxSeal,
  MexicoTile, JapanTile, KoreaTile,
} from "../components/icons/Icons";
import { Avatar } from "../components/ui/Avatar";
import { useLocalStorage } from "../hooks/useLocalStorage";

const LANG_TILES = {
  spanish: MexicoTile,
  japanese: JapanTile,
  korean: KoreaTile,
};

const HAND_FONTS = ["hand-caveat", "hand-patrick", "hand-indie", "hand-shadows"];

export function Dashboard({ user, activeLang, dailyWordsKey, onSwitchLang, onBack, onDrill, onSpeak, onHome, onLibrary, onFlashcards }) {
  const langs = user.langs || [user.lang];
  const hasMultiple = langs.length > 1;
  const [dailyWords] = useLocalStorage(dailyWordsKey, []);
  const today = new Date().toISOString().slice(0, 10);
  const todayWord = dailyWords.find((w) => w.playerId === user.id && w.date === today);
  const fontClass = HAND_FONTS[(user.colorIdx || 0) % HAND_FONTS.length];

  return (
    <div className="min-h-screen bg-paper page-enter">
      {/* Header */}
      <div className="bg-ink px-5 pt-5 pb-5 text-paper">
        <button
          onClick={onBack}
          className="text-pencil-light text-sm mb-2 hover:text-paper flex items-center gap-1 stamp-btn"
        >
          <BackArrow size={14} /> Hub
        </button>
        <div className="flex items-center gap-3">
          <Avatar name={user.name} colorIdx={user.colorIdx} size={48} />
          <div className="flex-1">
            <h2 className="text-xl font-[family-name:var(--font-hand)] font-bold">
              {user.name}
            </h2>
            {todayWord && (
              <p className={`${fontClass} text-sm text-paper/70 italic leading-tight`}>
                &ldquo;{todayWord.word}&rdquo;
              </p>
            )}
            <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)]">
              {LANGS[activeLang]?.name} / {DIFFICULTY[user.langDiffs?.[activeLang] ?? user.diff]}
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {user.paths.map((p) => (
                <span
                  key={p}
                  className="text-xs bg-pencil/30 rounded-sm px-1.5 py-0.5"
                >
                  {PATHS[p]?.name}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <WaxSeal
              level={user.level}
              color={SEAL_COLORS[Math.min(user.langDiffs?.[activeLang] ?? user.diff, 5)]}
              size={44}
            />
          </div>
        </div>

        {/* Language switcher */}
        {hasMultiple && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-pencil/30">
            {langs.map((lang) => {
              const Tile = LANG_TILES[lang];
              const isActive = activeLang === lang;
              return (
                <button
                  key={lang}
                  onClick={() => onSwitchLang(lang)}
                  className={`stamp-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-xs font-bold ${
                    isActive
                      ? "bg-paper/15 border-paper/40 text-paper"
                      : "bg-transparent border-pencil/30 text-pencil-light hover:text-paper hover:border-paper/40"
                  }`}
                >
                  {Tile && <Tile size={16} />}
                  {LANGS[lang]?.name}
                  <span className="opacity-60 font-normal">{DIFFICULTY_SHORT[user.langDiffs?.[lang] ?? user.diff]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-4 -mt-2 pb-6 space-y-3">
        {/* Activity cards - 2x2 grid + full width */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onDrill}
            className="paper-card p-4 text-left stamp-btn border-l-4 border-l-green-check"
          >
            <DrillIcon size={24} className="text-green-check mb-1.5" />
            <span className="font-bold text-sm block text-ink">Speed Drills</span>
            <span className="text-xs text-pencil">
              Instant practice
            </span>
          </button>

          <button
            onClick={onSpeak}
            className="paper-card p-4 text-left stamp-btn border-l-4 border-l-highlight"
          >
            <SpeakIcon size={24} className="text-highlight mb-1.5" />
            <span className="font-bold text-sm block text-ink">
              Pronunciation
            </span>
            <span className="text-xs text-pencil">Listen & speak</span>
          </button>

          <button
            onClick={onLibrary}
            className="paper-card p-4 text-left stamp-btn border-l-4 border-l-wax-seal"
          >
            <BookIcon size={24} className="text-wax-seal mb-1.5" />
            <span className="font-bold text-sm block text-ink">Story Library</span>
            <span className="text-xs text-pencil">Read & listen to tales</span>
          </button>

          <button
            onClick={onFlashcards}
            className="paper-card p-4 text-left stamp-btn border-l-4 border-l-blue-ink"
          >
            <NotebookIcon size={24} className="text-blue-ink mb-1.5" />
            <span className="font-bold text-sm block text-ink">Flashcards</span>
            <span className="text-xs text-pencil">Fast vocabulary</span>
          </button>

          <button
            onClick={onHome}
            className="paper-card p-4 text-left stamp-btn border-l-4 border-l-pencil col-span-2"
          >
            <FamilyIcon size={24} className="text-pencil mb-1.5" />
            <span className="font-bold text-sm block text-ink">Family inFluency</span>
            <span className="text-xs text-pencil">Daily one word update</span>
          </button>
        </div>

        {/* Stats */}
        <div className="paper-card p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-paper-dark rounded-sm p-3 border border-paper-line">
              <FlameIcon size={20} className="text-red-pen mx-auto mb-1" />
              <span className="text-lg font-[family-name:var(--font-hand)] font-bold text-ink block">
                {user.streak}
              </span>
              <span className="text-xs text-pencil-light">Streak</span>
            </div>
            <div className="bg-paper-dark rounded-sm p-3 border border-paper-line">
              <InkSplat size={20} className="text-blue-ink mx-auto mb-1" />
              <span className="text-lg font-[family-name:var(--font-hand)] font-bold text-ink block">
                {user.xp}
              </span>
              <span className="text-xs text-pencil-light">XP</span>
            </div>
            <div className="bg-paper-dark rounded-sm p-3 border border-paper-line">
              <TrophyIcon size={20} className="text-highlight mx-auto mb-1" />
              <span className="text-lg font-[family-name:var(--font-hand)] font-bold text-ink block">
                Lv{user.level}
              </span>
              <span className="text-xs text-pencil-light">Level</span>
            </div>
          </div>

          {/* XP progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-pencil-light mb-1">
              <span>Progress to Lv{user.level + 1}</span>
              <span className="font-[family-name:var(--font-typed)]">
                {Math.round(getLevelProgress(user.xp) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-paper-dark rounded-sm overflow-hidden border border-paper-line">
              <div
                className="h-full bg-ink rounded-sm transition-all duration-500"
                style={{ width: `${getLevelProgress(user.xp) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
