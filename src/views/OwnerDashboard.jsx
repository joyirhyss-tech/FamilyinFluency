import { useState } from "react";
import { magicLink } from "../data/families";
import { familyKey } from "../utils/familyKey";
import { BackArrow } from "../components/icons/Icons";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const MAX_CIRCLES = 20;

export function OwnerDashboard({ families, onCreateFamily, onDeleteFamily, onSelectFamily, onBack }) {
  const [copied, setCopied] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [confirmDeleteCode, setConfirmDeleteCode] = useState(null);

  const getMemberCount = (familyCode) => {
    try {
      const key = familyKey(familyCode, "players");
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data).length : 0;
    } catch {
      return 0;
    }
  };

  const getMembers = (familyCode) => {
    try {
      const key = familyKey(familyCode, "players");
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const copyLink = (family) => {
    const url = magicLink(family.code);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(family.code);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const created = onCreateFamily(newName.trim());
    if (created) {
      setNewName("");
      setShowCreate(false);
    }
  };

  const activeFamilies = (families || []).filter((f) => !f.deleted);
  const atLimit = activeFamilies.length >= MAX_CIRCLES;

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
          Super Admin Dashboard
        </h1>
        <p className="text-pencil-light text-xs font-[family-name:var(--font-typed)]">
          {activeFamilies.length} of {MAX_CIRCLES} circles
        </p>
      </div>

      <div className="px-4 -mt-2 pb-6 space-y-3">
        {/* Instructions */}
        <Card>
          <p className="text-xs text-pencil font-[family-name:var(--font-typed)] leading-relaxed">
            Each circle gets a <span className="font-bold">Family &amp; Friends Circle Key</span> &mdash; a magic link you share. They click the link and the app unlocks for their circle.
          </p>
        </Card>

        {/* Create New Circle */}
        {!showCreate ? (
          <Button
            onClick={() => setShowCreate(true)}
            variant="primary"
            size="md"
            className="w-full"
            disabled={atLimit}
          >
            {atLimit ? `${MAX_CIRCLES} Circle Limit Reached` : "+ Create New Circle"}
          </Button>
        ) : (
          <Card>
            <h3 className="font-[family-name:var(--font-hand)] text-lg font-bold text-ink mb-2">
              New Circle
            </h3>
            <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)] mb-3">
              Give your circle a name (e.g. &ldquo;The Garcias&rdquo;). A unique Circle Key will be generated automatically.
            </p>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value.slice(0, 30))}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Circle name..."
              maxLength={30}
              className="w-full px-4 py-3 bg-paper-dark border-2 border-paper-line rounded-sm text-center text-sm font-[family-name:var(--font-hand)] font-bold outline-none focus:border-ink mb-3"
              autoFocus
            />
            <div className="flex gap-2">
              <Button onClick={handleCreate} size="sm" disabled={!newName.trim()}>
                Create
              </Button>
              <Button onClick={() => { setShowCreate(false); setNewName(""); }} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Family Cards */}
        {activeFamilies.map((family) => {
          const count = getMemberCount(family.code);
          const members = getMembers(family.code);
          const link = magicLink(family.code);
          const isCopied = copied === family.code;
          const isDeleting = confirmDeleteCode === family.code;

          return (
            <Card key={family.code}>
              {/* Header */}
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

              {/* Members preview */}
              {members.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-bold text-pencil uppercase tracking-wider mb-1">Members</p>
                  <div className="flex flex-wrap gap-1">
                    {members.map((m) => (
                      <span
                        key={m.id}
                        className="text-xs bg-paper-dark text-ink px-2 py-0.5 rounded-sm border border-paper-line font-[family-name:var(--font-typed)]"
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Circle Key / Magic Link */}
              <div className="mb-3">
                <p className="text-xs font-bold text-pencil uppercase tracking-wider mb-1">
                  Family &amp; Friends Circle Key
                </p>
                <div className="bg-paper-dark rounded-sm p-2 border border-paper-line">
                  <p className="text-xs text-pencil font-[family-name:var(--font-typed)] truncate select-all">
                    {link}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {isDeleting ? (
                <div className="border-t border-paper-line pt-3 mt-1">
                  <p className="text-sm text-red-pen mb-3 font-bold">
                    Remove the {family.name} circle? Member data will be kept but the circle will no longer appear here.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => { onDeleteFamily(family.code); setConfirmDeleteCode(null); }}
                      size="sm"
                      className="bg-red-pen hover:bg-red-pen/90"
                    >
                      Remove
                    </Button>
                    <Button onClick={() => setConfirmDeleteCode(null)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
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
                    Enter
                  </Button>
                  {!family.owner && (
                    <button
                      onClick={() => setConfirmDeleteCode(family.code)}
                      className="text-xs text-red-pen stamp-btn px-2 py-1 border border-paper-line rounded-sm hover:bg-paper-dark ml-auto"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
