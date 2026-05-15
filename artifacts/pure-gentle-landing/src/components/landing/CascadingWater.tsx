import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Two fixed-position water streams that flank the page, scroll-linked:
 *   - Left "hard water" stream withers as the user passes the OldWay section.
 *   - Right "clean water" stream strengthens and runs full length.
 *
 * pointer-events: none, low z-index — purely ambient.
 */
export function CascadingWater() {
  const { scrollYProgress } = useScroll();

  // Hard stream: vivid through the Hero, withers across OldWay, gone before HowItWorks.
  const hardOpacity = useTransform(scrollYProgress, [0, 0.08, 0.22, 0.32], [0.45, 0.35, 0.12, 0]);
  const hardScaleY = useTransform(scrollYProgress, [0, 0.32], [1, 0.55]);

  // Clean stream: present from the start, deepens through the page, full length.
  const cleanOpacity = useTransform(scrollYProgress, [0, 0.08, 0.5, 1], [0.32, 0.42, 0.5, 0.45]);
  const cleanScaleX = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);

  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none z-30 overflow-hidden hidden xl:block">
      {/* Hard-water stream (left) */}
      <motion.div
        style={{ opacity: hardOpacity, scaleY: hardScaleY, transformOrigin: "top" }}
        className="absolute top-0 left-[2vw] 2xl:left-[4vw] h-full w-20 2xl:w-24"
      >
        <svg
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="hardWaterFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a08465" stopOpacity="0.85" />
              <stop offset="30%" stopColor="#b59879" stopOpacity="0.7" />
              <stop offset="65%" stopColor="#c9b591" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#d6c4a1" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="hardWaterShine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0">
                <animate attributeName="offset" values="-0.4;1.2" dur="6s" repeatCount="indefinite" />
              </stop>
              <stop offset="0.15" stopColor="white" stopOpacity="0.25">
                <animate attributeName="offset" values="-0.25;1.35" dur="6s" repeatCount="indefinite" />
              </stop>
              <stop offset="0.3" stopColor="white" stopOpacity="0">
                <animate attributeName="offset" values="-0.1;1.5" dur="6s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <path
            d="M 50 0 Q 38 200 52 400 Q 64 600 46 800 Q 38 900 50 1000"
            stroke="url(#hardWaterFill)"
            strokeWidth="38"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 50 0 Q 38 200 52 400 Q 64 600 46 800 Q 38 900 50 1000"
            stroke="url(#hardWaterShine)"
            strokeWidth="38"
            fill="none"
            strokeLinecap="round"
          />
          {/* Mineral-deposit specks — drift downward */}
          {[0, 0.18, 0.42, 0.7].map((delay, i) => (
            <circle key={i} cx={50 + (i % 2 ? 8 : -6)} cy={-20} r={2.2} fill="#7a6044">
              <animate
                attributeName="cy"
                from="-20"
                to="1020"
                dur="9s"
                begin={`${delay * 9}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.7;0.7;0"
                dur="9s"
                begin={`${delay * 9}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
      </motion.div>

      {/* Clean-water stream (right) */}
      <motion.div
        style={{ opacity: cleanOpacity, scaleX: cleanScaleX, transformOrigin: "center" }}
        className="absolute top-0 right-[2vw] 2xl:right-[4vw] h-full w-20 2xl:w-24"
      >
        <svg
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="cleanWaterFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#7dd3fc" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="cleanWaterShine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0">
                <animate attributeName="offset" values="-0.4;1.2" dur="3.5s" repeatCount="indefinite" />
              </stop>
              <stop offset="0.12" stopColor="white" stopOpacity="0.55">
                <animate attributeName="offset" values="-0.28;1.32" dur="3.5s" repeatCount="indefinite" />
              </stop>
              <stop offset="0.24" stopColor="white" stopOpacity="0">
                <animate attributeName="offset" values="-0.16;1.44" dur="3.5s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <path
            d="M 50 0 Q 62 200 48 400 Q 36 600 54 800 Q 62 900 50 1000"
            stroke="url(#cleanWaterFill)"
            strokeWidth="38"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 50 0 Q 62 200 48 400 Q 36 600 54 800 Q 62 900 50 1000"
            stroke="url(#cleanWaterShine)"
            strokeWidth="38"
            fill="none"
            strokeLinecap="round"
          />
          {/* Air bubbles — rise gently, suggesting aeration */}
          {[0, 0.25, 0.55, 0.8].map((delay, i) => (
            <circle
              key={i}
              cx={50 + (i % 2 ? 6 : -7)}
              cy={1020}
              r={1.8}
              fill="white"
              fillOpacity="0.8"
            >
              <animate
                attributeName="cy"
                from="1020"
                to="-20"
                dur="11s"
                begin={`${delay * 11}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.9;0.9;0"
                dur="11s"
                begin={`${delay * 11}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
