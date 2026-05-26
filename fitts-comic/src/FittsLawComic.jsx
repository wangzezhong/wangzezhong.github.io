import { useState, useEffect, useRef, useMemo } from "react";

/*
 * Fitts' Law: Interactive Data Comic
 * Single-file React component. Tailwind not used; all styling is scoped
 * via a <style> block + inline styles so the file is portable.
 *
 * Shared state lives at the top of FittsLawComic:
 *   W, D            : current target width and distance (driven by Panel 2)
 *   trials          : every recorded click is pushed here as { W, D, MT }
 *   panel8Trials    : Panel 8's form-fill trials, lifted up so the bottom
 *                     "Clear all data" button can reset them too
 *
 * Panels read/write this shared state, which is what makes it feel
 * like a dashboard while still reading top-to-bottom as a comic.
 */

// ---------- design tokens ----------
const PAPER = "#EBE5D7";
const PANEL = "#F7F2E5";
const PANEL_DEEP = "#EFE5D2";
const INK = "#1A1A17";
const RED = "#B53A1E";
const TEAL = "#126E7A";
const MUTED = "#8B8475";
const RULE = "#1A1A1733";

const FD = '"Fraunces", "Iowan Old Style", Georgia, serif';
const FB = '"Karla", "Helvetica Neue", system-ui, sans-serif';
const FM = '"JetBrains Mono", "SF Mono", "Courier New", monospace';

// ---------- Fitts constants (per input type, rough empirical defaults) ----------
const FITTS_CONSTS = {
  mouse:    { a: 100, b: 150, label: "Mouse" },
  trackpad: { a: 120, b: 200, label: "Trackpad" },
  touch:    { a: 180, b: 100, label: "Touchscreen" },
  pen:      { a: 130, b: 130, label: "Stylus" },
};

const fittsID = (D, W) => Math.log2(D / W + 1);
const fittsMT = (D, W, a = FITTS_CONSTS.mouse.a, b = FITTS_CONSTS.mouse.b) =>
  a + b * fittsID(D, W);

// Linear regression of MT on ID for a user's trials.
// Returns { a, b, n } or null if not enough ID-variance to fit a slope.
function linearFit(trials) {
  if (!trials || trials.length < 2) return null;
  const pts = trials.map((t) => ({ x: fittsID(t.D, t.W), y: t.MT }));
  const n = pts.length;
  const meanX = pts.reduce((s, p) => s + p.x, 0) / n;
  const meanY = pts.reduce((s, p) => s + p.y, 0) / n;
  let num = 0, den = 0;
  for (const p of pts) {
    num += (p.x - meanX) * (p.y - meanY);
    den += (p.x - meanX) ** 2;
  }
  if (den < 1e-3) return null; // ID has essentially no variance
  const b = num / den;
  const a = meanY - b * meanX;
  return { a, b, n };
}

// =========================================================
// Reusable bits
// =========================================================

function Panel({ number, eyebrow, caption, accent = "ink", children }) {
  const accentBg = accent === "red" ? RED : accent === "teal" ? TEAL : INK;
  return (
    <section className="panel-frame">
      <div className="panel-number" style={{ background: accentBg }}>
        {number}
      </div>
      {eyebrow && <p className="panel-eyebrow">{eyebrow}</p>}
      {caption && <p className="panel-caption">{caption}</p>}
      {children}
    </section>
  );
}

function Slider({ name, value, setValue, min, max, step = 1, unit = "px" }) {
  return (
    <div className="slider-row">
      <div className="slider-label-row">
        <span className="slider-name">{name}</span>
        <span className="slider-value">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={(e) => setValue(parseInt(e.target.value))}
        style={{ width: "100%", accentColor: RED }}
      />
    </div>
  );
}

function Stat({ label, value, accent = "ink", small = false }) {
  const color = accent === "red" ? RED : accent === "teal" ? TEAL : INK;
  return (
    <div className="stat">
      <p className="stat-label">{label}</p>
      <p
        className="stat-value"
        style={{ color, fontSize: small ? "16px" : "22px" }}
      >
        {value}
      </p>
    </div>
  );
}

// =========================================================
// DotsCanvas, the core interactive element
// =========================================================

