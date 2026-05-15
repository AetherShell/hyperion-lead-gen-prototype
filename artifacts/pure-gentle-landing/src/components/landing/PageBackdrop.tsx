/**
 * The page-level faucet+water backdrop. Sits behind every section so the
 * water flow continues from the spout all the way to the page footer —
 * regardless of how tall the page ends up being.
 *
 * Two layers, no faucet distortion:
 *   1. Top band — image at natural aspect (full width, h-auto). Faucet sits
 *      at the top of the page at correct proportions; water column flows
 *      down to the natural end of the image.
 *   2. Continuation — same image rendered as a background, but only the
 *      bottom slice is visible (background-size: 100% 1200% pushes 92% of
 *      the image above the visible band). Stretched vertically to fill
 *      from the end of the top band down to the page footer. Reads as
 *      "the water keeps flowing" because the bottom of the source image is
 *      a near-uniform water column.
 *
 * Trickle layer — at the very bottom, the column visually breaks into
 *   falling droplets so the water doesn't just disappear into the dark.
 */
export function PageBackdrop({ src = `${import.meta.env.BASE_URL}faucet-split.png` }: { src?: string }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
    >
      {/* TOP — natural-aspect image; image is roughly 1:3, so its height at
          full viewport width is ~300vw. */}
      <img
        src={src}
        alt=""
        className="absolute top-0 left-0 w-full h-auto select-none"
        draggable={false}
      />

      {/* CONTINUATION — water-column extension that fills from where the
          top image ends to the bottom of the page. */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          top: "300vw",
          backgroundImage: `url(${src})`,
          backgroundSize: "100% 1200%",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* TRICKLE — column breaks into falling droplets near the very bottom */}
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[40vh] w-full"
      >
        <defs>
          <radialGradient id="droplet" cx="0.5" cy="0.45" r="0.55">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#7dd3fc" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="trickleStream" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Thin trickle streaks that emerge from the column and shorten as they descend */}
        <rect x="496" y="0" width="3" height="240" fill="url(#trickleStream)" />
        <rect x="492" y="80" width="2" height="160" fill="url(#trickleStream)" />
        <rect x="503" y="60" width="2" height="180" fill="url(#trickleStream)" />
        <rect x="488" y="140" width="1.5" height="120" fill="url(#trickleStream)" />
        <rect x="507" y="180" width="1.5" height="90" fill="url(#trickleStream)" />

        {/* Falling droplets — vertically distributed across the trickle band,
            with gentle falling animation. */}
        <g>
          <ellipse cx="497" cy="270" rx="5" ry="7" fill="url(#droplet)">
            <animate attributeName="cy" values="240;560" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" dur="2.4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="491" cy="320" rx="3.5" ry="5" fill="url(#droplet)">
            <animate attributeName="cy" values="240;560" dur="2.8s" begin="-0.7s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.9;0.9;0" dur="2.8s" begin="-0.7s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="504" cy="380" rx="4" ry="6" fill="url(#droplet)">
            <animate attributeName="cy" values="240;560" dur="2.6s" begin="-1.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.95;0.95;0" dur="2.6s" begin="-1.3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="498" cy="440" rx="3" ry="4" fill="url(#droplet)">
            <animate attributeName="cy" values="240;560" dur="3s" begin="-1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.85;0.85;0" dur="3s" begin="-1.8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="493" cy="500" rx="2.5" ry="3.5" fill="url(#droplet)">
            <animate attributeName="cy" values="240;560" dur="3.4s" begin="-2.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.8;0.8;0" dur="3.4s" begin="-2.3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="505" cy="540" rx="2" ry="3" fill="url(#droplet)">
            <animate attributeName="cy" values="240;560" dur="3.8s" begin="-2.9s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.75;0.75;0" dur="3.8s" begin="-2.9s" repeatCount="indefinite" />
          </ellipse>
        </g>
      </svg>

      {/* Soft terminal fade so the bottom edge meets the footer gracefully. */}
      <div className="absolute inset-x-0 bottom-0 h-[16vh] bg-gradient-to-b from-transparent to-[#02050f]" />
    </div>
  );
}
