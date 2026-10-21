# AKCLNT NOVA — NOVA X1

A cinematic 3D phone-store demo by **AKCLNT Studio** (Rawalpindi, Pakistan).
Scroll to pull the NOVA X1 flagship apart layer by layer, switch its
colourways live, and shop the drop.

## Live demo

https://akclnt-nova.vercel.app (after deploy)

## The phone model

The hero phone is generated **procedurally in code** (Three.js) — four
extruded layers (back glass + camera, battery + wireless coil, N1 mainboard
with a canvas-drawn circuit texture, AMOLED display with a canvas-drawn UI),
so there is no external model file and nothing to license.

## Stack

- Vite + Three.js scroll experience (AKCLNT Studio engine)
- Demo shop with a fallback catalogue (no backend needed on static hosting)
- Backend folder included for showcase only — the live demo runs frontend-only

## Run locally

```bash
npm install
npm run dev
```
