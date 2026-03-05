import { Button } from "../components/ui/Button";
import { YEAR_DAYS } from "../data/constants";

export function Splash({ familyName, playerCount, yearProgress, wordCount, onEnterHub, onGetStarted, onCollage, onSwitchFamily }) {
  const daysElapsed = yearProgress?.elapsed ?? 0;
  const yearComplete = yearProgress?.complete ?? false;
  const pct = Math.min(100, (daysElapsed / YEAR_DAYS) * 100);

  return (
    <div className="h-[100dvh] flex flex-col items-center bg-paper px-6 text-center notebook-paper overflow-hidden relative">
      {/* Top spacer — flexes to push content toward center */}
      <div className="flex-1 min-h-8" />
      {/* Notebook title page feel */}
      <div className="page-enter flex flex-col items-center shrink-0">
        <img
          src="/influently.png"
          alt="inFluently logo"
          className="w-24 h-24 mx-auto mb-3 object-contain"
        />

        <h1 className="text-5xl font-[family-name:var(--font-hand)] font-bold text-ink tracking-tight mb-1">
          Family inFluency
        </h1>
        <p className="text-pencil text-sm mb-0.5">
          Your language journey, one word at a time.
        </p>

        {/* Year countdown */}
        {yearProgress && (
          <div className="mb-4 mt-1">
            {yearComplete ? (
              <p className="text-highlight font-[family-name:var(--font-hand)] text-lg font-bold">
                &#10022; Year Complete &#10022;
              </p>
            ) : (
              <p className="text-pencil-light text-xs font-[family-name:var(--font-typed)]">
                Day {daysElapsed} of {YEAR_DAYS} &middot; {yearProgress.remaining} {yearProgress.remaining === 1 ? "day" : "days"} to go
              </p>
            )}
            <div className="w-40 h-1.5 bg-paper-dark rounded-sm overflow-hidden border border-paper-line mx-auto mt-1.5">
              <div
                className={`h-full rounded-sm transition-all ${yearComplete ? "bg-highlight" : "bg-ink"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {wordCount > 0 && (
              <p className="text-pencil-light text-xs mt-1 font-[family-name:var(--font-typed)]">
                {wordCount} {wordCount === 1 ? "word" : "words"} collected
              </p>
            )}
          </div>
        )}

        {!yearProgress && (
          <p className="text-pencil-light text-xs mb-6 font-[family-name:var(--font-typed)]">
            est. 2026
          </p>
        )}

        <div className="flex flex-col gap-3 w-56 mx-auto">
          {playerCount > 0 && (
            <Button onClick={onEnterHub} size="lg" className="w-full">
              Open Notebook
            </Button>
          )}
          <Button
            onClick={onGetStarted}
            variant={playerCount > 0 ? "outline" : "primary"}
            size="lg"
            className="w-full"
          >
            {playerCount > 0 ? "Add Family Member" : "Get Started"}
          </Button>
          {wordCount > 0 && (
            <Button
              onClick={onCollage}
              variant="ghost"
              size="sm"
              className="w-full"
            >
              {yearComplete ? "View Year Collage &#10022;" : "View Year Collage"}
            </Button>
          )}
        </div>

        {playerCount > 0 && (
          <p className="text-pencil-light text-xs mt-4 font-[family-name:var(--font-typed)]">
            {playerCount} of 10 members joined
          </p>
        )}

        {/* Language indicators */}
        <div className="flex justify-center gap-6 mt-6 text-pencil-light text-xs">
          <span className="border-b border-dashed border-pencil-light pb-0.5">
            Espanol
          </span>
          <span className="border-b border-dashed border-pencil-light pb-0.5">
            Nihongo
          </span>
          <span className="border-b border-dashed border-pencil-light pb-0.5">
            Hangugeo
          </span>
        </div>
      </div>
      {/* Bottom spacer — matches top for centering */}
      <div className="flex-1 min-h-4" />

      {/* Exit to Gate */}
      {onSwitchFamily && (
        <button
          onClick={onSwitchFamily}
          className="absolute bottom-4 left-4 text-pencil-light/50 hover:text-pencil-light stamp-btn p-2 text-xs font-[family-name:var(--font-typed)]"
        >
          ← Switch Circle
        </button>
      )}
    </div>
  );
}
