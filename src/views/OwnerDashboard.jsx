import { useState } from "react";
import { FAMILIES, magicLink } from "../data/families";
import { familyKey } from "../utils/familyKey";
import { BackArrow } from "../components/icons/Icons";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function OwnerDashboard({ onSelectFamily, onBack }) {
  const [copied, setCopied] = useState(null);

  const getMemberCount = (familyCode) => {
    try {
      const key = familyKey(familyCode, "players");
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data).length : 0;
    } catch {
      return 0;
    }
  };

  const copyLink = (family) => {
    const url = magicLink(family.code);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(family.code);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-paper page-enter">
      <div className="bg-ink px-5 pt-6 pb-5 text-paper">
        <button
          onClick={onBack}
          className="text-pencil-light text-sm mb-2 hover:text-paper flex items-center gap-1 stamp-btn"
        >
          <BackArrow size={14} /> Sign Out
        </button>
        <h1 className="text-2xl font-[family-name:var(--font-hand)] font-bold">
          Owner Dashboard
        </h1>
        <p className="text-pencil-light text-xs font-[family-name:var(--font-typed)]">
          {FAMILIES.length} families registered
        </p>
      </div>

      <div className="px-4 -mt-2 pb-6 space-y-3">
        {/* Instructions card */}
        <Card>
          <p className="text-xs text-pencil font-[family-name:var(--font-typed)] leading-relaxed">
            Share a family&rsquo;s magic link to invite them. They click the link and the app unlocks for their family.
            To add new families, edit <span className="font-bold">families.js</span> and redeploy.
          </p>
        </Card>

        {FAMILIES.map((family) => {
          const count = getMemberCount(family.code);
          const link = magicLink(family.code);
          const isCopied = copied === family.code;

          return (
            <Card key={family.code}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-[family-name:var(--font-hand)] text-xl font-bold text-ink">
                      {family.name}
                    </h3>
                    {family.owner && (
                      <span className="text-xs bg-highlight text-ink px-1.5 py-0.5 rounded-sm font-bold">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-[family-name:var(--font-typed)] text-pencil-light tracking-wider">
                    {family.code}
                  </p>
                </div>
                <span className="text-sm font-bold text-ink bg-paper-dark rounded-sm px-2 py-1 border border-paper-line">
                  {count}/10
                </span>
              </div>

              {/* Magic Link */}
              <div className="bg-paper-dark rounded-sm p-2 border border-paper-line mb-3">
                <p className="text-xs text-pencil font-[family-name:var(--font-typed)] truncate select-all">
                  {link}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => copyLink(family)}
                  variant="outline"
                  size="sm"
                >
                  {isCopied ? "Copied!" : "Copy Link"}
                </Button>
                <Button
                  onClick={() => onSelectFamily(family.code)}
                  size="sm"
                >
                  Enter Family
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