function DotsCanvas({
  W,
  D,
  height = 200,
  recordTrials = false,
  onTrial,
  showAnnotations = false,
  noteText,
  clickLabel,
}) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(640);
  const [nextTarget, setNextTarget] = useState("a");
  const [lastClickTime, setLastClickTime] = useState(null);
  const [pulse, setPulse] = useState(null); // 'a' | 'b' | null, for feedback

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setContainerWidth(e.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // The timing interval is only meaningful for the W/D the user just clicked
  // under. If they change either, drop the stale start time so the next click
  // begins a fresh interval instead of mis-tagging the old MT.
  useEffect(() => {
    setLastClickTime(null);
  }, [W, D]);

  // clamp D to canvas so dots stay visible
  const usableD = Math.min(D, Math.max(60, containerWidth - W - 24));
  const centerX = containerWidth / 2;
  const leftX = centerX - usableD / 2;
  const rightX = centerX + usableD / 2;
  const centerY = height / 2;

  const handleClick = (which) => {
    if (which !== nextTarget) return;
    const now = performance.now();
    setPulse(which);
    setTimeout(() => setPulse(null), 180);
    if (lastClickTime !== null && recordTrials && onTrial) {
      const dt = now - lastClickTime;
      if (dt > 60 && dt < 3000) {
        onTrial({ W, D: usableD, MT: dt, ts: Date.now() });
      }
    }
    setLastClickTime(now);
    setNextTarget(which === "a" ? "b" : "a");
  };

  return (
    <div
      ref={containerRef}
      className="dot-arena"
      style={{ height: `${height}px` }}
    >
      {/* distance rule */}
      <div
        style={{
          position: "absolute",
          top: `${centerY}px`,
          left: `${leftX}px`,
          width: `${usableD}px`,
          height: "1px",
          background: RULE,
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />
      {showAnnotations && (
        <>
          {/* D label */}
          <div
            style={{
              position: "absolute",
              top: `${centerY + 14}px`,
              left: `${leftX + usableD / 2}px`,
              transform: "translateX(-50%)",
              fontFamily: FM,
              fontSize: "10px",
              color: MUTED,
              letterSpacing: "0.12em",
              pointerEvents: "none",
            }}
          >
            ← D = {Math.round(usableD)} px →
          </div>
          {/* W label */}
          <div
            style={{
              position: "absolute",
              top: `${centerY - W / 2 - 18}px`,
              left: `${rightX}px`,
              transform: "translateX(-50%)",
              fontFamily: FM,
              fontSize: "10px",
              color: MUTED,
              letterSpacing: "0.12em",
              pointerEvents: "none",
            }}
          >
            W = {W} px
          </div>
        </>
      )}
      {/* dot A */}
      <button
        type="button"
        onClick={() => handleClick("a")}
        aria-label={`Target A, ${
          nextTarget === "a" ? "click this one now" : "wait for next round"
        }`}
        aria-pressed={nextTarget === "a"}
        className={`dot ${nextTarget === "a" ? "dot-active" : "dot-idle"} ${
          pulse === "a" ? "dot-pulse" : ""
        }`}
        style={{
          left: `${leftX - W / 2}px`,
          top: `${centerY - W / 2}px`,
          width: `${W}px`,
          height: `${W}px`,
          display: clickLabel ? "flex" : "block",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {clickLabel && nextTarget === "a" && W >= 36 && (
          <span
            style={{
              fontFamily: FM,
              fontSize: `${Math.max(7, Math.min(13, W * 0.22))}px`,
              letterSpacing: "0.04em",
              color: PAPER,
              pointerEvents: "none",
              opacity: 0.95,
              whiteSpace: "nowrap",
              fontWeight: 500,
            }}
          >
            {clickLabel}
          </span>
        )}
      </button>
      {/* External Click label for small dot A (W too small to fit text inside) */}
      {clickLabel && nextTarget === "a" && W < 36 && (
        <div
          style={{
            position: "absolute",
            left: `${Math.max(20, Math.min(containerWidth - 20, leftX))}px`,
            top: `${centerY - W / 2 - 36}px`,
            transform: "translateX(-50%)",
            fontFamily: FM,
            fontSize: "11px",
            letterSpacing: "0.04em",
            color: INK,
            opacity: 0.7,
            fontWeight: 500,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          {clickLabel}
          <br />↓
        </div>
      )}
      {/* dot B */}
      <button
        type="button"
        onClick={() => handleClick("b")}
        aria-label={`Target B, ${
          nextTarget === "b" ? "click this one now" : "wait for next round"
        }`}
        aria-pressed={nextTarget === "b"}
        className={`dot ${nextTarget === "b" ? "dot-active" : "dot-idle"} ${
          pulse === "b" ? "dot-pulse" : ""
        }`}
        style={{
          left: `${rightX - W / 2}px`,
          top: `${centerY - W / 2}px`,
          width: `${W}px`,
          height: `${W}px`,
          display: clickLabel ? "flex" : "block",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {clickLabel && nextTarget === "b" && W >= 36 && (
          <span
            style={{
              fontFamily: FM,
              fontSize: `${Math.max(7, Math.min(13, W * 0.22))}px`,
              letterSpacing: "0.04em",
              color: PAPER,
              pointerEvents: "none",
              opacity: 0.95,
              whiteSpace: "nowrap",
              fontWeight: 500,
            }}
          >
            {clickLabel}
          </span>
        )}
      </button>
      {/* External Click label for small dot B (W too small to fit text inside) */}
      {clickLabel && nextTarget === "b" && W < 36 && (
        <div
          style={{
            position: "absolute",
            left: `${Math.max(20, Math.min(containerWidth - 20, rightX))}px`,
            top: `${centerY - W / 2 - 36}px`,
            transform: "translateX(-50%)",
            fontFamily: FM,
            fontSize: "11px",
            letterSpacing: "0.04em",
            color: INK,
            opacity: 0.7,
            fontWeight: 500,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          {clickLabel}
          <br />↓
        </div>
      )}
      {noteText && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "12px",
            fontFamily: FM,
            fontSize: "10px",
            letterSpacing: "0.08em",
            color: MUTED,
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          {noteText}
        </div>
      )}
    </div>
  );
}

// =========================================================
// Panel 1, The hook: guess
// =========================================================

function Panel1({ inputType, onChooseInput, a, b }) {
  const [revealed, setRevealed] = useState(false);

  const cfgA = { W: 80, D: 180 };
  const cfgB = { W: 18, D: 420 };
  const mtA = Math.round(fittsMT(cfgA.D, cfgA.W, a, b));
  const mtB = Math.round(fittsMT(cfgB.D, cfgB.W, a, b));

  const labelWord = inputType === "touch" ? "Tap" : "Click";
  const showInputPicker =
    inputType === "mouse" || inputType === "trackpad";

  return (
    <Panel
      number="01 · Intuition"
      eyebrow="Take a guess"
      caption="Do you think the click speed will be different between groups A and B?"
    >
      {showInputPicker && (
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 18,
            alignItems: "center",
            paddingBottom: 14,
            borderBottom: `1px dashed ${RULE}`,
          }}
        >
          <span
            style={{
              fontFamily: FM,
              fontSize: 11,
              color: MUTED,
              letterSpacing: "0.12em",
              marginRight: 8,
              textTransform: "uppercase",
            }}
          >
            You're using
          </span>
          <ToggleTab
            active={inputType === "mouse"}
            onClick={() => onChooseInput && onChooseInput("mouse")}
            label="Mouse"
          />
          <ToggleTab
            active={inputType === "trackpad"}
            onClick={() => onChooseInput && onChooseInput("trackpad")}
            label="Trackpad"
          />
          <span
            style={{
              fontFamily: FB,
              fontSize: 11,
              color: MUTED,
              marginLeft: 8,
              fontStyle: "italic",
            }}
          >
            The browser can't tell these two apart. Let it know, since it'll affect the predicted numbers below.
          </span>
        </div>
      )}
      <div className="pair-grid">
        <div>
          <p
            style={{
              fontFamily: FM,
              fontSize: "11px",
              letterSpacing: "0.1em",
              color: MUTED,
              margin: "0 0 6px",
              textTransform: "uppercase",
            }}
          >
            A · big, near
          </p>
          <DotsCanvas
            W={cfgA.W}
            D={cfgA.D}
            height={160}
            noteText={revealed ? `Fitts predicts ≈ ${mtA} ms` : "?"}
            clickLabel={labelWord}
          />
        </div>
        <div>
          <p
            style={{
              fontFamily: FM,
              fontSize: "11px",
              letterSpacing: "0.1em",
              color: MUTED,
              margin: "0 0 6px",
              textTransform: "uppercase",
            }}
          >
            B · small, far
          </p>
          <DotsCanvas
            W={cfgB.W}
            D={cfgB.D}
            height={160}
            noteText={revealed ? `Fitts predicts ≈ ${mtB} ms` : "?"}
            clickLabel={labelWord}
          />
        </div>
      </div>

      <div style={{ marginTop: "18px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
        <button
          className="comic-button primary"
          onClick={() => setRevealed(!revealed)}
        >
          {revealed ? "Hide again" : "Reveal answer"}
        </button>
        {revealed && (
          <p
            style={{
              fontFamily: FD,
              fontStyle: "italic",
              fontSize: "15px",
              color: INK,
              margin: 0,
            }}
          >
            A is roughly <span style={{ color: RED, fontWeight: 600 }}>{Math.abs(mtB - mtA)} ms</span> faster than B.
            Why? Read on.
          </p>
        )}
      </div>
    </Panel>
  );
}

// =========================================================
// Panel 2, The two variables + hands-on measurement (merged with old Panel 3)
// =========================================================

function Panel2({ W, setW, D, setD, addTrial, trials }) {
  // trials from this panel's "explore" source
  const exploreTrials = trials.filter((t) => t.src === "explore");
  const lastTrial = exploreTrials[exploreTrials.length - 1];
  const recent = exploreTrials.slice(-10);
  const avg =
    recent.length > 0
      ? Math.round(recent.reduce((s, t) => s + t.MT, 0) / recent.length)
      : null;

  // Geometric constraint: D >= W (two dots cannot overlap).
  // The slider ranges dynamically squeeze each other to make D < W unreachable.
  const D_MIN_ABS = 100;
  const D_MAX_ABS = 520;
  const W_MIN_ABS = 16;
  const W_MAX_ABS = 140;
  const setDSafe = (val) => setD(Math.max(val, W));
  const setWSafe = (val) => setW(Math.min(val, D));

  return (
    <Panel
      number="02 · Two variables"
      eyebrow="Only two things"
      caption="Let's focus on two variables: the target's width W, and the distance D you have to travel. Drag the two sliders to change the setup, then click back and forth between the two dots. Every click, we record your movement time along with the current W and D. That data shows up in the next panel."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginBottom: "18px",
        }}
      >
        <Slider
          name="Distance D"
          value={D}
          setValue={setDSafe}
          min={Math.max(D_MIN_ABS, W)}
          max={D_MAX_ABS}
          step={10}
        />
        <Slider
          name="Width W"
          value={W}
          setValue={setWSafe}
          min={W_MIN_ABS}
          max={Math.min(W_MAX_ABS, D)}
          step={2}
        />
      </div>

      <DotsCanvas
        W={W}
        D={D}
        height={200}
        recordTrials
        onTrial={(t) => addTrial({ ...t, src: "explore" })}
        noteText={`Current: D=${Math.round(D)}px, W=${W}px`}
        showAnnotations
      />

      <div className="stats-row">
        <Stat
          label="Last click"
          value={lastTrial ? `${Math.round(lastTrial.MT)} ms` : "·"}
          accent="red"
        />
        <Stat
          label="Avg of last 10"
          value={avg !== null ? `${avg} ms` : "·"}
          accent="red"
        />
        <Stat label="Total tries" value={exploreTrials.length} />
      </div>

      <p
        style={{
          fontFamily: FB,
          fontSize: "13px",
          color: MUTED,
          margin: "16px 0 0",
          lineHeight: 1.6,
        }}
      >
        Tip: try a few different combinations of D and W, and click a bunch on each one. The charts in the later panels grow out of these points, so the more setups and more clicks, the clearer the pattern.
      </p>

      {/* Quick D/W ratio presets, for fast demo switching without dragging sliders */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          marginTop: 12,
        }}
      >
        <span
          style={{
            fontFamily: FM,
            fontSize: 11,
            color: MUTED,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
          Quick presets D/W ≈
        </span>
        {[
          { ratio: 4,  D: 200, W: 50 },
          { ratio: 8,  D: 240, W: 30 },
          { ratio: 16, D: 320, W: 20 },
          { ratio: 24, D: 480, W: 20 },
          { ratio: 32, D: 520, W: 16 },
        ].map((p) => {
          const currentRatio = W > 0 ? D / W : 0;
          const isActive = Math.abs(currentRatio - p.ratio) < 0.6;
          return (
            <button
              key={p.ratio}
              onClick={() => {
                setD(p.D);
                setW(p.W);
              }}
              style={{
                padding: "5px 14px",
                fontFamily: FM,
                fontSize: 12,
                fontWeight: isActive ? 600 : 500,
                background: isActive ? TEAL : "transparent",
                color: isActive ? PAPER : INK,
                border: `1px solid ${isActive ? TEAL : RULE}`,
                borderRadius: 999,
                cursor: "pointer",
                transition: "all 0.15s ease",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = PANEL_DEEP;
                  e.currentTarget.style.borderColor = INK;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = RULE;
                }
              }}
              title={`D = ${p.D}px, W = ${p.W}px (D/W = ${(p.D / p.W).toFixed(1)})`}
            >
              {p.ratio}
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

// =========================================================
// Panel 4, Formula (with visual icons for each variable, detailed a/b)
// =========================================================

function StopwatchIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="19" y="3" width="10" height="4" rx="1.5" fill={INK} />
      <rect
        x="32"
        y="9"
        width="5"
        height="3"
        rx="0.5"
        fill={INK}
        transform="rotate(45 34.5 10.5)"
      />
      <circle
        cx="24"
        cy="26"
        r="15"
        fill={PAPER}
        stroke={INK}
        strokeWidth="1.8"
      />
      <line x1="24" y1="14" x2="24" y2="17" stroke={INK} strokeWidth="1.2" />
      <line x1="36" y1="26" x2="33" y2="26" stroke={INK} strokeWidth="1.2" />
      <line x1="24" y1="38" x2="24" y2="35" stroke={INK} strokeWidth="1.2" />
      <line x1="12" y1="26" x2="15" y2="26" stroke={INK} strokeWidth="1.2" />
      <line
        x1="24"
        y1="26"
        x2="32"
        y2="18"
        stroke={RED}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="26" r="1.8" fill={INK} />
    </svg>
  );
}

function DistanceIcon() {
  return (
    <svg width="84" height="48" viewBox="0 0 84 48" aria-hidden="true">
      {/* start point */}
      <circle cx="10" cy="24" r="3.5" fill={INK} />
      {/* target (outlined so the D arrow is visible inside it) */}
      <circle cx="74" cy="24" r="8" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      {/* explicit center marker */}
      <circle cx="74" cy="24" r="1.2" fill={INK} />
      {/* distance line, from start point all the way to the target's center */}
      <line x1="10" y1="24" x2="74" y2="24" stroke={RED} strokeWidth="2.2" />
      <polygon points="74,24 69,21 69,27" fill={RED} />
      <text
        x="42"
        y="15"
        textAnchor="middle"
        fontFamily={FM}
        fontSize="12"
        fontWeight="700"
        fill={RED}
      >
        D
      </text>
    </svg>
  );
}

function WidthIcon() {
  return (
    <svg width="78" height="48" viewBox="0 0 78 48" aria-hidden="true">
      {/* approach-direction indicator: where the cursor is coming from */}
      <line x1="5" y1="24" x2="23" y2="24" stroke={INK} strokeWidth="1.4" />
      <polygon points="23,24 18,22 18,26" fill={INK} />
      {/* target circle */}
      <circle
        cx="46"
        cy="24"
        r="18"
        fill={PAPER}
        stroke={INK}
        strokeWidth="1.6"
      />
      {/* W: width along the direction of approach */}
      <line x1="28" y1="24" x2="64" y2="24" stroke={RED} strokeWidth="2.2" />
      <polygon points="64,24 59,21 59,27" fill={RED} />
      <polygon points="28,24 33,21 33,27" fill={RED} />
      <text
        x="46"
        y="14"
        textAnchor="middle"
        fontFamily={FM}
        fontSize="12"
        fontWeight="700"
        fill={RED}
      >
        W
      </text>
    </svg>
  );
}

// Two small line charts that visualize what a (intercept) and b (slope) do
// to the MT = a + b · ID line. Both share x = ID, y = MT axes so they read as
// "same diagram, only the parameter changes."
function InterceptIllustration() {
  return (
    <svg
      width="100%"
      height="84"
      viewBox="0 0 180 84"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", marginTop: 4 }}
      aria-hidden="true"
    >
      <line x1="20" y1="6" x2="20" y2="68" stroke={MUTED} strokeWidth="1" />
      <line x1="20" y1="68" x2="174" y2="68" stroke={MUTED} strokeWidth="1" />
      {/* larger a, line shifted higher */}
      <line x1="20" y1="34" x2="170" y2="12" stroke={TEAL} strokeWidth="1.8" />
      <circle cx="20" cy="34" r="2.6" fill={TEAL} />
      <text x="116" y="11" fontFamily={FM} fontSize="9" fontWeight="600" fill={TEAL}>larger a</text>
      {/* smaller a, parallel line shifted lower */}
      <line x1="20" y1="58" x2="170" y2="36" stroke={INK} strokeOpacity="0.45" strokeWidth="1.6" />
      <circle cx="20" cy="58" r="2.6" fill={INK} fillOpacity="0.55" />
      <text x="116" y="48" fontFamily={FM} fontSize="9" fill={MUTED}>smaller a</text>
      <text x="170" y="80" textAnchor="end" fontFamily={FM} fontSize="9" fill={MUTED}>ID</text>
      <text x="6" y="11" fontFamily={FM} fontSize="9" fill={MUTED}>MT</text>
    </svg>
  );
}

function SlopeIllustration() {
  return (
    <svg
      width="100%"
      height="84"
      viewBox="0 0 180 84"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", marginTop: 4 }}
      aria-hidden="true"
    >
      <line x1="20" y1="6" x2="20" y2="68" stroke={MUTED} strokeWidth="1" />
      <line x1="20" y1="68" x2="174" y2="68" stroke={MUTED} strokeWidth="1" />
      {/* both lines share the same intercept */}
      <circle cx="20" cy="58" r="2.6" fill={TEAL} />
      {/* larger b, steeper */}
      <line x1="20" y1="58" x2="170" y2="10" stroke={TEAL} strokeWidth="1.8" />
      <text x="134" y="11" fontFamily={FM} fontSize="9" fontWeight="600" fill={TEAL}>larger b</text>
      {/* smaller b, less steep */}
      <line x1="20" y1="58" x2="170" y2="38" stroke={INK} strokeOpacity="0.45" strokeWidth="1.6" />
      <text x="134" y="34" fontFamily={FM} fontSize="9" fill={MUTED}>smaller b</text>
      <text x="170" y="80" textAnchor="end" fontFamily={FM} fontSize="9" fill={MUTED}>ID</text>
      <text x="6" y="11" fontFamily={FM} fontSize="9" fill={MUTED}>MT</text>
    </svg>
  );
}

function FormulaVariable({ icon, term, english, definition }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "14px 16px",
        border: `1px solid ${RULE}`,
        borderRadius: 2,
        background: PAPER,
      }}
    >
      <div style={{ flexShrink: 0, paddingTop: 2 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontFamily: FM,
              fontSize: 18,
              fontWeight: 600,
              color: TEAL,
            }}
          >
            {term}
          </span>
          <span
            style={{
              fontFamily: FB,
              fontSize: 11,
              color: MUTED,
              letterSpacing: "0.02em",
            }}
          >
            {english}
          </span>
        </div>
        <p
          style={{
            fontFamily: FB,
            fontSize: 12.5,
            color: INK,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {definition}
        </p>
      </div>
    </div>
  );
}

function Panel4({ W, D, a, b, inputLabel }) {
  const id = fittsID(D, W);
  const idDisp = Number(id.toFixed(2));
  const predDisp = a + b * idDisp;

  return (
    <Panel
      number="04 · The formula"
      caption="That curve from the last panel? Fitts first wrote it down in 1954, then MacKenzie refined it in 1989 into the form below. Let's pull it apart: what each variable means, and the typical numbers for different devices."
      accent="teal"
    >
      <div className="formula">
        <span className="formula-large">
          MT = a + b · log<sub>2</sub>(D / W + 1)
        </span>
      </div>

      {/* Visual variables: MT, D, W */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          margin: "24px 0 0",
        }}
      >
        <FormulaVariable
          icon={<StopwatchIcon />}
          term="MT"
          english="Movement Time"
          definition="How long it takes you to complete one click. Unit: ms."
        />
        <FormulaVariable
          icon={<DistanceIcon />}
          term="D"
          english="Distance"
          definition="Distance from your start point to the center of the target."
        />
        <FormulaVariable
          icon={<WidthIcon />}
          term="W"
          english="Width"
          definition="The target's width along the direction of movement."
        />
      </div>

      {/* ID, the combined difficulty term. Rewrites the formula as
          MT = a + b · ID so a and b can be read as intercept + slope below. */}
      <div
        style={{
          marginTop: 20,
          padding: "16px 20px",
          background: PAPER,
          border: `1px solid ${RULE}`,
          borderLeft: `3px solid ${TEAL}`,
          borderRadius: 2,
        }}
      >
        <p
          style={{
            fontFamily: FM,
            fontSize: 11,
            letterSpacing: "0.1em",
            color: MUTED,
            textTransform: "uppercase",
            margin: "0 0 10px",
          }}
        >
          Bundle D and W into one number
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: FM,
              fontSize: 18,
              fontWeight: 600,
              color: TEAL,
            }}
          >
            ID = log<sub>2</sub>(D / W + 1)
          </span>
          <span
            style={{
              fontFamily: FB,
              fontSize: 13,
              color: MUTED,
            }}
          >
            Index of Difficulty, measured in bits
          </span>
        </div>
        <p
          style={{
            fontFamily: FB,
            fontSize: 13,
            color: INK,
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          ID rolls the task's geometry (D and W) into one number: how hard the click is. With it, Fitts' formula simplifies to{" "}
          <span style={{ fontFamily: FM, fontWeight: 600 }}>MT = a + b · ID</span>
          , a straight line. Now the two remaining constants <em>a</em> and <em>b</em> read as the intercept and the slope of that line, which is what we unpack next.
        </p>
      </div>

      {/* a and b, detailed empirical constants section */}
      <div
        style={{
          marginTop: 20,
          padding: "18px 20px",
          background: PAPER,
          border: `1px solid ${RULE}`,
          borderRadius: 2,
        }}
      >
        <p
          style={{
            fontFamily: FM,
            fontSize: 11,
            letterSpacing: "0.1em",
            color: MUTED,
            textTransform: "uppercase",
            margin: "0 0 14px",
          }}
        >
          a and b · constants fit from experiments (vary by person / device / task)
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 22,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: FM,
                fontSize: 16,
                fontWeight: 600,
                color: TEAL,
                margin: "0 0 4px",
              }}
            >
              a · startup cost
            </p>
            <p
              style={{
                fontFamily: FB,
                fontSize: 11,
                color: MUTED,
                margin: "0 0 8px",
                fontStyle: "italic",
              }}
            >
              intercept, where the line crosses the y-axis
            </p>
            <p
              style={{
                fontFamily: FB,
                fontSize: 13,
                color: INK,
                margin: "0 0 10px",
                lineHeight: 1.55,
              }}
            >
              Reaction time + motor planning + initial posture adjustment. Has nothing to do with target size or distance. Even for a "zero-difficulty" target, you still need this many ms before you can start moving.
            </p>
            <InterceptIllustration />
            <p
              style={{
                fontFamily: FM,
                fontSize: 12,
                color: MUTED,
                margin: "10px 0 0",
              }}
            >
              You're using{" "}
              <span style={{ color: TEAL, fontWeight: 600 }}>{inputLabel}</span>
              , a ≈{" "}
              <span style={{ color: TEAL, fontWeight: 600 }}>{a} ms</span>
            </p>
          </div>
          <div>
            <p
              style={{
                fontFamily: FM,
                fontSize: 16,
                fontWeight: 600,
                color: TEAL,
                margin: "0 0 4px",
              }}
            >
              b · difficulty sensitivity
            </p>
            <p
              style={{
                fontFamily: FB,
                fontSize: 11,
                color: MUTED,
                margin: "0 0 8px",
                fontStyle: "italic",
              }}
            >
              slope of the line
            </p>
            <p
              style={{
                fontFamily: FB,
                fontSize: 13,
                color: INK,
                margin: "0 0 10px",
                lineHeight: 1.55,
              }}
            >
              How many more ms you need for each extra bit of difficulty. Steeper slope: difficulty drags you down more; shallower slope: you stay cool. 1/b is the device's "movement bandwidth" (bit/s).
            </p>
            <SlopeIllustration />
            <p
              style={{
                fontFamily: FM,
                fontSize: 12,
                color: MUTED,
                margin: "10px 0 0",
              }}
            >
              You're using{" "}
              <span style={{ color: TEAL, fontWeight: 600 }}>{inputLabel}</span>
              , b ≈{" "}
              <span style={{ color: TEAL, fontWeight: 600 }}>{b} ms/bit</span>
            </p>
          </div>
        </div>
      </div>

      {/* Lab average values across input devices + source attribution */}
      <div
        style={{
          background: PANEL_DEEP,
          border: `1px solid ${RULE}`,
          padding: "18px 20px",
          marginTop: "18px",
        }}
      >
        <p
          style={{
            fontFamily: FM,
            fontSize: "11px",
            letterSpacing: "0.1em",
            color: MUTED,
            textTransform: "uppercase",
            margin: "0 0 14px",
          }}
        >
          Typical lab values · representative a / b across input devices
        </p>

        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1.2fr",
            gap: "6px 14px",
            fontFamily: FM,
            fontSize: 11,
            color: MUTED,
            paddingBottom: 6,
            borderBottom: `1px solid ${RULE}`,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          <div>Device</div>
          <div style={{ textAlign: "right" }}>a (ms)</div>
          <div style={{ textAlign: "right" }}>b (ms/bit)</div>
          <div style={{ textAlign: "right" }}>Bandwidth 1/b (bit/s)</div>
        </div>

        {/* Data rows */}
        {[
          { key: "mouse",    label: "Mouse",        a: 100, b: 150 },
          { key: "trackpad", label: "Trackpad",     a: 120, b: 200 },
          { key: "touch",    label: "Touchscreen",  a: 180, b: 100 },
          { key: "pen",      label: "Stylus",       a: 130, b: 130 },
        ].map((row) => {
          const isCurrent =
            (inputLabel === "Mouse"       && row.key === "mouse") ||
            (inputLabel === "Trackpad"    && row.key === "trackpad") ||
            (inputLabel === "Touchscreen" && row.key === "touch") ||
            (inputLabel === "Stylus"      && row.key === "pen");
          const bw = (1000 / row.b).toFixed(1);
          return (
            <div
              key={row.key}
              style={{
                display: "grid",
                gridTemplateColumns: "1.6fr 1fr 1fr 1.2fr",
                gap: "6px 14px",
                fontFamily: FM,
                fontSize: 13,
                color: isCurrent ? INK : MUTED,
                fontWeight: isCurrent ? 600 : 400,
                padding: "8px 0",
                borderBottom: `1px solid ${RULE}`,
                alignItems: "center",
              }}
            >
              <div>
                {isCurrent && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: TEAL,
                      marginRight: 8,
                      verticalAlign: "middle",
                    }}
                  />
                )}
                {row.label}
                {isCurrent && (
                  <span
                    style={{
                      fontFamily: FD,
                      fontStyle: "italic",
                      fontSize: 11,
                      color: TEAL,
                      marginLeft: 8,
                    }}
                  >
                    ← you're using this
                  </span>
                )}
              </div>
              <div style={{ textAlign: "right" }}>{row.a}</div>
              <div style={{ textAlign: "right" }}>{row.b}</div>
              <div
                style={{
                  textAlign: "right",
                  color: isCurrent ? TEAL : MUTED,
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                {bw}
              </div>
            </div>
          );
        })}

        {/* Source attribution */}
        <p
          style={{
            fontFamily: FB,
            fontSize: 12,
            color: MUTED,
            margin: "14px 0 0",
            lineHeight: 1.55,
            fontStyle: "italic",
          }}
        >
          Sources: these are representative averages commonly cited in HCI literature; exact numbers vary by study, participant, and task (the same mouse can show b anywhere from 100 to 200 ms/bit across experiments).
          Mouse, trackpad, and stylus ranges come from Card, English &amp; Burr (1978) and MacKenzie, Sellen &amp; Buxton (1991).
          Touchscreen values come from Sears &amp; Shneiderman (1991) and Bi, Li &amp; Zhai (2013)'s FFitts work.
          MacKenzie (1992) reviews a and b ranges across a wide body of early studies.
        </p>
      </div>

      {/* Why the +1, short historical aside */}
      <div
        style={{
          marginTop: 14,
          padding: "12px 16px",
          background: PANEL_DEEP,
          border: `1px dashed ${RULE}`,
          borderRadius: 2,
        }}
      >
        <p
          style={{
            fontFamily: FM,
            fontSize: 11,
            color: MUTED,
            margin: "0 0 6px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Why the +1?
        </p>
        <p
          style={{
            fontFamily: FB,
            fontSize: 13,
            color: INK,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Fitts' original 1954 formula was{" "}
          <span style={{ fontFamily: FM, color: TEAL }}>log₂(2D/W)</span>
          , with no +1. The problem: when D equals half of W, that becomes log₂(1) = 0; any smaller and it goes negative. Fitts himself never hit this (he deliberately only tested ID ≥ 1 bit), but later HCI experiments did produce negative IDs. MacKenzie 1989 published a short note in the Journal of Motor Behavior changing it to{" "}
          <span style={{ fontFamily: FM, color: TEAL }}>log₂(D/W + 1)</span>
          : this keeps ID ≥ 0 (when D = 0, ID = 0, meaning no distance, no difficulty), and makes Fitts' formula correspond exactly to Shannon's channel-capacity formula{" "}
          <span style={{ fontFamily: FM, color: TEAL }}>C = log₂(1 + S/N)</span>{" "}
          in mathematical structure. Almost all modern HCI papers use this version, known as the{" "}
          <em>Shannon formulation of Fitts' law</em>.
        </p>
      </div>


      {/* References, primary literature for this formula */}
      <div
        style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: `1px solid ${RULE}`,
        }}
      >
        <p
          style={{
            fontFamily: FM,
            fontSize: 10,
            color: MUTED,
            margin: "0 0 10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          References
        </p>
        <p
          style={{
            fontFamily: FB,
            fontSize: 11.5,
            color: MUTED,
            margin: "0 0 6px",
            lineHeight: 1.5,
          }}
        >
          Fitts, P. M. (1954).{" "}
          <em>
            The information capacity of the human motor system in controlling
            the amplitude of movement.
          </em>{" "}
          Journal of Experimental Psychology, 47(6), 381–391.
        </p>
        <p
          style={{
            fontFamily: FB,
            fontSize: 11.5,
            color: MUTED,
            margin: "0 0 6px",
            lineHeight: 1.5,
          }}
        >
          MacKenzie, I. S. (1989).{" "}
          <em>
            A note on the information-theoretic basis for Fitts' law.
          </em>{" "}
          Journal of Motor Behavior, 21(3), 323–330.
        </p>
        <p
          style={{
            fontFamily: FB,
            fontSize: 11.5,
            color: MUTED,
            margin: "0 0 6px",
            lineHeight: 1.5,
          }}
        >
          MacKenzie, I. S. (1992).{" "}
          <em>
            Fitts' law as a research and design tool in human-computer
            interaction.
          </em>{" "}
          Human–Computer Interaction, 7(1), 91–139.
        </p>
        <p
          style={{
            fontFamily: FB,
            fontSize: 11.5,
            color: MUTED,
            margin: "0 0 6px",
            lineHeight: 1.5,
          }}
        >
          Card, S. K., English, W. K., &amp; Burr, B. J. (1978).{" "}
          <em>
            Evaluation of mouse, rate-controlled isometric joystick, step keys,
            and text keys for text selection on a CRT.
          </em>{" "}
          Ergonomics, 21(8), 601–613.
        </p>
        <p
          style={{
            fontFamily: FB,
            fontSize: 11.5,
            color: MUTED,
            margin: "0 0 6px",
            lineHeight: 1.5,
          }}
        >
          MacKenzie, I. S., Sellen, A., &amp; Buxton, W. (1991).{" "}
          <em>
            A comparison of input devices in elemental pointing and dragging
            tasks.
          </em>{" "}
          Proceedings of CHI '91, 161–166.
        </p>
        <p
          style={{
            fontFamily: FB,
            fontSize: 11.5,
            color: MUTED,
            margin: "0 0 6px",
            lineHeight: 1.5,
          }}
        >
          Sears, A., &amp; Shneiderman, B. (1991).{" "}
          <em>
            High precision touchscreens: design strategies and comparisons with
            a mouse.
          </em>{" "}
          International Journal of Man–Machine Studies, 34(4), 593–613.
        </p>
        <p
          style={{
            fontFamily: FB,
            fontSize: 11.5,
            color: MUTED,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Bi, X., Li, Y., &amp; Zhai, S. (2013).{" "}
          <em>FFitts law: modeling finger touch with Fitts' law.</em>{" "}
          Proceedings of CHI '13, 1363–1372.
        </p>
      </div>
    </Panel>
  );
}

// =========================================================
// Panel 5 (NEW), Use the formula: predict MT for current (D, W),
// then compare with the user's actual data at that config.
// =========================================================

function Panel5({ W, D, setW, setD, a, b, inputLabel, trials }) {
  const id = fittsID(D, W);
  const predictedMT = Math.round(a + b * id);

  // Same D ≥ W constraint as Panel 02 so the local sliders stay consistent
  const D_MIN_ABS = 100;
  const D_MAX_ABS = 520;
  const W_MIN_ABS = 16;
  const W_MAX_ABS = 140;
  const setDSafe = (val) => setD(Math.max(val, W));
  const setWSafe = (val) => setW(Math.min(val, D));

  // Find trials at this exact (D, W) configuration
  const matchingTrials = trials.filter(
    (t) => Math.round(t.D) === Math.round(D) && t.W === W
  );
  const userAvg =
    matchingTrials.length > 0
      ? Math.round(
          matchingTrials.reduce((s, t) => s + t.MT, 0) / matchingTrials.length
        )
      : null;
  const diff = userAvg !== null ? Math.abs(userAvg - predictedMT) : null;
  const diffPct =
    userAvg !== null && predictedMT > 0
      ? Math.round((diff / predictedMT) * 100)
      : null;

  return (
    <Panel
      number="06 · Predict with the formula"
      eyebrow="Formula in hand"
      caption={`You already know what a and b mean. Plug any D and W into MT = a + b · log₂(D/W + 1), and you get how long one action takes. Drag D and W below; Panel 02 updates live, too.`}
      accent="teal"
    >
      {/* Visual diagram of the two dots with D and W annotated */}
      <DotsCanvas
        W={W}
        D={D}
        height={200}
        showAnnotations
        noteText={`D = ${D} px, W = ${W} px`}
      />

      {/* Mini sliders, local control, synced with Panel 02 via shared state */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginTop: "14px",
          marginBottom: "4px",
        }}
      >
        <Slider
          name="Distance D"
          value={D}
          setValue={setDSafe}
          min={Math.max(D_MIN_ABS, W)}
          max={D_MAX_ABS}
          step={10}
        />
        <Slider
          name="Width W"
          value={W}
          setValue={setWSafe}
          min={W_MIN_ABS}
          max={Math.min(W_MAX_ABS, D)}
          step={2}
        />
      </div>

      {/* Device + a/b info (the diagram already shows D and W) */}
      <div
        style={{
          padding: "10px 14px",
          background: PANEL_DEEP,
          border: `1px solid ${RULE}`,
          borderRadius: 2,
          marginTop: 12,
          marginBottom: 12,
        }}
      >
        <p
          style={{
            fontFamily: FM,
            fontSize: 13,
            color: INK,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: MUTED,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginRight: 10,
            }}
          >
            Device
          </span>
          <span style={{ color: TEAL, fontWeight: 600 }}>{inputLabel}</span>
          {"  ·  "}a ={" "}
          <span style={{ color: TEAL, fontWeight: 600 }}>{a} ms</span>
          {"  ·  "}b ={" "}
          <span style={{ color: TEAL, fontWeight: 600 }}>{b} ms/bit</span>
        </p>
      </div>

      {/* Step-by-step calculation */}
      <div
        style={{
          background: PAPER,
          border: `1px solid ${RULE}`,
          padding: "18px 20px",
          borderRadius: 2,
        }}
      >
        <p
          style={{
            fontFamily: FM,
            fontSize: 10,
            letterSpacing: "0.1em",
            color: MUTED,
            textTransform: "uppercase",
            margin: "0 0 12px",
          }}
        >
          Plug into the formula · step by step
        </p>
        <p
          style={{
            fontFamily: FM,
            fontSize: 14,
            color: INK,
            margin: "0 0 8px",
            lineHeight: 1.7,
          }}
        >
          <span style={{ color: MUTED }}>Step 1 · compute difficulty ID:</span> log₂({D}/{W} + 1) = log₂({(D / W + 1).toFixed(2)}) ={" "}
          <span style={{ color: TEAL, fontWeight: 600 }}>
            {id.toFixed(2)} bits
          </span>
        </p>
        <p
          style={{
            fontFamily: FM,
            fontSize: 14,
            color: INK,
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          <span style={{ color: MUTED }}>Step 2 · plug in a and b:</span> MT = {a} + {b} × {id.toFixed(2)} ={" "}
          <span style={{ color: TEAL, fontWeight: 700, fontSize: "20px" }}>
            {predictedMT} ms
          </span>
        </p>
      </div>

      {/* Comparison with user's actual data */}
      <div
        style={{
          marginTop: 14,
          padding: "14px 18px",
          background: PANEL_DEEP,
          border: `1px solid ${RULE}`,
          borderRadius: 2,
        }}
      >
        <p
          style={{
            fontFamily: FM,
            fontSize: 10,
            color: MUTED,
            margin: "0 0 8px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Formula prediction vs your actual
        </p>
        {matchingTrials.length === 0 ? (
          <p
            style={{
              fontFamily: FD,
              fontStyle: "italic",
              fontSize: 14,
              color: MUTED,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            You haven't clicked on this exact D = {D} px, W = {W} px combo yet. Go back to Panel 02
            and try a few. The "actual vs predicted" comparison will show up here automatically.
          </p>
        ) : (
          <>
            <p
              style={{
                fontFamily: FM,
                fontSize: 13,
                color: INK,
                margin: "0 0 6px",
                lineHeight: 1.6,
              }}
            >
              On this D and W, you clicked{" "}
              <span style={{ color: RED, fontWeight: 600 }}>
                {matchingTrials.length} times
              </span>
              , measured average{" "}
              <span style={{ color: RED, fontWeight: 700 }}>{userAvg} ms</span>
            </p>
            <p
              style={{
                fontFamily: FM,
                fontSize: 13,
                color: INK,
                margin: "0 0 6px",
                lineHeight: 1.6,
              }}
            >
              Formula predicts{" "}
              <span style={{ color: TEAL, fontWeight: 700 }}>
                {predictedMT} ms
              </span>
              , off by{" "}
              <span style={{ fontWeight: 600 }}>
                {diff} ms ({diffPct}%)
              </span>
            </p>
            <p
              style={{
                fontFamily: FD,
                fontStyle: "italic",
                fontSize: 13,
                color: MUTED,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {diff <= 60
                ? "The formula lines up nicely with your measurements. Fitts holds for you."
                : diff <= 150
                ? "Off by a few dozen ms, not much. Fitts predicts averages, not single clicks."
                : "Off by quite a bit. Maybe this device's a and b don't quite match yours, or your clicking style is different."}
            </p>
          </>
        )}
      </div>

      <p
        style={{
          fontFamily: FD,
          fontStyle: "italic",
          fontSize: 15,
          color: INK,
          margin: "20px 0 0",
          lineHeight: 1.55,
        }}
      >
        The formula can predict one button click. But a "button" isn't always a circle. Real UIs have squares, rectangles, menus. Time to reconsider what W really means.
      </p>
    </Panel>
  );
}

// =========================================================
// Panel 3 (NEW), Pre-formula data view: MT vs D/W ratio.
// Reveals the concave (log-shaped) curve to motivate the log₂ in Fitts' formula.
// =========================================================

function Panel3({ trials, a, b }) {
  const wrapperRef = useRef(null);
  const [containerW, setContainerW] = useState(700);
  const [showCurve, setShowCurve] = useState(false);
  const [curveProgress, setCurveProgress] = useState(0);

  // Reset the reveal when trials are cleared
  useEffect(() => {
    if (trials.length === 0) {
      setShowCurve(false);
      setCurveProgress(0);
    }
  }, [trials.length]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setContainerW(e.contentRect.width);
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  // Animate the curve drawing in
  useEffect(() => {
    if (!showCurve) {
      setCurveProgress(0);
      return;
    }
    const start = performance.now();
    const duration = 900;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setCurveProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [showCurve]);

  const height = 340;
  const padL = 60;
  const padR = 28;
  const padT = 24;
  const padB = 54;
  const plotW = Math.max(120, containerW - padL - padR);
  const plotH = height - padT - padB;

  // Axis ranges (linear axes, no log!)
  const dws = trials.map((t) => t.D / t.W);
  const dwMaxRaw = dws.length > 0 ? Math.max(...dws) : 8;
  const dwMax = Math.max(8, dwMaxRaw) * 1.1;
  const dwMin = 0;

  const mtValues = trials.map((t) => t.MT);
  const predictedAtMax = a + b * Math.log2(dwMax + 1);
  const mtMaxRaw = Math.max(
    1000,
    ...(mtValues.length > 0 ? mtValues : [0]),
    predictedAtMax
  );
  const mtMax = mtMaxRaw * 1.05;
  const mtMin = 0;

  const xOf = (dw) => padL + ((dw - dwMin) / (dwMax - dwMin)) * plotW;
  const yOf = (mt) => padT + plotH - ((mt - mtMin) / (mtMax - mtMin)) * plotH;

  // Curve points
  const fullCurvePts = [];
  const nPts = 80;
  for (let i = 0; i <= nPts; i++) {
    const dw = dwMin + (dwMax - dwMin) * (i / nPts);
    const mt = a + b * Math.log2(dw + 1);
    fullCurvePts.push([xOf(dw), yOf(mt)]);
  }
  const cutoff = Math.floor(curveProgress * nPts);
  const visibleCurvePts = fullCurvePts.slice(0, cutoff + 1);

  // Axis ticks
  const xTickStep = dwMax > 24 ? 8 : dwMax > 12 ? 4 : 2;
  const xTicks = [];
  for (let v = 0; v <= dwMax; v += xTickStep) xTicks.push(v);

  const yTickStep = mtMax > 1500 ? 500 : mtMax > 800 ? 200 : 100;
  const yTicks = [];
  for (let v = 0; v <= mtMax; v += yTickStep) yTicks.push(v);

  return (
    <Panel
      number="03 · Look at the data"
      caption="You clicked a bunch, so let's plot it. The x-axis is the D/W ratio (farther and smaller targets make this larger, intuitively harder), the y-axis is how long you took. Stare for a moment and see if anything jumps out."
    >
      <div
        ref={wrapperRef}
        style={{
          position: "relative",
          height: `${height}px`,
          background: PANEL_DEEP,
          border: `1px solid ${RULE}`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <svg width="100%" height={height}>
          {/* Y-axis gridlines + ticks */}
          {yTicks.map((v) => (
            <g key={`y-${v}`}>
              <line
                x1={padL}
                y1={yOf(v)}
                x2={padL + plotW}
                y2={yOf(v)}
                stroke={RULE}
                strokeWidth="0.5"
                strokeDasharray="2 4"
              />
              <text
                x={padL - 10}
                y={yOf(v) + 4}
                textAnchor="end"
                fontFamily={FM}
                fontSize="10"
                fill={MUTED}
              >
                {v}
              </text>
            </g>
          ))}

          {/* X-axis ticks */}
          {xTicks.map((v) => (
            <g key={`x-${v}`}>
              <line
                x1={xOf(v)}
                y1={padT + plotH}
                x2={xOf(v)}
                y2={padT + plotH + 4}
                stroke={MUTED}
                strokeWidth="1"
              />
              <text
                x={xOf(v)}
                y={padT + plotH + 18}
                textAnchor="middle"
                fontFamily={FM}
                fontSize="10"
                fill={MUTED}
              >
                {v}
              </text>
            </g>
          ))}

          {/* Axes */}
          <line
            x1={padL}
            y1={padT}
            x2={padL}
            y2={padT + plotH}
            stroke={INK}
            strokeWidth="1"
          />
          <line
            x1={padL}
            y1={padT + plotH}
            x2={padL + plotW}
            y2={padT + plotH}
            stroke={INK}
            strokeWidth="1"
          />

          {/* Axis labels */}
          <text
            x={padL + plotW / 2}
            y={height - 14}
            textAnchor="middle"
            fontFamily={FM}
            fontSize="12"
            fill={INK}
          >
            D / W (distance ÷ width)
          </text>
          <text
            x={18}
            y={padT + plotH / 2}
            textAnchor="middle"
            fontFamily={FM}
            fontSize="12"
            fill={INK}
            transform={`rotate(-90, 18, ${padT + plotH / 2})`}
          >
            MT (ms)
          </text>

          {/* Reference curve (revealed) */}
          {showCurve && trials.length > 0 && visibleCurvePts.length > 1 && (
            <>
              <polyline
                points={visibleCurvePts
                  .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
                  .join(" ")}
                fill="none"
                stroke={RED}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {curveProgress >= 0.95 && (
                <text
                  x={xOf(dwMax) - 8}
                  y={yOf(a + b * Math.log2(dwMax + 1)) - 10}
                  textAnchor="end"
                  fontFamily={FD}
                  fontStyle="italic"
                  fontSize="13"
                  fill={RED}
                >
                  Look, it curves
                </text>
              )}
            </>
          )}

          {/* Data points */}
          {trials.map((t, i) => (
            <circle
              key={i}
              cx={xOf(t.D / t.W)}
              cy={yOf(t.MT)}
              r="4.5"
              fill={INK}
              fillOpacity="0.55"
              stroke={INK}
              strokeOpacity="0.85"
              strokeWidth="0.5"
            />
          ))}
        </svg>

        {trials.length === 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FD,
              fontStyle: "italic",
              fontSize: 15,
              color: MUTED,
              pointerEvents: "none",
              textAlign: "center",
              padding: "0 24px",
            }}
          >
            No data yet. Go back to the last panel, click a few times, then come back.
          </div>
        )}
      </div>

      {/* Stage controls */}
      <div
        style={{
          marginTop: 18,
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          alignItems: "center",
        }}
      >
        {!showCurve && (
          <>
            <button
              className="comic-button primary"
              onClick={() => setShowCurve(true)}
              disabled={trials.length < 3}
              style={{ opacity: trials.length < 3 ? 0.4 : 1 }}
            >
              {trials.length < 3
                ? `${3 - trials.length} more click${3 - trials.length === 1 ? "" : "s"} to go`
                : "Draw a reference line"}
            </button>
            <p
              style={{
                fontFamily: FD,
                fontStyle: "italic",
                fontSize: 15,
                color: MUTED,
                margin: 0,
                lineHeight: 1.5,
                maxWidth: "44ch",
              }}
            >
              Your dots are scattered out there. What shape are they making? A straight line? Or a curve?
            </p>
          </>
        )}
        {showCurve && (
          <p
            style={{
              fontFamily: FD,
              fontStyle: "italic",
              fontSize: 16,
              color: INK,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Look at this curve: it's <span style={{ color: RED, fontWeight: 600 }}>not a straight line</span>.
          </p>
        )}
      </div>

      {/* The "twist", pedagogical reveal text */}
      {showCurve && (
        <div
          style={{
            marginTop: 18,
            padding: "16px 20px",
            background: PAPER,
            border: `1px solid ${RULE}`,
            borderRadius: 2,
          }}
        >
          <p
            style={{
              fontFamily: FB,
              fontSize: 14,
              color: INK,
              margin: "0 0 12px",
              lineHeight: 1.7,
            }}
          >
            Did you notice while clicking:
            <span style={{ color: RED, fontWeight: 500 }}>
              {" "}
              once D is already far, pulling it farther barely slows you down; once W is already small, shrinking it further barely slows you down either
            </span>
            . Look at the right half of the curve: it flattens out.
          </p>
          <p
            style={{
              fontFamily: FB,
              fontSize: 14,
              color: INK,
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            This is
            <span style={{ color: TEAL, fontWeight: 600 }}>
              {" "}
              diminishing returns
            </span>
            . The classic mathematical tool for describing this "fast then flat" relationship is
            <span style={{ fontFamily: FM, color: TEAL, fontWeight: 600 }}>
              {" "}
              log
            </span>
            .
          </p>
        </div>
      )}

      {/* Closing italic, removed (redundant with reveal box above) */}
    </Panel>
  );
}

// =========================================================
// Panel 6, Scatter + user regression, then lab reference comparison
// =========================================================

function Panel6({ trials, a, b, inputLabel, clearTrials }) {
  const wrapperRef = useRef(null);
  const [w, setW] = useState(760);
  const [mode, setMode] = useState("dw"); // "dw" (continue Panel 03's view) or "id" (linearized)
  const [stage, setStage] = useState(0); // ID-mode reveal: 0=points, 1=+regression, 2=+lab reference
  const [userFitProgress, setUserFitProgress] = useState(0);
  const [labProgress, setLabProgress] = useState(0);

  // Axis-morph animation: 0 = D/W coords, 1 = ID coords. Animates on mode change.
  const [morphT, setMorphT] = useState(0);
  const morphTRef = useRef(0);
  useEffect(() => {
    morphTRef.current = morphT;
  });

  useEffect(() => {
    const start = morphTRef.current;
    const target = mode === "id" ? 1 : 0;
    if (Math.abs(start - target) < 0.001) return;
    const startTime = performance.now();
    const duration = 700;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const next = start + (target - start) * eased;
      setMorphT(next);
      morphTRef.current = next;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(e.contentRect.width);
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  // animate user-fit line when revealing it in ID mode
  useEffect(() => {
    if (mode !== "id" || stage < 1) {
      setUserFitProgress(0);
      return;
    }
    const start = performance.now();
    const duration = 900;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setUserFitProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, stage]);

  // animate lab reference line when revealing it in ID mode
  useEffect(() => {
    if (mode !== "id" || stage < 2) {
      setLabProgress(0);
      return;
    }
    const start = performance.now();
    const duration = 900;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setLabProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, stage]);

  // reset everything when trials are cleared
  useEffect(() => {
    if (trials.length === 0) {
      setMode("dw");
      setStage(0);
      setMorphT(0);
      morphTRef.current = 0;
    }
  }, [trials.length]);

  // gating for regression reveal
  const distinctConfigs = useMemo(() => {
    const set = new Set();
    trials.forEach((t) => set.add(`${Math.round(t.D)}-${t.W}`));
    return set.size;
  }, [trials]);
  const userFit = useMemo(() => linearFit(trials), [trials]);
  const canRevealUserFit =
    userFit !== null && trials.length >= 5 && distinctConfigs >= 2;

  // Dynamic interpretation of user's a/b vs lab's a/b, appears at stage 2 in ID mode
  const interpretation = useMemo(() => {
    if (mode !== "id" || stage < 2 || !userFit) return null;
    const slopeDiff = userFit.b - b;
    const intDiff = userFit.a - a;
    const slopeMore = slopeDiff > 12;
    const slopeLess = slopeDiff < -12;
    const intMore = intDiff > 20;
    const intLess = intDiff < -20;
    let msg = "";
    if (slopeMore)
      msg += `Your b is ${Math.round(slopeDiff)} ms/bit higher than average, so difficulty drags you down more (maybe you're not used to this device yet).`;
    else if (slopeLess)
      msg += `Your b is ${Math.abs(Math.round(slopeDiff))} ms/bit lower than average, so difficulty drags you down less.`;
    else msg += `Your b is very close to average, so your difficulty sensitivity is about the same.`;
    if (intMore)
      msg += ` But a is ${Math.round(intDiff)} ms higher than average, so you're slower to start.`;
    else if (intLess)
      msg += ` And a is ${Math.abs(Math.round(intDiff))} ms lower than average, so you're faster to start.`;
    else msg += ` a is also close to average.`;
    return msg;
  }, [mode, stage, userFit, a, b]);

  const h = 320;
  const m = { top: 24, right: 22, bottom: 44, left: 56 };
  const iw = Math.max(120, w - m.left - m.right);
  const ih = h - m.top - m.bottom;

  // Two coordinate systems share the same pixel range [m.left, m.left+iw].
  // D/W axis spans 0..36 ; ID axis spans 0..6.
  // Key geometric coincidence: xOfDW(k·6) == xOfID(k) for k=0..6, so the
  // 7 gridline positions stay fixed across modes; only labels need crossfade.
  const dwMax = 36;
  const idMax = 6;
  const mtMax = 1500;

  const xOfDW = (dw) =>
    m.left + (Math.max(0, Math.min(dwMax, dw)) / dwMax) * iw;
  const xOfID = (id) =>
    m.left + (Math.max(0, Math.min(idMax, id)) / idMax) * iw;
  // For a given underlying D/W value, return the screen x interpolated between
  // its position in D/W coords and its position in ID coords (= log₂(D/W+1)).
  const xOfMorph = (dw) => {
    const x0 = xOfDW(dw);
    const x1 = xOfID(Math.log2(dw + 1));
    return x0 + (x1 - x0) * morphT;
  };
  const yOf = (mt) =>
    m.top + (1 - Math.max(0, Math.min(mtMax, mt)) / mtMax) * ih;

  // Gridline x-positions (shared between modes): 7 evenly spaced ticks.
  // DW labels [0,6,12,18,24,30,36] and ID labels [0,1,2,3,4,5,6] sit on the
  // same pixels but show different text, crossfade by morphT.
  const gridPositions = [0, 1, 2, 3, 4, 5, 6].map((k) => ({
    x: m.left + (k / 6) * iw,
    dwLabel: String(k * 6),
    idLabel: String(k),
  }));
  const yTicks = [0, 300, 600, 900, 1200, 1500];

  const trialDW = (t) => t.D / t.W;

  // Fitts curve/line path, parameterized by underlying D/W, x morphed by morphT.
  // In D/W coords this is a curve a + b·log₂(x+1); in ID coords it's straight a + b·ID.
  // We sample the same mathematical function in both, only the x mapping changes.
  const fittsPath = useMemo(() => {
    const N = 100;
    let d = "";
    for (let i = 0; i <= N; i++) {
      const dw = (i / N) * dwMax;
      const mt = a + b * Math.log2(dw + 1);
      d += (i === 0 ? "M " : "L ") + xOfMorph(dw) + " " + yOf(mt) + " ";
    }
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [morphT, w, a, b]);

  // User-regression line endpoints, only in ID mode, so use xOfID (and these
  // pixel positions equal xOfDW(0) and xOfDW(36)≈xOfDW(63), i.e. they don't
  // need morphing, endpoints sit at left and right edges in both coord systems).
  const ufX1 = xOfID(0);
  const ufY1 = userFit ? yOf(userFit.a) : 0;
  const ufX2 = xOfID(6);
  const ufY2 = userFit ? yOf(userFit.a + userFit.b * 6) : 0;

  // Lab reference line endpoints (only used in ID mode)
  const labX1 = xOfID(0);
  const labY1 = yOf(a);
  const labX2 = xOfID(6);
  const labY2 = yOf(a + b * 6);

  const points = useMemo(
    () =>
      trials.map((t, i) => ({
        x: xOfMorph(trialDW(t)),
        y: yOf(t.MT),
        src: t.src,
        i,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trials, w, morphT]
  );

  // Caption adapts to mode + stage
  const caption =
    mode === "dw"
      ? "This is the curve drawn from Panel 04's formula: the lab's Fitts prediction for the current device, alongside your data. Switch to the ID axis to see how time relates to the difficulty index (ID)."
      : stage === 0
      ? "Now you can fit a line."
      : stage === 1
      ? "That red line is fit from your data, giving you your own a and b. Overlay the HCI literature's average for " +
        inputLabel +
        " (also an a and b pair) and see how well they match."
      : "Your red line vs the lab's teal dashed line. The difference comes down to those two numbers, a and b. Below: how much they actually differ.";

  return (
    <Panel
      number="05 · Find the difficulty"
      eyebrow="log straightens the curve"
      caption={caption}
      accent="teal"
    >
      {/* Axis toggle, the central action of this panel */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: FM,
            fontSize: 11,
            color: MUTED,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
          x-axis:
        </span>
        <ToggleTab
          active={mode === "dw"}
          onClick={() => setMode("dw")}
          label="D / W (linear, curved)"
        />
        <ToggleTab
          active={mode === "id"}
          onClick={() => setMode("id")}
          label="ID = log₂(D/W + 1)  (straight)"
        />
      </div>

      <div ref={wrapperRef} style={{ width: "100%" }}>
        <svg width={w} height={h} role="img" aria-label="Scatter plot of data with regression line">
          {/* y-grid */}
          {yTicks.map((t) => (
            <g key={`y-${t}`}>
              <line
                x1={m.left}
                x2={m.left + iw}
                y1={yOf(t)}
                y2={yOf(t)}
                stroke={RULE}
                strokeDasharray={t === 0 ? "" : "2 3"}
              />
              <text
                x={m.left - 8}
                y={yOf(t) + 4}
                textAnchor="end"
                fontFamily={FM}
                fontSize="10"
                fill={MUTED}
              >
                {t}
              </text>
            </g>
          ))}
          {/* x-grid, fixed pixel positions, DW & ID labels crossfade by morphT */}
          {gridPositions.map((g, idx) => (
            <g key={`x-${idx}`}>
              <line
                x1={g.x}
                x2={g.x}
                y1={m.top}
                y2={m.top + ih}
                stroke={RULE}
                strokeDasharray={idx === 0 ? "" : "2 3"}
              />
              <text
                x={g.x}
                y={m.top + ih + 16}
                textAnchor="middle"
                fontFamily={FM}
                fontSize="10"
                fill={MUTED}
                opacity={1 - morphT}
              >
                {g.dwLabel}
              </text>
              <text
                x={g.x}
                y={m.top + ih + 16}
                textAnchor="middle"
                fontFamily={FM}
                fontSize="10"
                fill={MUTED}
                opacity={morphT}
              >
                {g.idLabel}
              </text>
            </g>
          ))}
          {/* axis labels, crossfade between DW and ID descriptions */}
          <text
            x={m.left + iw / 2}
            y={h - 8}
            textAnchor="middle"
            fontFamily={FM}
            fontSize="11"
            fill={INK}
            letterSpacing="0.08em"
            opacity={1 - morphT}
          >
            D / W (distance ÷ width, linear axis)
          </text>
          <text
            x={m.left + iw / 2}
            y={h - 8}
            textAnchor="middle"
            fontFamily={FM}
            fontSize="11"
            fill={INK}
            letterSpacing="0.08em"
            opacity={morphT}
          >
            Index of difficulty ID = log₂(D/W + 1) · bits
          </text>
          <text
            x={-(m.top + ih / 2)}
            y={14}
            transform={`rotate(-90)`}
            textAnchor="middle"
            fontFamily={FM}
            fontSize="11"
            fill={INK}
            letterSpacing="0.08em"
          >
            Movement time MT · ms
          </text>

          {/* Lab Fitts prediction, curve in DW, morphs to line in ID.
              Always rendered when trials exist; opacity fades to 0 as the
              user's own regression line takes over in ID stage 1+. */}
          {trials.length > 0 && (
            <>
              <path
                d={fittsPath}
                fill="none"
                stroke={RED}
                strokeWidth="2.5"
                strokeOpacity={
                  mode === "id" && stage >= 1
                    ? 0.8 * (1 - userFitProgress)
                    : 0.8
                }
                strokeLinecap="round"
              />
              <text
                x={xOfMorph(36) - 8}
                y={yOf(a + b * Math.log2(37)) - 10}
                textAnchor="end"
                fontFamily={FD}
                fontStyle="italic"
                fontSize="13"
                fill={RED}
                opacity={
                  mode === "id" && stage >= 1 ? 1 - userFitProgress : 1
                }
              >
                Fitts prediction for {inputLabel}
              </text>
            </>
          )}

          {/* ID mode + stage 1+: user regression, red solid */}
          {mode === "id" && stage >= 1 && userFit && (
            <>
              <line
                x1={ufX1}
                y1={ufY1}
                x2={ufX1 + (ufX2 - ufX1) * userFitProgress}
                y2={ufY1 + (ufY2 - ufY1) * userFitProgress}
                stroke={RED}
                strokeWidth="2.5"
                strokeOpacity={0.85}
              />
              {userFitProgress > 0.75 && (
                <text
                  x={ufX2 - 8}
                  y={ufY2 - 8}
                  textAnchor="end"
                  fontFamily={FD}
                  fontSize="13"
                  fontStyle="italic"
                  fill={RED}
                  opacity={(userFitProgress - 0.75) / 0.25}
                >
                  Your regression line
                </text>
              )}
            </>
          )}

          {/* ID mode + stage 2+: lab reference, teal dashed */}
          {mode === "id" && stage >= 2 && (
            <>
              <line
                x1={labX1}
                y1={labY1}
                x2={labX1 + (labX2 - labX1) * labProgress}
                y2={labY1 + (labY2 - labY1) * labProgress}
                stroke={TEAL}
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              {labProgress > 0.75 && (
                <text
                  x={labX2 - 8}
                  y={labY2 + 18}
                  textAnchor="end"
                  fontFamily={FD}
                  fontSize="13"
                  fontStyle="italic"
                  fill={TEAL}
                  opacity={(labProgress - 0.75) / 0.25}
                >
                  Lab average ({inputLabel})
                </text>
              )}
            </>
          )}

          {/* user trial points */}
          {points.map((p) => (
            <circle
              key={p.i}
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill={RED}
              fillOpacity={0.4}
            />
          ))}

          {/* empty state */}
          {points.length === 0 && (
            <text
              x={m.left + iw / 2}
              y={m.top + ih / 2}
              textAnchor="middle"
              fontFamily={FD}
              fontStyle="italic"
              fontSize="14"
              fill={MUTED}
            >
              Go back to Panel 02 and click a few. This will fill in
            </text>
          )}
        </svg>
      </div>

      {/* mini legend */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "12px",
          flexWrap: "wrap",
          fontSize: "12px",
          fontFamily: FM,
          color: MUTED,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: RED,
              opacity: 0.4,
            }}
          />
          Your clicks · {trials.length}
        </span>
        {trials.length > 0 && !(mode === "id" && stage >= 1) && (
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "18px",
                height: "2.5px",
                background: RED,
              }}
            />
            Fitts prediction {morphT > 0.5 ? "line" : "curve"}
          </span>
        )}
        {mode === "id" && stage >= 1 && userFit && (
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "18px",
                height: "2.5px",
                background: RED,
              }}
            />
            Your regression line
          </span>
        )}
        {mode === "id" && stage >= 2 && (
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "18px",
                height: "2px",
                borderTop: `2px dashed ${TEAL}`,
              }}
            />
            Lab average
          </span>
        )}
      </div>

      {/* Stage controls */}
      <div
        style={{
          marginTop: "22px",
          display: "flex",
          flexWrap: "wrap",
          gap: "14px",
          alignItems: "center",
        }}
      >
        {mode === "dw" && trials.length > 0 && (
          <p
            style={{
              fontFamily: FD,
              fontStyle: "italic",
              fontSize: "15px",
              color: MUTED,
              margin: 0,
              lineHeight: 1.5,
              maxWidth: "44ch",
            }}
          >
            That toggle above? Flip it to the ID axis and see what happens.
          </p>
        )}
        {mode === "id" && stage === 0 && (
          <>
            <button
              className="comic-button primary"
              onClick={() => setStage(1)}
              disabled={!canRevealUserFit}
              style={{ opacity: canRevealUserFit ? 1 : 0.4 }}
            >
              {canRevealUserFit
                ? "Fit your regression line"
                : `${Math.max(0, 5 - trials.length)} more clicks / ${Math.max(0, 2 - distinctConfigs)} more setups to go`}
            </button>
            <p
              style={{
                fontFamily: FD,
                fontStyle: "italic",
                fontSize: "15px",
                color: MUTED,
                margin: 0,
                lineHeight: 1.5,
                maxWidth: "44ch",
              }}
            >
              It's straight now, so you can draw the best-fit line through your points.
            </p>
          </>
        )}
        {mode === "id" && stage === 1 && (
          <>
            <button
              className="comic-button primary"
              onClick={() => setStage(2)}
            >
              Overlay the lab reference
            </button>
            <p
              style={{
                fontFamily: FD,
                fontStyle: "italic",
                fontSize: "15px",
                color: MUTED,
                margin: 0,
                lineHeight: 1.5,
                maxWidth: "44ch",
              }}
            >
              Next: put your red line next to the lab average and see how well they line up.
            </p>
          </>
        )}
        {mode === "id" && stage === 2 && (
          <p
            style={{
              fontFamily: FD,
              fontStyle: "italic",
              fontSize: "16px",
              color: INK,
              margin: 0,
              lineHeight: 1.55,
              maxWidth: "60ch",
            }}
          >
            <span style={{ color: TEAL, fontWeight: 600 }}>How they differ:</span>{" "}
            {interpretation || "Not enough data to see a clear difference. Click more or try more setups."}{" "}
            Next, in Panel 06, we use this formula to make a prediction and see how accurate it is.
          </p>
        )}

        {/* Clear-and-restart button, pushed right */}
        {trials.length > 0 && (
          <button
            className="comic-button"
            onClick={clearTrials}
            style={{ marginLeft: "auto" }}
            title="Clear all the data you just clicked and start over"
          >
            Clear data, start over
          </button>
        )}
      </div>
    </Panel>
  );
}


function ToggleTab({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: FM,
        fontSize: "11px",
        letterSpacing: "0.08em",
        padding: "8px 14px",
        background: active ? TEAL : "transparent",
        color: active ? PAPER : INK,
        border: `1px solid ${active ? TEAL : INK + "66"}`,
        cursor: "pointer",
        transition:
          "background 0.18s, color 0.18s, border-color 0.18s",
        fontWeight: 500,
      }}
    >
      {label}
    </button>
  );
}

// =========================================================
// Panel 8, Circle vs rectangle: W depends on approach direction (or doesn't)
// =========================================================

function Panel8({ a, b }) {
  const wrapperRef = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(680);
  const canvasHeight = 280;

  // Two buttons, side by side
  const circleRadius = 35;
  const circleDiameter = circleRadius * 2;
  const rectW = 120;
  const rectH = 36;

  // Cursor in absolute canvas coordinates
  const [cursor, setCursor] = useState({ x: 510, y: 30 });

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setCanvasWidth(e.contentRect.width);
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  const circleCx = canvasWidth / 4;
  const circleCy = canvasHeight / 2;
  const rectCx = (canvasWidth * 3) / 4;
  const rectCy = canvasHeight / 2;

  const handlePointer = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // -------- circle approach geometry --------
  const cdx = circleCx - cursor.x;
  const cdy = circleCy - cursor.y;
  const D_circle = Math.sqrt(cdx ** 2 + cdy ** 2);
  const cosC = D_circle > 0.5 ? cdx / D_circle : 1;
  const sinC = D_circle > 0.5 ? cdy / D_circle : 0;
  const angleDeg_circle = (Math.atan2(sinC, cosC) * 180) / Math.PI;
  const insideCircle = D_circle < circleRadius;
  // For a circle: any chord through the center has length = diameter
  const W_circle = circleDiameter;
  const id_circle = W_circle > 0 ? Math.log2(D_circle / W_circle + 1) : 0;
  const predMT_circle = a + b * id_circle;

  // -------- rectangle approach geometry --------
  const rdx = rectCx - cursor.x;
  const rdy = rectCy - cursor.y;
  const D_rect = Math.sqrt(rdx ** 2 + rdy ** 2);
  const cosR = D_rect > 0.5 ? rdx / D_rect : 1;
  const sinR = D_rect > 0.5 ? rdy / D_rect : 0;
  const angleDeg_rect = (Math.atan2(sinR, cosR) * 180) / Math.PI;
  const aCosR = Math.max(Math.abs(cosR), 1e-6);
  const aSinR = Math.max(Math.abs(sinR), 1e-6);
  const W_rect = 2 * Math.min((rectW / 2) / aCosR, (rectH / 2) / aSinR);
  const insideRect =
    Math.abs(cursor.x - rectCx) <= rectW / 2 &&
    Math.abs(cursor.y - rectCy) <= rectH / 2;
  const id_rect = W_rect > 0 ? Math.log2(D_rect / W_rect + 1) : 0;
  const predMT_rect = a + b * id_rect;

  return (
    <Panel
      number="07 · Circle vs square"
      eyebrow="The real face of W"
      caption="Two buttons that look equivalent: one circle, one rectangle. Move your cursor around them and watch what happens to the red slice bars."
      accent="teal"
    >
      <div
        ref={wrapperRef}
        style={{
          position: "relative",
          height: `${canvasHeight}px`,
          background: PANEL_DEEP,
          border: `1px solid ${RULE}`,
          borderRadius: 2,
          overflow: "hidden",
          cursor: "crosshair",
          userSelect: "none",
          touchAction: "none",
        }}
        onPointerMove={handlePointer}
        onPointerDown={handlePointer}
      >
        <svg
          width="100%"
          height={canvasHeight}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {/* Approach lines */}
          {!insideCircle && (
            <line
              x1={cursor.x}
              y1={cursor.y}
              x2={circleCx}
              y2={circleCy}
              stroke={MUTED}
              strokeWidth="1"
              strokeDasharray="4 3"
            />
          )}
          {!insideRect && (
            <line
              x1={cursor.x}
              y1={cursor.y}
              x2={rectCx}
              y2={rectCy}
              stroke={MUTED}
              strokeWidth="1"
              strokeDasharray="4 3"
            />
          )}

          {/* Circle button */}
          <circle
            cx={circleCx}
            cy={circleCy}
            r={circleRadius}
            fill={PAPER}
            stroke={INK}
            strokeWidth="1"
          />

          {/* Rectangle button */}
          <rect
            x={rectCx - rectW / 2}
            y={rectCy - rectH / 2}
            width={rectW}
            height={rectH}
            fill={PAPER}
            stroke={INK}
            strokeWidth="1"
            rx="2"
          />

          {/* Circle's effective W chord (always = diameter, rotated to approach) */}
          {!insideCircle && (
            <rect
              x={circleCx - W_circle / 2}
              y={circleCy - 5}
              width={W_circle}
              height={10}
              fill={RED}
              fillOpacity={0.35}
              stroke={RED}
              strokeWidth="1.5"
              strokeOpacity={0.85}
              transform={`rotate(${angleDeg_circle}, ${circleCx}, ${circleCy})`}
            />
          )}

          {/* Rectangle's effective W chord (varies with approach angle) */}
          {!insideRect && (
            <rect
              x={rectCx - W_rect / 2}
              y={rectCy - 5}
              width={W_rect}
              height={10}
              fill={RED}
              fillOpacity={0.35}
              stroke={RED}
              strokeWidth="1.5"
              strokeOpacity={0.85}
              transform={`rotate(${angleDeg_rect}, ${rectCx}, ${rectCy})`}
            />
          )}

          {/* Button labels */}
          <text
            x={circleCx}
            y={circleCy + 4}
            textAnchor="middle"
            fontFamily={FB}
            fontSize="11"
            fill={INK}
            fontWeight="500"
          >
            button
          </text>
          <text
            x={rectCx}
            y={rectCy + 4}
            textAnchor="middle"
            fontFamily={FB}
            fontSize="11"
            fill={INK}
            fontWeight="500"
          >
            button
          </text>

          {/* Center dots (subtle visual anchors) */}
          {!insideCircle && (
            <circle
              cx={circleCx}
              cy={circleCy}
              r="2"
              fill={INK}
              fillOpacity="0.55"
            />
          )}
          {!insideRect && (
            <circle
              cx={rectCx}
              cy={rectCy}
              r="2"
              fill={INK}
              fillOpacity="0.55"
            />
          )}

          {/* Cursor indicator */}
          <g>
            <circle cx={cursor.x} cy={cursor.y} r="4.5" fill={INK} />
            <circle
              cx={cursor.x}
              cy={cursor.y}
              r="10"
              fill="none"
              stroke={INK}
              strokeOpacity="0.22"
              strokeWidth="1.5"
            />
          </g>
        </svg>

        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 12,
            fontFamily: FM,
            fontSize: 11,
            color: MUTED,
            letterSpacing: "0.05em",
            pointerEvents: "none",
            textTransform: "uppercase",
          }}
        >
          Move the cursor · compare the two red slice bars
        </div>
      </div>

      {/* Stats: 2 × 2 grid, circle on left, rect on right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginTop: 18,
        }}
      >
        <div
          style={{
            padding: "12px 14px",
            background: PAPER,
            border: `1px solid ${RULE}`,
            borderRadius: 2,
          }}
        >
          <p
            style={{
              fontFamily: FM,
              fontSize: 10,
              color: MUTED,
              margin: "0 0 8px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            ⊙ Circle
          </p>
          <p
            style={{
              fontFamily: FM,
              fontSize: 13,
              color: INK,
              margin: 0,
            }}
          >
            Effective W ={" "}
            <span style={{ color: RED, fontWeight: 600 }}>
              {Math.round(W_circle)} px
            </span>{" "}
            <span style={{ color: MUTED, fontSize: 11, fontStyle: "italic" }}>
              (always = diameter)
            </span>
          </p>
        </div>
        <div
          style={{
            padding: "12px 14px",
            background: PAPER,
            border: `1px solid ${RULE}`,
            borderRadius: 2,
          }}
        >
          <p
            style={{
              fontFamily: FM,
              fontSize: 10,
              color: MUTED,
              margin: "0 0 8px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            ▭ Rectangle
          </p>
          <p
            style={{
              fontFamily: FM,
              fontSize: 13,
              color: INK,
              margin: 0,
            }}
          >
            Effective W ={" "}
            <span style={{ color: RED, fontWeight: 600 }}>
              {insideRect ? "·" : `${Math.round(W_rect)} px`}
            </span>{" "}
            <span style={{ color: MUTED, fontSize: 11, fontStyle: "italic" }}>
              (varies with direction · {rectH}–{Math.round(Math.sqrt(rectW * rectW + rectH * rectH))})
            </span>
          </p>
        </div>
      </div>

      <p
        style={{
          fontFamily: FB,
          fontSize: 13,
          color: MUTED,
          margin: "20px 0 0",
          lineHeight: 1.6,
        }}
      >
        MacKenzie & Buxton 1992 formally extended the originally 1D Fitts formula to 2D, and the core idea is redefining W as "the slice length along the approach direction." A circle is the simplest case under this rule: the slice is always the diameter, so W is constant. Next time you're designing a UI, ask: which direction will users approach this target from? And is the target's shape friendly to that direction?
      </p>
    </Panel>
  );
}

// =========================================================
// Panel 9, Application: form fill with vertical/horizontal layout comparison
//   Vertical layout: submit's W along approach = its height (varies with slider)
//   Horizontal layout: submit's W along approach = its width (constant)
//   → The same slider changes MT dramatically in vertical, not at all in horizontal.
// =========================================================

function MiniScatter({ trials, a, b, D_v, D_h, btnW, wMin, wMax }) {
  const wrapperRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(640);
  const [showPredictions, setShowPredictions] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setContainerWidth(e.contentRect.width);
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  // When the data is cleared (e.g. from the bottom "Clear all data" button),
  // re-hide the predictions so the chart returns to its initial "guess first"
  // state instead of leaving dashed lines floating on an empty plot.
  useEffect(() => {
    if (trials.length === 0) setShowPredictions(false);
  }, [trials.length]);

  const h = 160;
  const m = { top: 14, right: 16, bottom: 32, left: 48 };
  const iw = containerWidth - m.left - m.right;
  const ih = h - m.top - m.bottom;
  const mtMax = 900;

  const xOf = (w) => m.left + ((w - wMin) / (wMax - wMin)) * iw;
  const yOf = (mt) =>
    m.top + (1 - Math.min(1, Math.max(0, mt / mtMax))) * ih;

  // vertical layout predicted curve, W varies with slider
  const vCurvePath = (() => {
    const N = 60;
    let d = "";
    for (let i = 0; i <= N; i++) {
      const w = wMin + (i / N) * (wMax - wMin);
      const mt = a + b * Math.log2(D_v / w + 1);
      d += (i === 0 ? "M " : "L ") + xOf(w) + " " + yOf(mt) + " ";
    }
    return d;
  })();

  // horizontal layout predicted: flat line at constant MT
  const hMT = a + b * Math.log2(D_h / btnW + 1);
  const hY = yOf(hMT);

  return (
    <div ref={wrapperRef} style={{ width: "100%", marginTop: 18 }}>
      <svg
        width={containerWidth}
        height={h}
        role="img"
        aria-label="Comparison of how Submit height affects movement time under vertical and horizontal layouts"
      >
        {[0, 250, 500, 750].map((t) => (
          <g key={`y-${t}`}>
            <line
              x1={m.left}
              y1={yOf(t)}
              x2={m.left + iw}
              y2={yOf(t)}
              stroke={RULE}
              strokeDasharray="2 3"
              opacity="0.5"
            />
            <text
              x={m.left - 6}
              y={yOf(t) + 3}
              textAnchor="end"
              fontFamily={FM}
              fontSize="9"
              fill={MUTED}
            >
              {t}
            </text>
          </g>
        ))}
        {[24, 30, 40, 50, 60, 70].map((t) => (
          <g key={`x-${t}`}>
            <line
              x1={xOf(t)}
              y1={m.top + ih}
              x2={xOf(t)}
              y2={m.top + ih + 3}
              stroke={MUTED}
              opacity="0.5"
            />
            <text
              x={xOf(t)}
              y={m.top + ih + 14}
              textAnchor="middle"
              fontFamily={FM}
              fontSize="9"
              fill={MUTED}
            >
              {t}
            </text>
          </g>
        ))}
        <text
          x={m.left + iw / 2}
          y={h - 4}
          textAnchor="middle"
          fontFamily={FM}
          fontSize="10"
          fill={INK}
          letterSpacing="0.04em"
        >
          Submit height slider value (px)
        </text>
        <text
          x={10}
          y={m.top + ih / 2}
          textAnchor="middle"
          fontFamily={FM}
          fontSize="9"
          fill={MUTED}
          transform={`rotate(-90, 10, ${m.top + ih / 2})`}
        >
          MT (ms)
        </text>

        {showPredictions && (
          <>
            {/* horizontal predicted: flat (slider has no effect) */}
            <line
              x1={xOf(wMin)}
              y1={hY}
              x2={xOf(wMax)}
              y2={hY}
              stroke={TEAL}
              strokeWidth="1.5"
              strokeDasharray="5 3"
            />
            <text
              x={xOf(wMax) - 6}
              y={hY - 5}
              textAnchor="end"
              fontFamily={FD}
              fontSize="11"
              fontStyle="italic"
              fill={TEAL}
            >
              Horizontal prediction · W is constant
            </text>

            {/* vertical predicted: curved (slider matters) */}
            <path
              d={vCurvePath}
              fill="none"
              stroke={RED}
              strokeWidth="1.5"
              strokeDasharray="5 3"
            />
            <text
              x={xOf(wMin) + 6}
              y={yOf(a + b * Math.log2(D_v / wMin + 1)) - 6}
              fontFamily={FD}
              fontSize="11"
              fontStyle="italic"
              fill={RED}
            >
              Vertical prediction · W = height
            </text>
          </>
        )}

        {/* user trial dots, color-coded by layout */}
        {trials.map((t, i) => (
          <circle
            key={i}
            cx={xOf(t.submitH)}
            cy={yOf(t.MT)}
            r="4.5"
            fill={t.layout === "vertical" ? RED : TEAL}
            fillOpacity="0.78"
            stroke={t.layout === "vertical" ? RED : TEAL}
            strokeWidth="0.5"
          />
        ))}
      </svg>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        {!showPredictions ? (
          <button
            className="comic-button"
            onClick={() => setShowPredictions(true)}
            disabled={trials.length === 0}
            style={{ opacity: trials.length === 0 ? 0.4 : 1 }}
          >
            {trials.length === 0
              ? "Click a few rounds first"
              : "Reveal prediction lines (Fitts' Law)"}
          </button>
        ) : (
          <button
            className="comic-button"
            onClick={() => setShowPredictions(false)}
          >
            Hide prediction lines
          </button>
        )}
      </div>
    </div>
  );
}

function Panel9({ a, b, trials, setTrials }) {
  const wrapperRef = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(680);
  const canvasHeight = 300;

  const btnW = 100;
  const btnH_fixed = 40;
  const SUBMIT_MIN = 24;
  const SUBMIT_MAX = 70;
  const gap = 22;

  const [layout, setLayout] = useState("vertical");
  const [submitH, setSubmitH] = useState(40);
  const [step, setStep] = useState(0); // 0=row1, 1=row2, 2=submit, 3=success
  const [lastClickTime, setLastClickTime] = useState(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setCanvasWidth(e.contentRect.width);
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  // ---- geometry per layout ----
  let row1, row2, submitBox, D, W;
  // fixed-anchor D values for both layouts (so MiniScatter can show both curves)
  const D_v = 77;
  const D_h = btnW + gap;

  if (layout === "vertical") {
    const centerX = canvasWidth / 2;
    const startY = 36;
    row1 = { x: centerX - btnW / 2, y: startY, w: btnW, h: btnH_fixed };
    row2 = {
      x: centerX - btnW / 2,
      y: startY + btnH_fixed + gap,
      w: btnW,
      h: btnH_fixed,
    };
    const submitCy = row2.y + btnH_fixed + gap + 35;
    submitBox = {
      x: centerX - btnW / 2,
      y: submitCy - submitH / 2,
      w: btnW,
      h: submitH,
    };
    D = submitCy - (row2.y + btnH_fixed / 2);
    W = submitH;
  } else {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const totalW = btnW * 3 + gap * 2;
    const startX = centerX - totalW / 2;
    row1 = {
      x: startX,
      y: centerY - btnH_fixed / 2,
      w: btnW,
      h: btnH_fixed,
    };
    row2 = {
      x: startX + btnW + gap,
      y: centerY - btnH_fixed / 2,
      w: btnW,
      h: btnH_fixed,
    };
    submitBox = {
      x: startX + 2 * (btnW + gap),
      y: centerY - submitH / 2,
      w: btnW,
      h: submitH,
    };
    D = btnW + gap;
    W = btnW;
  }

  const id = Math.log2(D / W + 1);
  const predMT = a + b * id;
  const lastTrial = trials[trials.length - 1];

  const handleClick = (which) => {
    const now = performance.now();
    if (which === 1 && step === 0) {
      setStep(1);
      setLastClickTime(now);
    } else if (which === 2 && step === 1) {
      setStep(2);
      setLastClickTime(now);
    } else if (which === 3 && step === 2) {
      if (lastClickTime !== null) {
        const mt = now - lastClickTime;
        if (mt > 60 && mt < 4000) {
          setTrials((prev) => [
            ...prev.slice(-199),
            { layout, submitH, MT: mt, D, W },
          ]);
        }
      }
      setStep(3);
      setTimeout(() => {
        setStep(0);
        setLastClickTime(null);
      }, 600);
    }
  };

  const fieldStyle = (filled, isNext) => ({
    position: "absolute",
    background: isNext ? RED : filled ? "#E5DED0" : PAPER,
    border: `1px solid ${
      isNext ? RED : filled ? INK + "33" : INK + "55"
    }`,
    borderRadius: 3,
    cursor: isNext ? "pointer" : "default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 6px",
    fontFamily: FB,
    fontSize: 12,
    color: isNext ? PAPER : filled ? MUTED : INK + "99",
    fontWeight: 400,
    transition:
      "background 0.18s, border-color 0.18s, color 0.18s, left 0.3s ease, top 0.3s ease, width 0.3s ease, height 0.3s ease",
    overflow: "hidden",
    whiteSpace: "nowrap",
  });

  const sliderEnabled = step === 0 || step === 3;
  const layoutToggleEnabled = step === 0 || step === 3;

  const approachLabel =
    layout === "vertical" ? "drop down to Submit" : "slide right to Submit";

  return (
    <Panel
      number="08 · Applied · a real form"
      eyebrow="Same slider, two layouts, totally different outcomes"
      caption="Try both the vertical and horizontal layouts, then drag the slider to change Submit's height. See which layout actually lets the slider matter."
      accent="red"
    >
      {/* Layout toggle */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 14,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: FM,
            fontSize: 11,
            color: MUTED,
            letterSpacing: "0.12em",
            marginRight: 8,
            textTransform: "uppercase",
          }}
        >
          Layout
        </span>
        <ToggleTab
          active={layout === "vertical"}
          onClick={() => layoutToggleEnabled && setLayout("vertical")}
          label="Vertical ↓"
        />
        <ToggleTab
          active={layout === "horizontal"}
          onClick={() => layoutToggleEnabled && setLayout("horizontal")}
          label="Horizontal →"
        />
      </div>

      {/* Form canvas */}
      <div
        ref={wrapperRef}
        style={{
          position: "relative",
          height: `${canvasHeight}px`,
          background: PANEL_DEEP,
          border: `1px solid ${RULE}`,
          borderRadius: 2,
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        {/* Row 1 (Email) */}
        <button
          type="button"
          onClick={() => handleClick(1)}
          aria-label={
            step === 0 ? "Email, click this now" : "Email, completed"
          }
          style={{
            ...fieldStyle(step >= 1, step === 0),
            left: `${row1.x}px`,
            top: `${row1.y}px`,
            width: `${row1.w}px`,
            height: `${row1.h}px`,
          }}
        >
          {step >= 1 ? "✓ Email" : "Email"}
        </button>

        {/* Row 2 (Password) */}
        <button
          type="button"
          onClick={() => handleClick(2)}
          aria-label={
            step === 1
              ? "Password, click this now"
              : step >= 2
                ? "Password, completed"
                : "Password"
          }
          style={{
            ...fieldStyle(step >= 2, step === 1),
            left: `${row2.x}px`,
            top: `${row2.y}px`,
            width: `${row2.w}px`,
            height: `${row2.h}px`,
          }}
        >
          {step >= 2 ? "✓ Password" : "Password"}
        </button>

        {/* Submit */}
        <button
          type="button"
          onClick={() => handleClick(3)}
          aria-label={
            step === 2
              ? "Submit, click this now"
              : step === 3
                ? "Submit, completed"
                : "Submit"
          }
          style={{
            position: "absolute",
            left: `${submitBox.x}px`,
            top: `${submitBox.y}px`,
            width: `${submitBox.w}px`,
            height: `${submitBox.h}px`,
            background:
              step === 3 ? TEAL : step === 2 ? RED : PAPER,
            border: `1px solid ${
              step === 3 ? TEAL : step === 2 ? RED : INK
            }`,
            borderRadius: 3,
            cursor: step === 2 ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            fontFamily: FM,
            fontSize: Math.max(8, Math.min(12, submitH * 0.26)),
            letterSpacing: "0.08em",
            color: step === 2 || step === 3 ? PAPER : INK,
            fontWeight: 500,
            transition:
              "height 0.25s ease, width 0.3s ease, left 0.3s ease, top 0.25s ease, background 0.18s, border-color 0.18s, color 0.18s",
            textTransform: "uppercase",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {step === 3 ? "✓" : submitH >= 12 ? "Submit" : ""}
        </button>

        {/* Status indicator */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 14,
            fontFamily: FM,
            fontSize: 10,
            color: MUTED,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          {step === 0 && "Step 1 / 3 · click Email"}
          {step === 1 && "Step 2 / 3 · click Password"}
          {step === 2 && `Step 3 / 3 · ${approachLabel}`}
          {step === 3 && "✓ Done · try a different height"}
        </div>
      </div>

      {/* Height slider */}
      <div style={{ marginTop: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontFamily: FM,
              fontSize: 12,
              color: INK,
              opacity: sliderEnabled ? 1 : 0.5,
            }}
          >
            Submit button height{layout === "vertical" ? "  (= W along approach direction)" : "  (⟂ approach direction, doesn't affect W)"}
          </span>
          <span
            style={{
              fontFamily: FM,
              fontSize: 13,
              fontWeight: 500,
              color: RED,
              opacity: sliderEnabled ? 1 : 0.5,
            }}
          >
            {submitH} px
          </span>
        </div>
        <input
          type="range"
          min={SUBMIT_MIN}
          max={SUBMIT_MAX}
          value={submitH}
          step={1}
          disabled={!sliderEnabled}
          onChange={(e) => setSubmitH(parseInt(e.target.value))}
          style={{
            width: "100%",
            accentColor: RED,
            opacity: sliderEnabled ? 1 : 0.4,
          }}
        />
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginTop: 14,
        }}
      >
        <Stat label="Distance D" value={`${Math.round(D)} px`} />
        <Stat
          label="Effective W"
          value={`${Math.round(W)} px`}
          accent="red"
        />
        <Stat
          label="Predicted MT"
          value={`${Math.round(predMT)} ms`}
          accent="teal"
        />
        <Stat
          label="Last row2 → Submit"
          value={lastTrial ? `${Math.round(lastTrial.MT)} ms` : "·"}
          accent="red"
        />
      </div>

      {/* MiniScatter, dual curve */}
      <MiniScatter
        trials={trials}
        a={a}
        b={b}
        D_v={D_v}
        D_h={D_h}
        btnW={btnW}
        wMin={SUBMIT_MIN}
        wMax={SUBMIT_MAX}
      />

      <p
        style={{
          fontFamily: FD,
          fontStyle: "italic",
          fontSize: 16,
          color: INK,
          margin: "20px 0 0",
          lineHeight: 1.55,
        }}
      >
        In the vertical layout, Submit's height is the W you approach it through. Drag the slider left and your red dots climb up and to the right. In the horizontal layout, you slide in from the left, so W is its width (unchanged), and no matter how you drag the slider, your teal dots stay glued to that flat horizontal line.
      </p>

      <p
        style={{
          fontFamily: FB,
          fontSize: 13,
          color: MUTED,
          margin: "12px 0 0",
          lineHeight: 1.6,
        }}
      >
        Same slider, two layouts, totally different outcomes. This is "W along the approach direction" from Panel 07 coming to life in front of you. Next time you design a form, the question isn't just "how big is the button" but "from what direction will users approach it?" iOS HIG recommends 44 pt and Material Design recommends 48 dp, and they're guarding against the worst case: in a vertically stacked form, Submit's height is its real W.
      </p>
    </Panel>
  );
}


// =========================================================
// Main
// =========================================================

export default function FittsLawComic() {
  const [W, setW] = useState(60);
  const [D, setD] = useState(300);
  const [trials, setTrials] = useState([]);
  const [panel8Trials, setPanel8Trials] = useState([]);
  const [inputType, setInputType] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      if (window.matchMedia("(pointer: coarse)").matches) return "touch";
    }
    return "mouse";
  });
  // Set to true after the user manually picks mouse/trackpad, so subsequent
  // pointerdown "mouse" events don't overwrite their choice. Reset on touch/pen.
  const [manuallyChosen, setManuallyChosen] = useState(false);

  const addTrial = (t) => setTrials((prev) => [...prev, t]);
  const reset = () => {
    setTrials([]);
    setPanel8Trials([]);
  };

  const { a, b, label: inputLabel } = FITTS_CONSTS[inputType];

  // detect input type from pointer events (live), with respect for manual override
  useEffect(() => {
    const handler = (e) => {
      const pt = e.pointerType;
      if (pt === "touch" || pt === "pen") {
        // touch / pen are reliably detected, always update and clear manual flag
        setInputType((prev) => (prev === pt ? prev : pt));
        setManuallyChosen(false);
      } else if (pt === "mouse" && !manuallyChosen) {
        // pointer event "mouse" can be either real mouse or trackpad,
        // only update if the user hasn't manually chosen
        setInputType((prev) =>
          prev === "mouse" || prev === "trackpad" ? prev : "mouse"
        );
      }
    };
    window.addEventListener("pointerdown", handler);
    return () => window.removeEventListener("pointerdown", handler);
  }, [manuallyChosen]);

  const chooseInput = (which) => {
    setInputType(which);
    setManuallyChosen(true);
  };

  return (
    <div className="comic-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Karla:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .comic-root {
          background: ${PAPER};
          color: ${INK};
          min-height: 100vh;
          font-family: ${FB};
          padding: 28px 16px 80px;
          line-height: 1.55;
          font-size: 14px;
        }
        .comic-container { max-width: 880px; margin: 0 auto; }
        .comic-title {
          font-family: ${FB};
          font-size: 44px;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.1;
          margin: 0 0 8px;
          color: ${INK};
        }
        .comic-title em {
          font-style: normal;
          color: ${RED};
        }
        .comic-sub {
          font-family: ${FM};
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${MUTED};
          margin: 0 0 36px;
        }
        .comic-intro {
          font-family: ${FB};
          font-size: 17px;
          color: ${INK};
          line-height: 1.55;
          margin: 0 0 40px;
          max-width: 60ch;
          padding-left: 14px;
          border-left: 2px solid ${RED};
          font-weight: 500;
        }

        .panel-frame {
          background: ${PANEL};
          border: 1px solid ${INK};
          border-radius: 2px;
          padding: 36px 28px 28px;
          position: relative;
          margin-bottom: 32px;
        }

        .axis-toggle-curve {
          animation: curveFade 0.5s ease-out;
        }
        @keyframes curveFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (max-width: 600px) {
          .panel-frame { padding: 32px 18px 22px; }
          .comic-title { font-size: 32px; }
          .comic-intro { font-size: 15px; }
        }
        .panel-number {
          position: absolute;
          top: -1px;
          left: -1px;
          color: ${PAPER};
          font-family: ${FM};
          font-size: 10px;
          letter-spacing: 0.18em;
          padding: 6px 14px;
          font-weight: 500;
          text-transform: uppercase;
        }
        .panel-caption {
          font-family: ${FB};
          font-size: 19px;
          line-height: 1.5;
          max-width: 60ch;
          margin: 0 0 22px;
          font-weight: 500;
          color: ${INK};
        }
        .panel-eyebrow {
          font-family: ${FM};
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${MUTED};
          margin: 0 0 10px;
        }

        .dot-arena {
          position: relative;
          background: ${PANEL_DEEP};
          border: 1px solid ${RULE};
          border-radius: 2px;
          overflow: hidden;
          user-select: none;
        }
        .dot {
          position: absolute;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.18s, transform 0.08s, border-color 0.18s;
          padding: 0;
          margin: 0;
          font: inherit;
          color: inherit;
          outline-offset: 3px;
        }
        .dot:focus-visible {
          outline: 2px solid ${TEAL};
        }
        .dot:active { transform: scale(0.94); }
        .dot.dot-active {
          background: ${RED};
          border: 1px solid ${RED};
          box-shadow: 0 0 0 3px rgba(181, 58, 30, 0.16);
        }
        .dot.dot-idle {
          background: ${PANEL};
          border: 1px solid ${INK}66;
        }
        .dot.dot-pulse {
          animation: pulseScale 0.18s ease;
        }
        @keyframes pulseScale {
          0%   { transform: scale(1); }
          50%  { transform: scale(0.88); }
          100% { transform: scale(1); }
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
          margin: 16px 0 0;
        }
        .stat {
          background: ${PAPER};
          border: 1px solid ${RULE};
          padding: 10px 12px;
        }
        .stat-label {
          font-family: ${FM};
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: ${MUTED};
          margin: 0 0 4px;
        }
        .stat-value {
          font-family: ${FD};
          font-weight: 500;
          color: ${INK};
          margin: 0;
          line-height: 1.1;
        }

        .slider-row { margin: 0; }
        .slider-label-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 6px;
        }
        .slider-name {
          font-family: ${FM};
          font-size: 12px;
          letter-spacing: 0.06em;
          color: ${INK};
        }
        .slider-value {
          font-family: ${FM};
          font-size: 13px;
          font-weight: 500;
          color: ${RED};
        }

        .formula {
          font-family: ${FM};
          color: ${INK};
          background: ${PAPER};
          padding: 22px 24px;
          border: 1px solid ${RULE};
          text-align: center;
          overflow-x: auto;
        }
        .formula-large {
          font-family: ${FM};
          font-size: 24px;
          letter-spacing: -0.01em;
        }
        @media (max-width: 560px) {
          .formula-large { font-size: 18px; }
        }

        .pair-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .pair-grid { grid-template-columns: 1fr; }
        }

        .comic-button {
          font-family: ${FM};
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: transparent;
          border: 1px solid ${INK};
          color: ${INK};
          padding: 7px 14px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          font-weight: 500;
        }
        .comic-button:hover {
          background: ${INK};
          color: ${PAPER};
        }
        .comic-button.primary {
          background: ${RED};
          color: ${PAPER};
          border-color: ${RED};
        }
        .comic-button.primary:hover {
          background: ${INK};
          border-color: ${INK};
        }
        .comic-footer {
          font-family: ${FM};
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${MUTED};
          text-align: center;
          margin: 40px 0 0;
        }

        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          background: ${RULE};
          border-radius: 2px;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: ${RED};
          cursor: pointer;
          border: 2px solid ${PANEL};
          box-shadow: 0 0 0 1px ${RED};
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px; height: 16px;
          border-radius: 50%;
          background: ${RED};
          cursor: pointer;
          border: 2px solid ${PANEL};
          box-shadow: 0 0 0 1px ${RED};
        }
      `}</style>

      <div className="comic-container">
        <p className="comic-sub">By Zezhong Wang · 2026</p>
        <h1 className="comic-title">
          Interactive Demo for <em>Fitts' Law</em>
        </h1>
        <p className="comic-intro">
          An interactive data comic of Fitts' Law: how target size and distance shape the time it takes to point and click.
        </p>

        <Panel1 inputType={inputType} onChooseInput={chooseInput} a={a} b={b} />
        <Panel2 W={W} setW={setW} D={D} setD={setD} addTrial={addTrial} trials={trials} />
        <Panel3 trials={trials} a={a} b={b} />
        <Panel4 W={W} D={D} a={a} b={b} inputLabel={inputLabel} />
        <Panel6 trials={trials} a={a} b={b} inputLabel={inputLabel} clearTrials={reset} />
        <Panel5 W={W} D={D} setW={setW} setD={setD} a={a} b={b} inputLabel={inputLabel} trials={trials} />
        <Panel8 a={a} b={b} />
        <Panel9 a={a} b={b} trials={panel8Trials} setTrials={setPanel8Trials} />

        <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
          <button className="comic-button" onClick={reset}>
            Clear all data, start over
          </button>
        </div>

        <p className="comic-footer">
          Demo Created By Zezhong Wang · 2026
        </p>
      </div>
    </div>
  );
}
