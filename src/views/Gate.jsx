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
  const [adminSending, setAdminSending] = useState(false);
  const [adminSent, setAdminSent] = useState(false);
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
    if (!adminEmail.trim() || !onAdminLogin) return;
    setAdminSending(true);
    setAdminError(null);
    const { error } = await onAdminLogin(adminEmail.trim());
    setAdminSending(false);
    if (error) {
      setAdminError(error.message);
    } else {
      setAdminSent(true);
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
    <div className="h-[100dvh] flex flex-col items-center bg-paper px-6 text-center notebook-paper overflow-hidden">
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
          {/* Wax seal decoration */}
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

          {!showAdminLogin ? (
            <>
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
                placeholder="MAPLE-TREE"
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

              {adminSent ? (
                <div className="py-4">
                  <div className="text-3xl mb-2">&#9993;</div>
                  <p className="text-sm text-ink font-bold mb-1">Check your inbox</p>
                  <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)]">
                    We sent a magic link to<br />
                    <span className="font-bold text-pencil">{adminEmail}</span>
                  </p>
                  <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)] mt-3">
                    Click the link in the email to sign in.
                  </p>
                  <button
                    onClick={() => { setAdminSent(false); setAdminEmail(""); }}
                    className="text-xs text-blue-ink stamp-btn mt-3"
                  >
                    Send again
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)] mb-4">
                    Enter your admin email for a magic sign-in link
                  </p>

                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => { setAdminEmail(e.target.value); setAdminError(null); }}
                    onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 bg-paper-dark border-2 border-paper-line rounded-sm text-center text-sm
                      font-[family-name:var(--font-typed)] outline-none focus:border-ink"
                    autoFocus
                    autoComplete="email"
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
                    disabled={!adminEmail.trim() || adminSending}
                  >
                    {adminSending ? "Sending..." : "Send Magic Link"}
                  </Button>
                </>
              )}

              <button
                onClick={() => { setShowAdminLogin(false); setAdminError(null); setAdminSent(false); }}
                className="text-xs text-pencil-light stamp-btn mt-3 hover:text-ink"
              >
                &larr; Back to family code
              </button>
            </>
          )}
        </div>

        {/* Admin login toggle */}
        {!showAdminLogin && onAdminLogin && (
          <button
            onClick={() => setShowAdminLogin(true)}
            className="text-xs text-pencil-light stamp-btn mt-4 hover:text-ink font-[family-name:var(--font-typed)]"
          >
            Super Admin Login
          </button>
        )}
      </div>

      <div className="flex-1 min-h-4" />
    </div>
  );
}
