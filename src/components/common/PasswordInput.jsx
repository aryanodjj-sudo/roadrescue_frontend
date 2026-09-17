import { useEffect, useRef, useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const MASK_CHAR = "•";
const REVEAL_DURATION_MS = 700;

/**
 * Finds the smallest edit (start index, how many chars were removed from the
 * old string, and what text was inserted) between an old and a new string.
 * This lets us figure out exactly what the user just typed/deleted/pasted,
 * even though the visible input value is a masked string and not the real
 * password.
 */
function diffStrings(oldStr, newStr) {
  let start = 0;
  const maxStart = Math.min(oldStr.length, newStr.length);
  while (start < maxStart && oldStr[start] === newStr[start]) {
    start++;
  }

  let oldEnd = oldStr.length;
  let newEnd = newStr.length;
  while (
    oldEnd > start &&
    newEnd > start &&
    oldStr[oldEnd - 1] === newStr[newEnd - 1]
  ) {
    oldEnd--;
    newEnd--;
  }

  return {
    start,
    deleteCount: oldEnd - start,
    inserted: newStr.slice(start, newEnd),
  };
}

/**
 * Password input that behaves like a modern mobile keyboard:
 * - Each newly typed character is shown in plain text for a brief moment,
 *   then automatically masks to a dot.
 * - An eye icon lets the user reveal/hide the whole password at any time.
 * - Backspacing, editing in the middle, and pasting are all handled
 *   correctly via string diffing, since the underlying real value never
 *   touches the DOM in masked form.
 */
function PasswordInput({
  name,
  value,
  onChange,
  placeholder = "••••••••",
  autoComplete = "current-password",
  required = false,
  className = "",
  id,
}) {
  const [showAll, setShowAll] = useState(false);
  const [displayValue, setDisplayValue] = useState(value || "");
  const [revealIndex, setRevealIndex] = useState(-1);
  const revealTimerRef = useRef(null);
  const prevDisplayRef = useRef(value || "");

  // Keep the masked display in sync whenever the real password (from the
  // parent's state), the "show all" toggle, or the currently-revealed
  // character index changes.
  useEffect(() => {
    const raw = value || "";
    if (showAll) {
      setDisplayValue(raw);
    } else {
      const masked = raw
        .split("")
        .map((ch, i) => (i === revealIndex ? ch : MASK_CHAR))
        .join("");
      setDisplayValue(masked);
    }
    prevDisplayRef.current = showAll
      ? raw
      : raw
          .split("")
          .map((ch, i) => (i === revealIndex ? ch : MASK_CHAR))
          .join("");
  }, [value, showAll, revealIndex]);

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, []);

  const handleInputChange = (e) => {
    const newDisplay = e.target.value;
    const oldDisplay = prevDisplayRef.current;
    const rawOld = value || "";

    const { start, deleteCount, inserted } = diffStrings(oldDisplay, newDisplay);

    // Apply the same edit to the real (unmasked) password.
    const newRaw =
      rawOld.slice(0, start) + inserted + rawOld.slice(start + deleteCount);

    // Momentarily reveal only the last character of a single freshly-typed
    // character (real mobile-keyboard behaviour). Pastes / multi-char
    // inserts and deletions don't get revealed.
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);

    if (!showAll && inserted.length === 1 && deleteCount === 0) {
      const newIndex = start;
      setRevealIndex(newIndex);
      revealTimerRef.current = setTimeout(() => {
        setRevealIndex(-1);
      }, REVEAL_DURATION_MS);
    } else {
      setRevealIndex(-1);
    }

    onChange({ target: { name, value: newRaw } });
  };

  return (
    <div className="relative">
      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        id={id}
        type="text"
        inputMode="text"
        name={name}
        value={displayValue}
        onChange={handleInputChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        className={
          className ||
          "w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        }
      />
      <button
        type="button"
        onClick={() => setShowAll((prev) => !prev)}
        tabIndex={-1}
        aria-label={showAll ? "Hide password" : "Show password"}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        {showAll ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}

export default PasswordInput;