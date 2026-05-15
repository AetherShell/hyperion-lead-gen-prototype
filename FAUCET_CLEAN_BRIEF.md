# Clean Faucet image — generation brief (v1, macro close-up)

**Target file:** `public/faucet-clean.png`
**Component:** `src/components/landing/CleanFaucet.tsx`
**Used as:** A centered background element in the Hero. Anchored to the bottom of the viewport with the water column trailing off-screen; scroll-linked parallax rise + slight forward tilt.

## Concept

A **macro close-up** of a polished chrome kitchen faucet spout pouring a calm, beautifully lit column of clean water, surrounded by deep luminous blue. The camera sits **~30 cm (12 inches)** from the spout — close enough to be intimate, far enough that the full spout bell narrowing into the aerator is visible, with a hint of the gooseneck riser exiting the top of the frame.

## Composition

- **Framing:** portrait, 2:3 aspect ratio.
- **What's in frame:** the full spout bell + aerator + a hint of the gooseneck riser exiting the top edge — and a long water column extending to the bottom edge. **No full faucet body, no countertop, no wall, no kitchen.**
- **Spout position:** upper third of the frame, roughly centered horizontally.
- **Water column shape (critical — generators get this wrong):**
  - Emerges at roughly the diameter of the aerator
  - Gently **tapers to ~70% of that diameter** by the bottom of the frame (gravity accelerates the stream, thinning it)
  - **Smooth and silken** — soft delicate vertical light striations running top-to-bottom (refractive highlights)
  - **Not turbulent, not twisting, not rope-like, not foamy, not glassy-twisted**
  - Aerated water has a soft, evenly-textured feel
  - A few delicate micro-bubbles suspended inside, an internal cyan-white glow running down its center
- **The water glows** against the deep blue surround — like it's internally lit.

## Background / palette

- Deep navy → midnight blue surround (`#020617`, `#0a1633`, `#0b1f4d`).
- A subtle radial cyan glow halo behind/below the spout — like a soft underwater spotlight.
- No countertop, no wall, no fixtures. The faucet floats in moody blue space.
- A few **sparse** specks of bokeh in the deep background — sparingly, not busy.

## Lighting

- **Strong rim light from upper left and upper right** catches the curves of the chrome.
- The water column is **internally illuminated** — bright in the center, fading to soft cyan-blue at the edges.
- Subtle cool blue reflection on the chrome surface so it feels embedded in its environment.

## Mood

Premium. Confident. Restrained. Apple-style product photography meets a high-end bottled-water brand. Cinematic but **quiet**.

## What to avoid

- No text, no logos, no watermarks.
- No people, no hands.
- No second faucet, no split view.
- **No splashing. No turbulent / twisting / rope-like / foamy / glassy-textured water** — column should be straight, calm, gently tapering.
- No bright / warm / sunny backgrounds — stay in the deep blue palette.
- No wide pulled-back full-faucet framing — this is a macro close-up.
- No busy bokeh — sparse only.

## Prompt — paste into ChatGPT (image-gen), Midjourney, DALL-E, Imagen, Leonardo, etc.

```
Hyperreal macro product photograph of a polished chrome kitchen faucet spout, camera approximately 30 cm (12 inches) away — close enough to be intimate, far enough that the full spout bell narrowing into the aerator is visible, with a hint of the gooseneck riser exiting the top of the frame. The chrome spout occupies the upper third of the frame.

Below it, a calm column of crystal-clear water pours straight down from the aerator all the way to the bottom edge of the frame. The water shape is critical: it emerges at roughly the diameter of the aerator and gently tapers to about 70% of that diameter by the bottom of the frame (gravity accelerating it into a thinner stream). The column is smooth and silken — soft delicate vertical light striations running top-to-bottom (refractive highlights), not turbulent, not twisting, not rope-like, not foamy, not glassy-twisted. Aerated water has a soft, evenly-textured feel — a few delicate micro-bubbles suspended inside, an internal cyan-white glow running down its center.

The water glows gently against a deep luminous navy and midnight-blue background. Strong rim lighting from upper left and upper right catches the curves of the chrome; subtle cool blue reflections on the polished surface. A soft cyan radial glow halo sits behind and just under the spout, like an underwater spotlight. A few sparse specks of bokeh in the deep background — sparingly, not busy.

Portrait 2:3 framing. Premium home-product photography, Apple-style restraint, ultra high detail, cinematic but quiet. No text, no logos, no people, no kitchen, no walls, no countertop, no splashing.
```

(For Midjourney specifically, append: `--ar 2:3 --style raw --quality 2 --stylize 250 --no foam splash turbulence twisting rope-texture glass-twist`)

### If the regen still gives twisty/textured water

Follow up the generator with: *"the water column came out too twisted/textured — regenerate with the water as a smooth, gently-tapering, calm column with only soft vertical highlight lines running top-to-bottom, not horizontal swirls."*

## After generation

1. Pick the best variation, upscale.
2. Save as `public/faucet-clean.png` (PNG preferred; JPG fine).
3. Refresh the dev server — `CleanFaucet.tsx` swaps the SVG placeholder for your image automatically.

## Tuning notes after testing

- If the spout sits too low when overlaid: in `src/components/landing/Hero.tsx`, lower the initial `imageY` (`"12%"` → smaller percentage or negative).
- If the tilt is too aggressive: reduce `imageRotateX`'s endpoint (`9` → `4`–`6`).
- If the water column appears cut off where copy sits: increase opacity of the left-side darkening overlay or shift the image right of center.
- If the image renders too large/zoomed-in: in `Hero.tsx`, bump the `CleanFaucet` container width caps — currently `w-[78%] sm:w-[60%] md:w-[46%] lg:w-[38%] max-w-[520px]`. Raising `max-w-[520px]` to `max-w-[680px]` zooms *out*, not in.
