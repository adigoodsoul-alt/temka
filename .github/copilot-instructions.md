# GitHub Copilot Instructions for «ТЕМЩИК»

You are assisting in developing «ТЕМЩИК» — a pixel roguelike criminal schemer simulator.

## Project DNA
- **Language & Runtime:** Pure Vanilla JavaScript (ES6 Modules, running in modern browsers).
- **Rendering:** HTML5 Canvas (`#game-canvas`) for game effects and environment + HTML/CSS overlay (`#ui-overlay`) for dialogue windows and HUD.
- **Dependency Philosophy:** Zero external npm build dependencies. Keep it lightweight, fast, and runnable out of the box with `python -m http.server 3000`.

## Immutable Gameplay Rules
1. **Money is Health:** The only life gauge is `Player.money`. When `money` drops to 0, call `GAME_OVER`. Never create a separate HP or stamina stat.
2. **No Physical Combat:** All conflict encounters (police raids, debt collectors, scammers) are resolved via branching text dialogues and d20 dice checks influenced by stats:
   - `authority`: Street reputation, intimidation, standing among peers.
   - `connections`: Corrupt officials, lawyers, bankers, drop networks.
   - `cunning`: Tech savviness, evading surveillance, spotting scams.
3. **PixelFX Guidelines:**
   - Adhere to the SpriteFusion pixel VFX approach.
   - All particle coordinates must be snapped to integer grid values (`Math.floor(val / pixelSize) * pixelSize`).
   - Use screen shake and hit flashes for impactful game feedback.
   - Call `createFx('damage' | 'reward' | 'crit' | 'sparkle', x, y, options)`.

## Code Conventions
- Use standard ES6 syntax: `class`, `import`/`export` with explicit `.js` extensions.
- Use the `EventBus` (`events.emit`, `events.on`) to decouple game logic from DOM manipulation.
- Keep CSS variables defined in `:root` inside `css/style.css` for consistent dark/neon pixel styling.
