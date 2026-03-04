import { useState, useEffect, useRef } from "react";
import { findFamily, OWNER_CODE } from "../data/families";
import { Button } from "../components/ui/Button";

export function Gate({ families, onActivate, onOwnerMode, isSuperAdmin, onAdminLogin, initialCode }) {
  const [code, setCode] = useState(initialCode || "");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef(null);
  const autoSubmitted = useRef(false);

  // Admin login state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminSending, setAdminSending] = useState(false);
  const [adminError, setAdminError] = useState(null);

  // Auto-enter owner mode if super admin is authenticated
  useEffect(() => {
    if (isSuperAdmin) {
      onOwnerMode();
    }
  }, [isSuperAdmin, onOwnerMode]);

  const handleSubmit = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    // Check owner code first
    if (trimmed === OWNER_CODE) {
      onOwnerMode();
      return;
    }

    // Check family code
    const family = findFamily(trimmed, families);
    if (family) {
      setError(false);
      onActivate(family.code);
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const handleAdminLogin = async () => {
    if (!adminEmail.trim() || !adminPassword || !onAdminLogin) return;
    setAdminSending(true);
    setAdminError(null);
    const { error } = await onAdminLogin(adminEmail.trim(), adminPassword);
    setAdminSending(false);
    if (error) {
      setAdminError(error.message);
    }
  };

  // Auto-submit if initialCode is provided (magic link)
  useEffect(() => {
    if (initialCode && !autoSubmitted.current) {
      autoSubmitted.current = true;
      const trimmed = initialCode.trim().toUpperCase();
      const family = findFamily(trimmed, families);
      if (family) {
        onActivate(family.code);
      } else {
        setError(true);
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-[100dvh] flex flex-col items-center bg-paper px-6 text-center notebook-paper overflow-hidden relative">
      <div className="flex-1 min-h-8" />

      <div className="page-enter flex flex-col items-center shrink-0">
        <img
          src="/influently.png"
          alt="inFluently logo"
          className="w-20 h-20 mx-auto mb-3 object-contain"
        />
        <h1 className="text-4xl font-[family-name:var(--font-hand)] font-bold text-ink tracking-tight mb-1">
          Family inFluency
        </h1>
        <p className="text-pencil-light text-xs font-[family-name:var(--font-typed)] mb-6">
          Your family&#8217;s language journey, one word at a time
        </p>

        {/* Invitation card */}
        <div className="paper-card p-6 w-72 max-w-full">
            {!showAdminLogin ? (
            <>
              {/* Wax seal decoration — only on family code view */}
              <div className="flex justify-center mb-3">
                <div className="seal-drop">
                  <svg width="48" height="48" viewBox="0 0 48 48" className="text-wax-seal">
                    <circle cx="24" cy="24" r="22" fill="currentColor" opacity="0.9" />
                    <circle cx="24" cy="24" r="18" fill="none" stroke="#fff" strokeWidth="1" opacity="0.3" />
                    {/* Key icon */}
                    <circle cx="24" cy="19" r="5" fill="none" stroke="#fff" strokeWidth="2" opacity="0.8" />
                    <line x1="24" y1="24" x2="24" y2="34" stroke="#fff" strokeWidth="2" opacity="0.8" />
                    <line x1="24" y1="30" x2="28" y2="30" stroke="#fff" strokeWidth="2" opacity="0.8" />
                    <line x1="24" y1="33" x2="27" y2="33" stroke="#fff" strokeWidth="2" opacity="0.8" />
                  </svg>
                </div>
              </div>

              <h2 className="font-[family-name:var(--font-hand)] text-2xl font-bold text-ink mb-1">
                Family &amp; Friends Circle Key
              </h2>
              <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)] mb-4">
                Enter your invite code to unlock
              </p>

              <input
                ref={inputRef}
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="ENTER-CODE"
                className={`
                  w-full px-4 py-3 bg-paper-dark border-2 rounded-sm text-center text-lg
                  font-[family-name:var(--font-hand)] font-bold tracking-wider
                  outline-none uppercase
                  ${error ? "border-red-pen" : "border-paper-line focus:border-ink"}
                  ${shaking ? "shake" : ""}
                `}
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />

              {error && (
                <p className="text-xs text-red-pen mt-2 font-[family-name:var(--font-typed)]">
                  Hmm, that code wasn&#8217;t recognized
                </p>
              )}

              <Button
                onClick={handleSubmit}
                variant="stamp"
                size="lg"
                className="w-full mt-4"
                disabled={!code.trim()}
              >
                Unlock
              </Button>
            </>
          ) : (
            <>
              <h2 className="font-[family-name:var(--font-hand)] text-2xl font-bold text-ink mb-1">
                Super Admin
              </h2>
              <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)] mb-4">
                Sign in with your admin credentials
              </p>

              <input
                type="email"
                value={adminEmail}
                onChange={(e) => { setAdminEmail(e.target.value); setAdminError(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                placeholder="you@email.com"
                className="w-full px-4 py-3 bg-paper-dark border-2 border-paper-line rounded-sm text-center text-sm
                  font-[family-name:var(--font-typed)] outline-none focus:border-ink mb-3"
                autoFocus
                autoComplete="email"
              />

              <input
                type="password"
                value={adminPassword}
                onChange={(e) => { setAdminPassword(e.target.value); setAdminError(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                placeholder="Password"
                className="w-full px-4 py-3 bg-paper-dark border-2 border-paper-line rounded-sm text-center text-sm
                  font-[family-name:var(--font-typed)] outline-none focus:border-ink"
                autoComplete="current-password"
              />

              {adminError && (
                <p className="text-xs text-red-pen mt-2 font-[family-name:var(--font-typed)]">
                  {adminError}
                </p>
              )}

              <Button
                onClick={handleAdminLogin}
                variant="stamp"
                size="lg"
                className="w-full mt-4"
                disabled={!adminEmail.trim() || !adminPassword || adminSending}
              >
                {adminSending ? "Signing in..." : "Sign In"}
              </Button>

              <button
                onClick={() => { setShowAdminLogin(false); setAdminError(null); setAdminPassword(""); }}
                className="text-xs text-pencil-light stamp-btn mt-3 hover:text-ink"
              >
                &larr; Back to family code
              </button>
            </>
          )}
        </div>

      </div>

      <div className="flex-1 min-h-4" />

      {/* Hidden admin gear — subtle icon, no label */}
      {!showAdminLogin && onAdminLogin && (
        <button
          onClick={() => setShowAdminLogin(true)}
          className="absolute bottom-4 right-4 text-pencil-light/50 hover:text-pencil-light stamp-btn p-2"
          aria-label="Admin"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      )}
    </div>
  );
}
