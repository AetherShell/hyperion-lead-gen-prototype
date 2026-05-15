# AI image prompt — split faucet hero

Render this image and save it as `public/faucet-split.png`. The `<SplitFaucet />`
component auto-uses it once present; SVG placeholder vanishes.

## Target

- Aspect ratio: roughly 1:1.3 (portrait) — the component scales to fit, but a
  square or slightly-tall composition works best in the hero column.
- Background: **fully transparent** (PNG with alpha). If your generator can't
  do alpha, use a flat off-white (#fafbfc) and we'll key it out.
- Resolution: 1024×1280 minimum. Higher is fine.

## Subject

A single modern kitchen faucet, photographed (or rendered photo-real) head-on
from a slight low-angle, **split exactly down the vertical centerline**.

**Left half (viewer's left):** the faucet body is encrusted with white,
yellow-brown mineral scale and calcium deposits. The chrome is dulled,
spotted, corroded at the joints. Water emerging from this side is **cloudy,
slightly murky, with a faint brown-yellow tint** — visible mineral content,
no shine.

**Right half (viewer's right):** the faucet body is **immaculate polished
chrome**, mirror-bright, with crisp highlights. Water emerging from this
side is **crystal clear, glassy, with bright specular highlights and tiny
bubbles** — looks pristine and inviting.

The split is sharp — not a gradient, not a blend. Like the faucet was cut
in half and welded back together, half "before," half "after."

## Style

- Studio product photography lighting — soft key from upper-left, gentle fill
- Shallow depth of field, faucet razor-sharp, background already gone (alpha)
- No countertop, no sink, no plumbing visible — **just the faucet floating**
- Color: cool neutral tones overall; warm corrosion on the dirty side; cool
  pure cyan tint on the clean side
- Realism level: photoreal or premium 3D render. Avoid illustrated/cartoon
  styles.

## Suggested prompt (Midjourney v6 / Flux / DALL·E 3)

```
A modern kitchen faucet, head-on view, isolated on transparent background,
split vertically exactly down the middle. Left half: encrusted with white
calcium mineral scale, brown corrosion stains, dulled chrome, cloudy
yellow-tinted water dribbling out. Right half: pristine polished mirror
chrome, crystal-clear sparkling water streaming out with visible highlights.
Sharp seam down the centerline — no blend. Studio product photography
lighting, photoreal, premium product render, high detail, alpha channel,
transparent background, 4k. --ar 4:5
```

If your generator won't honor "transparent background," append:
`flat off-white seamless background #fafbfc`
…and we'll alpha-key it on import.

## Reference notes

- Style matches the rest of the Hyperion Elite landing page: clean, trustworthy,
  premium but not flashy. Avoid neon, lens flare, dramatic angles.
- The split is the **whole point** — don't let the model average the two halves.
  If it does, re-roll with stronger split-language ("two-faced, bisected,
  half-and-half, hard line down center").

## Once rendered

1. Drop the PNG at `public/faucet-split.png`
2. Hard refresh the page — placeholder SVG is replaced automatically
3. If the image has white background instead of alpha, run it through any
   bg-removal tool (remove.bg, photoshop, etc.) before saving.
