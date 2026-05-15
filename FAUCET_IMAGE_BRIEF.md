# Faucet image — generation brief

**Target file:** `public/faucet-split.png` (drop in next to `hero-kitchen.png`)
**Component that consumes it:** `src/components/landing/SplitFaucet.tsx`
**Falls back to an SVG placeholder if the file is missing**, so the page works either way.

## Concept

A single kitchen faucet, photographed straight-on, vertically split down the middle:

- **Left half** — the faucet body is encrusted with white-and-brown calcium and mineral scale. Spotted, chalky, dull metal. Murky, brownish-tinted water drips weakly from the spout, with visible mineral specks suspended in it. Slightly tarnished, slightly grim — believable, not cartoonish.
- **Right half** — pristine polished chrome. Bright reflective highlight along the body. A strong, continuous column of crystal-clear water flowing smoothly from the spout, with subtle highlights and the faintest pale-blue tint. Catches the light.

The split runs **right down the centerline of the spout and stem** — same faucet, two states, judged side by side. No visible seam, no UI overlay. Let the *physical* difference do the work.

## Composition

- **Framing:** Portrait orientation, roughly 3:4 aspect ratio.
- **Faucet sits centered**, taking ~60% of frame height. Spout points down. Water streams extend toward the bottom of the frame and softly fade out (so it can blend into the page's cascading water column).
- **Background:** soft, lightly out-of-focus. Warm cream tones behind the encrusted half drifting into a cool sky-blue on the clean half. Subtle vignette. No kitchen clutter, no countertop edges, no logos.
- **Lighting:** soft, slightly directional from the upper right. Glints on the polished side; matte/flat on the encrusted side.

## Style notes

- **Photoreal**, not illustration. Think product photography for a premium home brand.
- **Restrained drama** — the contrast should read at a glance but not feel like a horror-movie poster.
- No text. No watermarks. No people. No logos on the faucet.

## Prompt to paste into your generator of choice (Midjourney / DALL-E / Imagen / etc.)

```
Photorealistic studio product shot of a single modern kitchen faucet, vertically split down the centerline of the spout: the left half is heavily encrusted with white and brown calcium and mineral scale on dull tarnished metal, dribbling murky brownish water with suspended mineral flecks; the right half is pristine polished chrome with a bright continuous column of crystal-clear water flowing smoothly, faint pale-blue tint, catching light. Same single faucet, two halves contrasted. Portrait 3:4 framing, faucet centered, spout pointing down. Soft directional lighting from upper right — glints on the chrome side, matte on the encrusted side. Background softly out of focus, warm cream tones on the left drifting to cool sky blue on the right, subtle vignette. No text, no logos, no people, no kitchen background clutter. Premium home product photography, restrained tone, high detail. --ar 3:4 --style raw --quality 2
```

(Drop the `--` flags if your generator doesn't use them.)

## After generation

1. Export as PNG with **transparent background** if possible (PNG with the faucet on transparent allows the page's ambient streams to flow continuously underneath). Otherwise PNG with the cream/blue gradient background is fine.
2. Crop tightly so the faucet fills the frame.
3. Save to `public/faucet-split.png`.
4. Refresh the dev server — `SplitFaucet.tsx` will pick it up automatically. No code changes needed.
