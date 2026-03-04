import { LANGS } from "../data/constants";
import { SPANISH_STORIES } from "../data/stories-spanish";
import { JAPANESE_STORIES } from "../data/stories-japanese";
import { KOREAN_STORIES } from "../data/stories-korean";
import { BackArrow, BookIcon, SpeakerIcon } from "../components/icons/Icons";
import { Card } from "../components/ui/Card";

const ALL_STORIES = {
  spanish: SPANISH_STORIES,
  japanese: JAPANESE_STORIES,
  korean: KOREAN_STORIES,
};

// Cute hand-drawn book cover illustrations (inline SVGs)
function BookCover({ icon, color, size = 80 }) {
  const icons = {
    hen: (
      <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="40" cy="42" rx="14" ry="11" />
        <path d="M26 42 C22 40 20 38 22 34 C24 30 28 32 30 34" />
        <path d="M40 31 C40 28 42 26 44 28 C46 26 48 28 48 30 C48 32 44 34 44 34" fill={color} opacity="0.3" />
        <circle cx="34" cy="39" r="1.5" fill={color} />
        <path d="M28 43 L25 44" />
        <path d="M54 42 L58 44 L58 40 Z" />
        <path d="M40 53 L36 58 M44 53 L48 58 M40 53 L42 58" />
      </g>
    ),
    pig: (
      <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="40" cy="40" r="12" />
        <ellipse cx="40" cy="43" rx="6" ry="4" />
        <circle cx="37" cy="42" r="1" fill={color} />
        <circle cx="43" cy="42" r="1" fill={color} />
        <circle cx="35" cy="36" r="2" fill={color} opacity="0.3" />
        <circle cx="45" cy="36" r="2" fill={color} opacity="0.3" />
        <path d="M30 32 L26 26" />
        <path d="M50 32 L54 26" />
        <path d="M22 54 L28 54 L28 48" />
        <path d="M36 54 L36 48" />
        <path d="M44 54 L44 48" />
        <path d="M52 54 L58 54 L52 48" />
      </g>
    ),
    mouse: (
      <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="40" cy="44" rx="10" ry="8" />
        <ellipse cx="33" cy="34" rx="5" ry="6" fill={color} opacity="0.15" />
        <ellipse cx="47" cy="34" rx="5" ry="6" fill={color} opacity="0.15" />
        <circle cx="37" cy="42" r="1.5" fill={color} />
        <circle cx="43" cy="42" r="1.5" fill={color} />
        <circle cx="40" cy="45" r="1" fill={color} />
        <path d="M36 47 L30 48" />
        <path d="M36 49 L30 50" />
        <path d="M44 47 L50 48" />
        <path d="M44 49 L50 50" />
        <path d="M50 44 C56 42 60 46 58 50" />
      </g>
    ),
    tortoise: (
      <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="40" cy="44" rx="16" ry="10" />
        <path d="M30 38 C30 30 50 30 50 38" />
        <path d="M35 36 L40 32 L45 36" strokeWidth={1.5} />
        <path d="M33 38 L38 38" strokeWidth={1} />
        <path d="M42 38 L47 38" strokeWidth={1} />
        <circle cx="26" cy="40" r="3" />
        <circle cx="24" cy="39" r="0.8" fill={color} />
        <path d="M30 52 L28 56" />
        <path d="M36 53 L35 57" />
        <path d="M44 53 L45 57" />
        <path d="M50 52 L52 56" />
        <path d="M56 44 L60 44 L58 46" />
      </g>
    ),
    turnip: (
      <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 28 C30 30 24 38 24 46 C24 54 32 58 40 58 C48 58 56 54 56 46 C56 38 50 30 40 28Z" />
        <path d="M36 28 C34 22 36 18 40 16" />
        <path d="M44 28 C46 22 44 18 40 16" />
        <path d="M40 16 C38 12 42 10 40 8" />
        <path d="M34 40 C36 36 44 36 46 40" strokeWidth={1.5} opacity="0.4" />
        <path d="M32 46 C34 44 46 44 48 46" strokeWidth={1.5} opacity="0.3" />
      </g>
    ),
    jizo: (
      <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 54 L32 38 C32 30 48 30 48 38 L48 54" />
        <circle cx="40" cy="32" r="8" />
        <circle cx="37" cy="31" r="1" fill={color} />
        <circle cx="43" cy="31" r="1" fill={color} />
        <path d="M38 34 C39 35 41 35 42 34" />
        <path d="M28 28 L52 28 L52 24 L28 24 Z" fill={color} opacity="0.2" />
        <path d="M30 24 L30 20 L50 20 L50 24" />
        <path d="M26 54 L54 54" strokeWidth={1.5} />
      </g>
    ),
    peach: (
      <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 20 C28 22 22 32 22 42 C22 52 30 58 40 56 C50 58 58 52 58 42 C58 32 52 22 40 20Z" />
        <path d="M40 20 L40 56" strokeWidth={1} opacity="0.3" />
        <path d="M38 20 C36 14 38 10 42 10" />
        <path d="M42 20 C44 14 46 12 48 14" />
        <path d="M42 10 C42 8 40 8 40 10" />
      </g>
    ),
    rabbit: (
      <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="40" cy="46" rx="10" ry="8" />
        <circle cx="40" cy="36" r="7" />
        <path d="M35 30 C34 20 32 14 33 12" />
        <path d="M45 30 C46 20 48 14 47 12" />
        <circle cx="37" cy="35" r="1.5" fill={color} />
        <circle cx="43" cy="35" r="1.5" fill={color} />
        <path d="M39 38 L40 39 L41 38" />
        <path d="M37 40 L32 41" strokeWidth={1} />
        <path d="M43 40 L48 41" strokeWidth={1} />
        <circle cx="52" cy="50" r="3" fill={color} opacity="0.2" />
      </g>
    ),
    tiger: (
      <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="40" cy="38" r="12" />
        <path d="M30 30 L26 22 L32 28" fill={color} opacity="0.2" />
        <path d="M50 30 L54 22 L48 28" fill={color} opacity="0.2" />
        <circle cx="36" cy="36" r="2" fill={color} />
        <circle cx="44" cy="36" r="2" fill={color} />
        <path d="M38 40 L40 42 L42 40" />
        <path d="M36 44 C38 46 42 46 44 44" />
        <path d="M32 34 L28 32" strokeWidth={1.5} />
        <path d="M32 38 L28 38" strokeWidth={1.5} />
        <path d="M48 34 L52 32" strokeWidth={1.5} />
        <path d="M48 38 L52 38" strokeWidth={1.5} />
        <path d="M40 26 L40 28" strokeWidth={1.5} />
        <path d="M36 27 L37 29" strokeWidth={1} />
        <path d="M44 27 L43 29" strokeWidth={1} />
      </g>
    ),
    sun: (
      <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="40" cy="40" r="10" />
        <circle cx="37" cy="38" r="1.5" fill={color} />
        <circle cx="43" cy="38" r="1.5" fill={color} />
        <path d="M37 43 C38 45 42 45 43 43" />
        <path d="M40 26 L40 22" />
        <path d="M40 54 L40 58" />
        <path d="M26 40 L22 40" />
        <path d="M54 40 L58 40" />
        <path d="M30 30 L27 27" />
        <path d="M50 30 L53 27" />
        <path d="M30 50 L27 53" />
        <path d="M50 50 L53 53" />
      </g>
    ),
    turtle: (
      <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="40" cy="44" rx="16" ry="10" />
        <path d="M28 38 C28 30 52 30 52 38" />
        <path d="M36 34 L40 30 L44 34" strokeWidth={1.5} />
        <circle cx="26" cy="40" r="3" />
        <circle cx="24" cy="39" r="0.8" fill={color} />
        <path d="M30 52 L28 56 M44 53 L45 57 M50 52 L52 56" />
        <path d="M56 44 L60 44" />
      </g>
    ),
    bird: (
      <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="40" cy="40" rx="10" ry="8" />
        <circle cx="40" cy="32" r="6" />
        <circle cx="38" cy="31" r="1" fill={color} />
        <path d="M42 34 L46 33" />
        <path d="M34 40 C30 42 26 46 28 50" />
        <path d="M46 40 C50 42 54 46 52 50" />
        <path d="M36 48 L34 54 L38 52" />
        <path d="M44 48 L46 54 L42 52" />
        <path d="M38 24 C36 20 38 18 40 18 C42 18 44 20 42 24" />
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 80 80" width={size} height={size} fill="none">
      <rect x="2" y="2" width="76" height="76" rx="4" stroke={color} strokeWidth={1.5} opacity="0.2" />
      {icons[icon] || icons.tortoise}
    </svg>
  );
}

export function Library({ user, onBack, onReadStory }) {
  const stories = ALL_STORIES[user.lang] || [];
  const langInfo = LANGS[user.lang];

  return (
    <div className="min-h-screen bg-paper page-enter">
      {/* Header */}
      <div className="bg-wax-seal px-5 pt-5 pb-5 text-paper">
        <button
          onClick={onBack}
          className="text-paper/70 text-sm mb-2 hover:text-paper flex items-center gap-1 stamp-btn"
        >
          <BackArrow size={14} /> Dashboard
        </button>
        <div className="flex items-center gap-2">
          <BookIcon size={22} className="text-paper" />
          <div>
            <h2 className="text-xl font-[family-name:var(--font-hand)] font-bold">
              Story Library
            </h2>
            <p className="text-xs text-paper/70 font-[family-name:var(--font-typed)]">
              {langInfo?.name} — Read, listen, and speak
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-2 pb-6 space-y-3">
        {/* Bookshelf */}
        <Card className="p-2">
          <p className="text-xs text-pencil-light px-2 pt-2 pb-3 font-[family-name:var(--font-typed)]">
            {stories.length} stories available — Tap to start reading
          </p>

          <div className="grid grid-cols-2 gap-3">
            {stories.map((story) => (
              <button
                key={story.id}
                onClick={() => onReadStory(story.id)}
                className="stamp-btn text-left"
              >
                <div
                  className="rounded-sm border-2 overflow-hidden"
                  style={{ borderColor: story.coverColor + "40" }}
                >
                  {/* Book cover */}
                  <div
                    className="p-3 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${story.coverColor}10, ${story.coverColor}20)`,
                    }}
                  >
                    <BookCover
                      icon={story.coverIcon}
                      color={story.coverColor}
                      size={72}
                    />
                  </div>

                  {/* Book info */}
                  <div className="bg-paper p-2.5 border-t" style={{ borderColor: story.coverColor + "30" }}>
                    <p className="font-[family-name:var(--font-hand)] font-bold text-ink text-sm leading-tight mb-0.5">
                      {story.title}
                    </p>
                    <p className="text-xs text-pencil-light leading-tight mb-1.5">
                      {story.titleEn}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-sm font-[family-name:var(--font-typed)]"
                        style={{
                          background: story.coverColor + "15",
                          color: story.coverColor,
                          border: `1px solid ${story.coverColor}30`,
                        }}
                      >
                        {story.level === 0 ? "A1" : story.level === 1 ? "A1-A2" : "A2"}
                      </span>
                      <span className="text-xs text-pencil-light font-[family-name:var(--font-typed)]">
                        {story.pages.length} pages
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* How it works */}
        <Card className="p-4">
          <h3 className="font-bold text-ink font-[family-name:var(--font-hand)] text-lg mb-2">
            How Reading Works
          </h3>
          <div className="space-y-2 text-sm text-pencil">
            <div className="flex items-start gap-2">
              <SpeakerIcon size={14} className="text-blue-ink mt-0.5 shrink-0" />
              <p><strong className="text-ink">Listen</strong> — Hear each page narrated slowly and clearly</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-highlight text-xs mt-0.5 shrink-0">🔁</span>
              <p><strong className="text-ink">Repeat</strong> — Practice saying it after the narrator</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-pen text-xs mt-0.5 shrink-0">●</span>
              <p><strong className="text-ink">Record</strong> — Read aloud and record yourself</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
