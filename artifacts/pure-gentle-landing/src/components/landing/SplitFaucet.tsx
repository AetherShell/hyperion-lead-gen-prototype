import { useState } from "react";

interface SplitFaucetProps {
  /** Optional path to an AI-rendered faucet image. Falls back to SVG placeholder. */
  imageSrc?: string;
  className?: string;
}

/**
 * The split-faucet hero element: left half encrusted/hard, right half polished/clean.
 * If a rendered image is supplied (e.g. /faucet-split.png) it's shown; otherwise an
 * SVG placeholder communicates the split so layout work can proceed.
 */
export function SplitFaucet({ imageSrc = `${import.meta.env.BASE_URL}faucet-split.png`, className = "" }: SplitFaucetProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!imgFailed && (
        <img
          src={imageSrc}
          alt="A single faucet, half encrusted with hard-water mineral scale, half polished chrome — showing the difference Hyperion makes."
          onError={() => setImgFailed(true)}
          className="w-full h-auto"
          draggable={false}
        />
      )}
      {imgFailed && <FaucetPlaceholder />}
    </div>
  );
}

function FaucetPlaceholder() {
  return (
    <svg
      viewBox="0 0 400 560"
      className="w-full h-auto drop-shadow-2xl"
      aria-hidden
    >
      <defs>
        {/* Chrome gradient for clean half */}
        <linearGradient id="chromeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d6dde3" />
          <stop offset="40%" stopColor="#f4f6f8" />
          <stop offset="55%" stopColor="#a3acb4" />
          <stop offset="80%" stopColor="#dde4ea" />
          <stop offset="100%" stopColor="#9aa3ab" />
        </linearGradient>

        {/* Encrusted/calcified gradient for hard half */}
        <linearGradient id="encrustedGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8f7757" />
          <stop offset="40%" stopColor="#b59c75" />
          <stop offset="60%" stopColor="#7a6243" />
          <stop offset="100%" stopColor="#9a8160" />
        </linearGradient>

        {/* Water gradients */}
        <linearGradient id="hardSpout" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9c8261" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#bca588" stopOpacity="0.6" />
        </linearGradient>

        <linearGradient id="cleanSpout" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.7" />
        </linearGradient>

        {/* Mineral scale pattern for encrusted half */}
        <pattern id="scalePattern" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="4" r="1.2" fill="#6b5536" opacity="0.55" />
          <circle cx="9" cy="9" r="1.6" fill="#8b704c" opacity="0.45" />
          <circle cx="12" cy="2" r="0.9" fill="#5b4828" opacity="0.6" />
          <circle cx="5" cy="11" r="0.7" fill="#7a5f3e" opacity="0.5" />
        </pattern>

        {/* Clip paths to split the faucet vertically */}
        <clipPath id="leftHalf">
          <rect x="0" y="0" width="200" height="560" />
        </clipPath>
        <clipPath id="rightHalf">
          <rect x="200" y="0" width="200" height="560" />
        </clipPath>
      </defs>

      {/* --- Faucet body, drawn once per side with different fills --- */}

      {/* LEFT (encrusted) half */}
      <g clipPath="url(#leftHalf)">
        {/* Base plate */}
        <ellipse cx="200" cy="380" rx="110" ry="14" fill="url(#encrustedGrad)" />
        <ellipse cx="200" cy="378" rx="110" ry="10" fill="#6b5536" opacity="0.4" />

        {/* Neck (vertical riser) */}
        <rect x="172" y="220" width="56" height="160" fill="url(#encrustedGrad)" />

        {/* Spout flange (bell) */}
        <path
          d="M 150 220 L 250 220 L 270 290 L 130 290 Z"
          fill="url(#encrustedGrad)"
        />
        <ellipse cx="200" cy="290" rx="70" ry="10" fill="#6b5536" opacity="0.7" />

        {/* Mineral-scale overlay */}
        <rect x="0" y="200" width="200" height="200" fill="url(#scalePattern)" opacity="0.85" />

        {/* Handle nub */}
        <circle cx="200" cy="200" r="22" fill="url(#encrustedGrad)" />
        <circle cx="200" cy="200" r="22" fill="url(#scalePattern)" opacity="0.7" />

        {/* Water column — murky */}
        <path d="M 175 295 Q 168 350 178 420 Q 184 480 172 560 L 200 560 L 200 295 Z" fill="url(#hardSpout)" />
        {/* Drips */}
        <circle cx="170" cy="430" r="3" fill="#8a7050" opacity="0.7" />
        <circle cx="180" cy="500" r="2" fill="#8a7050" opacity="0.6" />
      </g>

      {/* RIGHT (clean) half */}
      <g clipPath="url(#rightHalf)">
        <ellipse cx="200" cy="380" rx="110" ry="14" fill="url(#chromeGrad)" />
        <ellipse cx="200" cy="378" rx="110" ry="10" fill="#ffffff" opacity="0.3" />

        <rect x="172" y="220" width="56" height="160" fill="url(#chromeGrad)" />
        {/* Chrome highlight stripe */}
        <rect x="186" y="220" width="4" height="160" fill="#ffffff" opacity="0.7" />

        <path
          d="M 150 220 L 250 220 L 270 290 L 130 290 Z"
          fill="url(#chromeGrad)"
        />
        <ellipse cx="200" cy="290" rx="70" ry="10" fill="#94a3b8" opacity="0.4" />

        <circle cx="200" cy="200" r="22" fill="url(#chromeGrad)" />
        <circle cx="194" cy="194" r="6" fill="#ffffff" opacity="0.7" />

        {/* Water column — crystal */}
        <path d="M 200 295 L 200 560 L 232 560 Q 220 480 226 420 Q 232 350 225 295 Z" fill="url(#cleanSpout)" />
        {/* Highlight on water */}
        <path d="M 213 300 L 213 560" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2" />
        {/* Sparkles */}
        <circle cx="218" cy="380" r="2" fill="#ffffff" opacity="0.9" />
        <circle cx="210" cy="460" r="1.5" fill="#ffffff" opacity="0.8" />
      </g>

      {/* Hairline split down the centerline */}
      <line x1="200" y1="180" x2="200" y2="560" stroke="#1e293b" strokeOpacity="0.1" strokeWidth="1" />
    </svg>
  );
}
