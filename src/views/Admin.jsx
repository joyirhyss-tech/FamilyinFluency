import { useState } from "react";
import { LANGS, DIFFICULTY, DIFFICULTY_SHORT } from "../data/constants";
import { BackArrow, FlameIcon } from "../components/icons/Icons";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";

export function Admin({ familyName, onUpdateFamilyName, players, onUpdatePlayer, onDeletePlayer, onBack, onSwitchFamily, isSuperAdmin }) {
  const [editing, setEditing] = useState(null); // player index
  const [editStreak, setEditStreak] = useState("");
  const [editName, setEditName] = useState("");
  const [editPin, setEditPin] = useState("");
  const [editLangDiffs, setEditLangDiffs] = useState({}); // { spanish: 0, japanese: 2 }
  const [confirmDelete, setConfirmDelete] = useState(null); // player index
  const [editingFamily, setEditingFamily] = useState(false);
  const [editFamilyName, setEditFamilyName] = useState("");

  const startEdit = (i) => {
    const p = players[i];
    setEditing(i);
    setEditStreak(String(p.streak));
    setEditName(p.name);
    setEditPin(p.pin || "");
    // Initialize langDiffs for ALL player languages (fill gaps from legacy p.diff)
    const langs = p.langs || [p.lang];
    const initialDiffs = {};
    langs.forEach((lang) => {
      initialDiffs[lang] = p.langDiffs?.[lang] ?? p.diff ?? 0;
    });
    setEditLangDiffs(initialDiffs);
    setConfirmDelete(null);
  };

  const saveEdit = () => {
    if (editing === null) return;
    const langDiffs = { ...editLangDiffs };
    const diffs = Object.values(langDiffs);
    const maxDiff = diffs.length > 0 ? Math.max(...diffs) : players[editing].diff;
    onUpdatePlayer(editing, {
      name: editName.trim() || players[editing].name,
      streak: Math.max(0, parseInt(editStreak) || 0),
      pin: editPin.length === 3 ? editPin : players[editing].pin,
      langDiffs,
      diff: maxDiff,
    });
    setEditing(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setConfirmDelete(null);
  };

  return (
    <div className="min-h-screen bg-paper page-enter">
      <div className="bg-ink px-5 pt-6 pb-5 text-paper">
        <button
          onClick={onBack}
          className="text-pencil-light text-sm mb-2 hover:text-paper flex items-center gap-1 stamp-btn"
        >
          <BackArrow size={14} /> Back
        </button>
        <h1 className="text-2xl font-[family-name:var(--font-hand)] font-bold">
          Family Admin
        </h1>
        <p className="text-pencil-light text-xs font-[family-name:var(--font-typed)]">
          Manage family members
        </p>
      </div>

      <div className="px-4 -mt-2 pb-6 space-y-3">
        {/* Family Name Setting */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-pencil uppercase tracking-wider mb-0.5">Family Name</p>
              {editingFamily ? (
                <div className="flex items-center gap-2">
                  <input
                    value={editFamilyName}
                    onChange={(e) => setEditFamilyName(e.target.value.slice(0, 30))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && editFamilyName.trim()) {
                        onUpdateFamilyName(editFamilyName.trim());
                        setEditingFamily(false);
                      }
                    }}
                    maxLength={30}
                    className="px-2 py-1 bg-paper-dark border border-paper-line rounded-sm text-sm focus:border-ink outline-none font-[family-name:var(--font-hand)] text-lg"
                    autoFocus
                  />
                  <Button
                    onClick={() => {
                      if (editFamilyName.trim()) {
                        onUpdateFamilyName(editFamilyName.trim());
                        setEditingFamily(false);
                      }
                    }}
                    size="sm"
                  >
                    Save
                  </Button>
                  <Button onClick={() => setEditingFamily(false)} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              ) : (
                <p className="font-[family-name:var(--font-hand)] text-lg text-ink font-bold">{familyName}</p>
              )}
            </div>
            {!editingFamily && (
              <button
                onClick={() => { setEditFamilyName(familyName); setEditingFamily(true); }}
                className="text-xs text-blue-ink stamp-btn px-2 py-1 border border-paper-line rounded-sm hover:bg-paper-dark"
              >
                Edit
              </button>
            )}
          </div>
        </Card>

        {players.map((p, i) => {
          const isFirst = i === 0;
          const isEditing = editing === i;
          const isDeleting = confirmDelete === i;

          return (
            <Card key={p.id}>
              <div className="flex items-center gap-3 mb-2">
                <Avatar name={p.name} colorIdx={p.colorIdx} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-ink text-sm truncate">{p.name}</p>
                    {isFirst && (
                      <span className="text-xs bg-highlight text-ink px-1.5 py-0.5 rounded-sm font-bold">
                        Creator
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)]">
                    {(p.langs || [p.lang]).map(l => {
                      const diff = p.langDiffs?.[l] ?? p.diff;
                      return `${LANGS[l]?.name} ${DIFFICULTY_SHORT[diff]}`;
                    }).join(", ")}
                  </p>
                </div>
                <div className="text-right text-xs text-pencil-light">
                  <span className="flex items-center gap-0.5">
                    <FlameIcon size={12} /> {p.streak}
                  </span>
                  <span>Lv{p.level}</span>
                </div>
              </div>

              {isEditing ? (
                <div className="border-t border-paper-line pt-3 mt-2 space-y-3">
                  {/* Edit Name */}
                  <div>
                    <label className="text-xs font-bold text-pencil uppercase tracking-wider block mb-1">
                      Name
                    </label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 bg-paper-dark border border-paper-line rounded-sm text-sm focus:border-ink outline-none"
                    />
                  </div>

                  {/* Edit Streak */}
                  <div>
                    <label className="text-xs font-bold text-pencil uppercase tracking-wider block mb-1">
                      Streak
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={editStreak}
                        onChange={(e) => setEditStreak(e.target.value)}
                        className="w-20 px-3 py-2 bg-paper-dark border border-paper-line rounded-sm text-sm focus:border-ink outline-none"
                      />
                      <span className="text-xs text-pencil-light">days</span>
                    </div>
                  </div>

                  {/* Edit Language Levels */}
                  <div>
                    <label className="text-xs font-bold text-pencil uppercase tracking-wider block mb-1">
                      Language Levels
                    </label>
                    <div className="space-y-2">
                      {(players[editing]?.langs || [players[editing]?.lang]).map((lang) => {
                        const currentDiff = editLangDiffs[lang] ?? players[editing]?.diff ?? 0;
                        return (
                          <div key={lang} className="paper-card p-2.5">
                            <p className="text-xs font-bold text-ink mb-1.5">{LANGS[lang]?.name}</p>
                            <div className="grid grid-cols-3 gap-1">
                              {DIFFICULTY.map((d, di) => (
                                <button
                                  key={d}
                                  onClick={() => setEditLangDiffs((prev) => ({ ...prev, [lang]: di }))}
                                  className={`
                                    py-1 rounded-sm border-2 text-xs font-bold stamp-btn
                                    ${currentDiff === di
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
                  </div>

                  {/* Edit PIN */}
                  <div>
                    <label className="text-xs font-bold text-pencil uppercase tracking-wider block mb-1">
                      Secret Key
                    </label>
                    <div className="flex gap-2">
                      {[0, 1, 2].map((idx) => (
                        <input
                          key={idx}
                          type="tel"
                          inputMode="numeric"
                          maxLength={1}
                          value={editPin[idx] || ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 1);
                            const next = [editPin[0] || "", editPin[1] || "", editPin[2] || ""];
                            next[idx] = val;
                            setEditPin(next.join(""));
                            if (val && idx < 2) {
                              e.target.nextElementSibling?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !editPin[idx] && idx > 0) {
                              e.target.previousElementSibling?.focus();
                            }
                          }}
                          className="w-10 h-12 text-center text-lg font-[family-name:var(--font-hand)] font-bold bg-paper-dark border border-paper-line rounded-sm focus:border-ink outline-none"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button onClick={saveEdit} size="sm">Save</Button>
                    <Button onClick={cancelEdit} variant="outline" size="sm">Cancel</Button>
                  </div>
                </div>
              ) : isDeleting ? (
                <div className="border-t border-paper-line pt-3 mt-2">
                  <p className="text-sm text-red-pen mb-3 font-bold">
                    Remove {p.name} from the family? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => { onDeletePlayer(i); setConfirmDelete(null); }}
                      size="sm"
                      className="bg-red-pen hover:bg-red-pen/90"
                    >
                      Remove
                    </Button>
                    <Button onClick={() => setConfirmDelete(null)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => startEdit(i)}
                    className="text-xs text-blue-ink stamp-btn px-2 py-1 border border-paper-line rounded-sm hover:bg-paper-dark"
                  >
                    Edit
                  </button>
                  {(!isFirst || isSuperAdmin) && (
                    <button
                      onClick={() => { setConfirmDelete(i); setEditing(null); }}
                      className="text-xs text-red-pen stamp-btn px-2 py-1 border border-paper-line rounded-sm hover:bg-paper-dark"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </Card>
          );
        })}

        {/* Switch Family */}
        {onSwitchFamily && (
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-pencil uppercase tracking-wider mb-0.5">Family &amp; Friends Circle Key</p>
                <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)]">
                  Sign out and enter a different family code
                </p>
              </div>
              <Button onClick={onSwitchFamily} variant="outline" size="sm">
                Switch
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
