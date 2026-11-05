# ПОЛНЫЙ КОНТЕКСТ ПРОЕКТА «ТЕМЩИК» ДЛЯ GEMINI

# 🤖 ПРОМПТ И КОНТЕКСТ ДЛЯ ЧАТА С GEMINI

> **Как использовать:** Скопируйте весь текст ниже (или прикрепите этот файл) в самое первое сообщение нового чата с **Google Gemini** (в Google AI Studio или Gemini Web). Gemini сразу поймет всю структуру, правила и архитектуру проекта «Темщик».

---

```markdown
Ты — ведущий Game Developer и сеньор JavaScript-инженер. Мы разрабатываем пиксельный roguelike на Vanilla JS и HTML5 Canvas.

### 🕶️ СЕТТИНГ И КОНЦЕПЦИЯ
- **Название:** «ТЕМЩИК» (The Schemer).
- **Сеттинг:** Симулятор криминального авантюриста/темщика (серый обнал, дроповоды, 115-ФЗ, ОБЭП, Москва-Сити, сомнительный OTC-криптообмен, конспиративные квартиры).
- **Стиль:** Мрачный неоновый пиксель-арт, ретро-терминал, эстетика 90-х / 2000-х с современными технологиями.

### ⛔ ЖЕЛЕЗНЫЕ ПРАВИЛА (НИКОГДА НЕ НАРУШАТЬ):
1. **ДЕНЬГИ = ХП (HEALTH):**
   - Единственный ресурс выживания — `player.money`.
   - В игре **НЕТ** отдельного свойства `hp`, `health` или выносливости!
   - Любой урон, штрафы, взятки, откаты списывают деньги: `player.modifyMoney(-delta, reason)`.
   - Если баланс падает до `0 ₽` — мгновенный `GAME_OVER` (Банкротство).
2. **СТРОГО БЕЗ БОЕВОЙ СИСТЕМЫ:**
   - В игре **НЕТ** пошаговых боев, ударов, оружия или прямых атак.
   - ВСЕ конфликты (наезды, проверки, сделки, облавы) решаются **исключительно через текстовые ивенты и диалоги**.
   - Проверки характеристик работают через бросок кубика d20:
     `d20 + Стат (Авторитет / Связи / Хитрость) >= Сложность (DC)`.
3. **ТЕХНИЧЕСКИЙ СТЕК: ТОЛЬКО ЧИСТЫЙ VANILLA JS + CANVAS + CSS:**
   - Нативные ES6 модули (`import`/`export`). Никаких React, Vue, TypeScript и npm-сборщиков!
   - Игра запускается напрямую в браузере через простой локальный сервер (`python -m http.server 3000`).
   - `#game-canvas` — холст на весь экран для фона, сетки и сочных эффектов `PixelFX`.
   - `#ui-overlay` — контейнер для HTML-интерфейса поверх Canvas (`pointer-events: none` на контейнере, `pointer-events: auto` на окнах).
4. **ПИКСЕЛЬНЫЙ СОК (PixelFX):**
   - Обязателен Pixel Snapping: координаты частиц строго целые и привязаны к пиксельной сетке (`Math.floor(x / pixelSize) * pixelSize`). Никакого размытия!
   - Дискретные палитры цветов (White Core -> Accent -> Decay).
   - Экранная отдача: Screen Shake (тряска экрана) + Hit Flash (вспышка экрана) + всплывающие цифры (`-55 000 ₽`, `+40 000 ₽`).
   - Вызов через функцию: `createFx('damage' | 'reward' | 'coins' | 'crit' | 'sparkle', x, y, options)`.

---

### 🏛️ СТРУКТУРА ПРОЕКТА:
- `index.html` — разметка, fullscreen canvas (`#game-canvas`) и оверлей (`#ui-overlay`).
- `css/style.css` — пиксельные стили, темы терминала, шрифты, пульсации урона/куша.
- `src/main.js` — точка входа, игровой цикл `requestAnimationFrame`, авто-ресайз канваса, фоновая атмосфера дождя.
- `src/core/GameStateManager.js` — машина состояний: `HUB`, `EXPLORATION`, `DIALOGUE`, `GAME_OVER`.
- `src/core/EventBus.js` — шина событий (Pub/Sub): `STATE_CHANGED`, `MONEY_CHANGED`, `PLAYER_DAMAGED`, `PLAYER_REWARDED`, `GAME_OVER`.
- `src/entities/Player.js` — класс игрока: `money`, `stats: { authority, connections, cunning }`, `modifyMoney()`, `rollCheck()`.
- `src/dialogue/mockEvents.js` — база ивентов и диалогов с вариантами выбора и проверками статов.
- `src/dialogue/DialogueManager.js` — менеджер диалогов, расчет исходов, бросок d20, триггеры эффектов `createFx`.
- `src/vfx/PixelFX.js` — движок пиксельных эффектов (Pixel Snapping, Screen Shake, Hit Flash, монеты, осколки, shockwave).
- `src/ui/UIManager.js` — рендеринг верхнего HUD (баланс, статы, прогресс-бар) и экранов под каждое состояние игры.

---

### 🔄 ГЛОБАЛЬНЫЙ ЦИКЛ ИГРЫ:
1. **Убежище (`HUB`):** прокачка характеристик за деньги, звонки, выбор следующей вылазки.
2. **Вылазка (`EXPLORATION`):** карта криминального района, выбор точек интереса (POI).
3. **Ивент/Диалог (`DIALOGUE`):** текстовое ветвление, проверка характеристик (кубик d20 + стат). Успех = куш (`createFx('reward')`), провал = урон балансу (`createFx('damage')`).
4. **Банкротство (`GAME_OVER`):** баланс упал до нуля, конец игры, перезапуск.

---

### 📋 ТРЕБОВАНИЯ К ТВОИМ ОТВЕТАМ:
1. Всегда пиши готовый к использованию модульный ES6 код.
2. При добавлении или изменении файлов обязательно указывай путь к файлу (например, `src/dialogue/mockEvents.js`).
3. Помни: боевой системы НЕТ, деньги — это жизнь, графика — пиксельная и сочная.
4. Отвечай на русском языке.
```


---

## АКТУАЛЬНЫЙ ИСХОДНЫЙ КОД ВСЕХ ФАЙЛОВ

### Файл: `css/style.css`

```css
/* ==========================================================================
   Темщик Roguelike - Пиксельные стили UI и Спецэффектов
   ========================================================================== */

:root {
  --bg-dark: #0d0e15;
  --bg-panel: #161824;
  --bg-card: #202334;
  --border-color: #3b4261;
  --border-focus: #5d6796;
  
  --accent-gold: #ffcc00;
  --accent-green: #34d399;
  --accent-red: #f43f5e;
  --accent-cyan: #38bdf8;
  --text-main: #e2e8f0;
  --text-muted: #94a3b8;

  --pixel-border: 3px solid #000000;
  --pixel-shadow: 4px 4px 0px #000000;
  --pixel-shadow-sm: 2px 2px 0px #000000;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  user-select: none;
  -webkit-user-select: none;
}

body, html {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--bg-dark);
  font-family: 'Consolas', 'Courier New', monospace, sans-serif;
  color: var(--text-main);
  image-rendering: pixelated;
}

/* ==========================================================================
   Canvas (Спецэффекты и фон)
   ========================================================================== */
#game-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

/* ==========================================================================
   UI Overlay Container (Поверх Canvas)
   ========================================================================== */
#ui-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  pointer-events: none; /* Пропускаем клики сквозь контейнер, кроме активных окон */
  display: flex;
  flex-direction: column;
}

/* ==========================================================================
   Верхний HUD: Баланс = ХП, Статы, Состояние
   ========================================================================== */
.hud-bar {
  pointer-events: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: rgba(18, 20, 31, 0.95);
  border-bottom: 3px solid #000000;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.hud-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pixel-badge {
  background: #000;
  color: var(--accent-cyan);
  padding: 6px 10px;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 1px;
  border: 2px solid var(--accent-cyan);
  box-shadow: var(--pixel-shadow-sm);
}

.hud-state-pill {
  background: var(--bg-card);
  padding: 6px 12px;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid var(--border-color);
  letter-spacing: 0.5px;
}

/* Центр HUD: Деньги = ХП */
.hud-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.money-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #0b0c13;
  padding: 6px 20px;
  border: 3px solid var(--accent-gold);
  box-shadow: var(--pixel-shadow);
  transition: transform 0.1s ease;
}

.money-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: bold;
  letter-spacing: 1px;
}

.money-value {
  font-size: 24px;
  font-weight: 900;
  color: var(--accent-gold);
  letter-spacing: 1px;
  text-shadow: 2px 2px 0 #000;
}

.health-bar-bg {
  width: 180px;
  height: 8px;
  background: #1e1e24;
  margin-top: 4px;
  border: 1px solid #000;
  overflow: hidden;
}

.health-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #eab308, #22c55e);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Пульсации плашки денег при уроне или куше */
.pulse-damage {
  animation: pulse-damage-anim 0.35s ease-out;
}
@keyframes pulse-damage-anim {
  0% { transform: scale(1.15); border-color: var(--accent-red); background: #3b0d18; }
  100% { transform: scale(1); border-color: var(--accent-gold); background: #0b0c13; }
}

.pulse-reward {
  animation: pulse-reward-anim 0.35s ease-out;
}
@keyframes pulse-reward-anim {
  0% { transform: scale(1.15); border-color: var(--accent-green); background: #063d27; }
  100% { transform: scale(1); border-color: var(--accent-gold); background: #0b0c13; }
}

/* Правая часть HUD: Статы */
.hud-right {
  display: flex;
  gap: 12px;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-card);
  padding: 6px 12px;
  border: 2px solid var(--border-color);
  font-size: 13px;
  box-shadow: var(--pixel-shadow-sm);
}

.stat-val {
  font-weight: bold;
  color: var(--accent-cyan);
}

/* ==========================================================================
   Основная область представления (View Content)
   ========================================================================== */
.view-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  pointer-events: none;
}

/* Универсальная панель */
.panel {
  pointer-events: auto;
  background: var(--bg-panel);
  border: var(--pixel-border);
  box-shadow: var(--pixel-shadow);
  max-width: 680px;
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.panel-header {
  background: #11131c;
  padding: 12px 18px;
  border-bottom: 2px solid #000;
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-header h2 {
  font-size: 16px;
  letter-spacing: 1px;
}

.panel-body {
  padding: 24px;
}

.flavor-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.terminal-dot {
  width: 10px;
  height: 10px;
  display: inline-block;
  border: 1px solid #000;
}
.terminal-dot.green { background: #22c55e; }
.terminal-dot.yellow { background: #eab308; }
.terminal-dot.red { background: #ef4444; }

/* ==========================================================================
   Кнопки в пиксельном стиле
   ========================================================================== */
.pixel-btn {
  background: var(--bg-card);
  border: 2px solid #000000;
  box-shadow: var(--pixel-shadow-sm);
  color: var(--text-main);
  padding: 12px 16px;
  font-family: inherit;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  transition: transform 0.05s ease, background 0.15s ease;
}

.pixel-btn:hover {
  background: #2b3046;
  border-color: var(--accent-cyan);
}

.pixel-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.pixel-btn.primary {
  border-color: var(--accent-green);
  background: #0f2c20;
}
.pixel-btn.primary:hover {
  background: #143e2d;
}

.pixel-btn.warning {
  border-color: var(--accent-gold);
  background: #2e2609;
}
.pixel-btn.warning:hover {
  background: #45390d;
}

.pixel-btn.danger {
  border-color: var(--accent-red);
  background: #380d17;
}
.pixel-btn.danger:hover {
  background: #501321;
}

.pixel-btn.large {
  font-size: 16px;
  padding: 16px 24px;
}

.btn-icon {
  font-size: 24px;
}

.btn-text-wrap {
  display: flex;
  flex-direction: column;
}

.btn-title {
  font-size: 14px;
  color: #ffffff;
}

.btn-subtitle {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: normal;
  margin-top: 2px;
}

/* ==========================================================================
   Хаб (Убежище)
   ========================================================================== */
.hub-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ==========================================================================
   Вылазка (Exploration POI Grid)
   ========================================================================== */
.poi-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.poi-card {
  background: var(--bg-card);
  border: 2px solid #000;
  box-shadow: var(--pixel-shadow-sm);
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.08s ease, border-color 0.15s ease;
}

.poi-card:hover {
  border-color: var(--accent-cyan);
  background: #2b3046;
  transform: translateX(4px);
}

.poi-card:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.poi-icon {
  font-size: 32px;
}

.poi-info h3 {
  font-size: 15px;
  margin-bottom: 4px;
}

.poi-info p {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.poi-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border: 1px solid #000;
}
.poi-badge.danger { background: #501321; color: var(--accent-red); border-color: var(--accent-red); }
.poi-badge.warning { background: #3b2f0a; color: var(--accent-gold); border-color: var(--accent-gold); }
.poi-badge.info { background: #0c2b3d; color: var(--accent-cyan); border-color: var(--accent-cyan); }

.exploration-footer {
  display: flex;
  justify-content: flex-end;
}

/* ==========================================================================
   Диалоговое окно (Модальное окно ивента)
   ========================================================================== */
.dialogue-modal {
  pointer-events: auto;
  background: var(--bg-panel);
  border: var(--pixel-border);
  box-shadow: 6px 6px 0px #000000;
  max-width: 640px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.dialogue-header {
  background: #11131c;
  padding: 14px 18px;
  border-bottom: 2px solid #000;
  display: flex;
  align-items: center;
  gap: 14px;
}

.speaker-avatar {
  font-size: 36px;
  background: #000;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border-color);
}

.speaker-meta {
  display: flex;
  flex-direction: column;
}

.speaker-name {
  font-size: 17px;
  font-weight: bold;
  color: var(--accent-gold);
}

.dialogue-location {
  font-size: 11px;
  color: var(--text-muted);
}

.dialogue-title {
  background: #191c2b;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 0.5px;
  border-bottom: 1px dashed var(--border-color);
  color: var(--accent-cyan);
}

.dialogue-body {
  padding: 18px;
  border-bottom: 2px solid #000;
}

.dialogue-text {
  font-size: 14px;
  line-height: 1.6;
  color: #f1f5f9;
}

/* Варианты выбора в диалоге */
.dialogue-choices {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #10121a;
}

.dialogue-choice-btn {
  background: var(--bg-card);
  border: 2px solid #000;
  box-shadow: var(--pixel-shadow-sm);
  color: var(--text-main);
  padding: 12px 16px;
  font-family: inherit;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  transition: transform 0.05s ease, background 0.1s ease;
}

.dialogue-choice-btn:hover {
  background: #2b3046;
  border-color: var(--accent-gold);
}

.dialogue-choice-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.dialogue-choice-btn.is-check {
  border-left: 5px solid var(--accent-gold);
}

.choice-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.choice-hint {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: normal;
}

.choice-stat-badge {
  font-size: 11px;
  background: #000;
  color: var(--accent-gold);
  padding: 4px 8px;
  border: 1px solid var(--accent-gold);
  white-space: nowrap;
}

/* Результат проверки */
.outcome-box {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 8px;
}

.roll-breakdown {
  padding: 10px 14px;
  border: 2px solid #000;
  box-shadow: var(--pixel-shadow-sm);
  font-size: 13px;
}

.roll-breakdown.success {
  background: #063d27;
  border-color: var(--accent-green);
  color: #bbf7d0;
}

.roll-breakdown.failure {
  background: #450a16;
  border-color: var(--accent-red);
  color: #fecdd3;
}

.roll-verdict {
  font-weight: bold;
  font-size: 15px;
  margin-top: 4px;
}

.outcome-text {
  font-size: 14px;
  line-height: 1.5;
}

.outcome-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #2d3148;
  padding-top: 12px;
}

.delta-badge {
  font-size: 16px;
  font-weight: 900;
  padding: 4px 8px;
  border: 1px solid #000;
  margin-right: 8px;
}
.delta-badge.profit { background: #064e3b; color: #4ade80; border-color: #4ade80; }
.delta-badge.loss { background: #4c0519; color: #fb7185; border-color: #fb7185; }

.outcome-reason {
  font-size: 12px;
  color: var(--text-muted);
}

/* ==========================================================================
   Game Over Экран
   ========================================================================== */
.game-over-panel {
  border-color: var(--accent-red);
  box-shadow: 6px 6px 0px #4c0519;
  text-align: center;
}

.danger-header {
  background: #4c0519;
  justify-content: center;
}

.danger-header h2 {
  color: #ffffff;
}

.game-over-skull {
  font-size: 64px;
  margin-bottom: 12px;
  animation: pulse-skull 1s infinite alternate ease-in-out;
}

@keyframes pulse-skull {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

.danger-text {
  color: #fca5a5;
}

.game-over-reason {
  background: #000;
  padding: 10px;
  border: 1px solid #4c0519;
  font-size: 13px;
  margin-bottom: 24px;
  color: var(--accent-red);
}

.game-over-actions {
  display: flex;
  justify-content: center;
}

/* ==========================================================================
   Интерактивная карта (Exploration)
   ========================================================================== */
.map-container {
  position: relative;
  width: 100%;
  height: 300px;
  background-color: #0a0b10;
  border: 2px solid var(--border-color);
  box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
  overflow: hidden;
  background-image: linear-gradient(#161824 1px, transparent 1px), linear-gradient(90deg, #161824 1px, transparent 1px);
  background-size: 20px 20px;
}

.map-pin {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pin-icon {
  font-size: 32px;
  background: var(--bg-card);
  border: 2px solid #000;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: var(--pixel-shadow-sm);
  transition: transform 0.1s ease, border-color 0.1s ease;
}

.map-pin:hover .pin-icon {
  transform: scale(1.1);
  border-color: var(--accent-cyan);
}

.pin-tooltip {
  position: absolute;
  top: -60px;
  width: max-content;
  max-width: 200px;
  background: #11131c;
  border: 2px solid #000;
  padding: 8px 12px;
  box-shadow: var(--pixel-shadow-sm);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease;
  pointer-events: none;
  text-align: center;
}

.map-pin:hover .pin-tooltip {
  opacity: 1;
  visibility: visible;
}

.pin-title {
  font-size: 12px;
  font-weight: bold;
  color: var(--accent-gold);
  margin-bottom: 4px;
}

.pin-loc {
  font-size: 10px;
  color: var(--text-muted);
}

```

### Файл: `index.html`

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ТЕМЩИК — Симулятор криминального авантюриста (Roguelike MVP)</title>
  <link rel="stylesheet" href="./css/style.css" />
</head>
<body>

  <!-- Полноэкранный Canvas для фонового рендера и сочных пиксельных VFX (PixelFX) -->
  <canvas id="game-canvas"></canvas>

  <!-- Контейнер для UI: поверх Canvas, пропускает клики кроме интерактивных окон -->
  <div id="ui-overlay"></div>

  <!-- Главный модуль игры (ES6) -->
  <script type="module" src="./src/main.js"></script>
</body>
</html>

```

### Файл: `src/core/EventBus.js`

```javascript
/**
 * EventBus - Легковесная шина событий для слабой связанности систем
 */
export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Подписаться на событие
   * @param {string} event 
   * @param {Function} callback 
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  /**
   * Отписаться от события
   * @param {string} event 
   * @param {Function} callback 
   */
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).delete(callback);
  }

  /**
   * Оповестить подписчиков
   * @param {string} event 
   * @param {any} data 
   */
  emit(event, data) {
    if (!this.listeners.has(event)) return;
    for (const callback of this.listeners.get(event)) {
      try {
        callback(data);
      } catch (err) {
        console.error(`Ошибка в обработчике события "${event}":`, err);
      }
    }
  }

  /**
   * Очистить все подписки
   */
  clear() {
    this.listeners.clear();
  }
}

// Экспортируем глобальный синглтон для простоты взаимодействия
export const events = new EventBus();

```

### Файл: `src/core/GameStateManager.js`

```javascript
import { events } from './EventBus.js';

/**
 * Перечисление основных состояний игры
 */
export const GameStates = Object.freeze({
  HUB: 'HUB',                 // Убежище (Хаб)
  EXPLORATION: 'EXPLORATION', // Локация / Вылазка
  DIALOGUE: 'DIALOGUE',       // Текстовый ивент / Диалог
  GAME_OVER: 'GAME_OVER',     // Банкротство / Конец игры
  WIN: 'WIN'                  // Новое состояние победы
});

/**
 * GameStateManager - Управляет жизненным циклом и сменой состояний
 */
export class GameStateManager {
  constructor(initialState = GameStates.HUB) {
    this.currentState = initialState;
    this.previousState = null;
    this.stateData = null;
    this.transitions = new Map();
  }

  /**
   * Получить текущее состояние
   */
  getState() {
    return this.currentState;
  }

  /**
   * Проверить текущее состояние
   * @param {string} state 
   */
  is(state) {
    return this.currentState === state;
  }

  /**
   * Переключить состояние
   * @param {string} nextState 
   * @param {any} payload Дополнительные данные (например, конфиг диалога)
   */
  setState(nextState, payload = null) {
    if (!GameStates[nextState]) {
      console.warn(`[GameStateManager] Неизвестное состояние: ${nextState}`);
      return;
    }

    if (this.currentState === nextState && payload === null) {
      return;
    }

    const prevState = this.currentState;
    this.previousState = prevState;
    this.currentState = nextState;
    this.stateData = payload;

    console.log(`[GameStateManager] Смена состояния: ${prevState} -> ${nextState}`, payload);

    // Оповещаем подписчиков через шину событий
    events.emit('STATE_CHANGED', {
      previous: prevState,
      current: nextState,
      data: payload
    });
  }

  /**
   * Возврат к предыдущему состоянию (например, из диалога обратно в эксплорейшн)
   */
  revertState() {
    if (this.previousState) {
      this.setState(this.previousState);
    } else {
      this.setState(GameStates.HUB);
    }
  }
}

```

### Файл: `src/dialogue/DialogueManager.js`

```javascript
import { events } from '../core/EventBus.js';
import { createFx } from '../vfx/PixelFX.js';

/**
 * DialogueManager - Управляет проигрыванием текстовых диалогов,
 * проверками характеристик, ветвлениями и вызовом FX.
 */
export class DialogueManager {
  /**
   * @param {Player} player 
   */
  constructor(player) {
    this.player = player;
    this.currentEvent = null;
    this.currentOutcome = null;
  }

  /**
   * Начать диалог / событие
   * @param {Object} eventData 
   */
  startDialogue(eventData) {
    this.currentEvent = eventData;
    this.currentOutcome = null;

    console.log(`[DialogueManager] Запуск ивента: "${eventData.title}"`);

    events.emit('DIALOGUE_START', {
      event: this.currentEvent
    });
  }

  /**
   * Выбрать вариант ответа
   * @param {number} choiceIndex Индекс выбранной реплики
   */
  selectChoice(choiceIndex) {
    if (!this.currentEvent || !this.currentEvent.choices) return;

    const choice = this.currentEvent.choices[choiceIndex];
    if (!choice) return;

    let outcome = null;

    if (choice.type === 'check') {
      // 1. Проверка характеристики (RNG d20 + стат)
      const rollResult = this.player.rollCheck(choice.stat, choice.difficulty);
      const branch = rollResult.success ? choice.onSuccess : choice.onFailure;

      // 2. Модификация баланса (ХП)
      const moneyResult = this.player.modifyMoney(branch.moneyDelta, branch.reason);

      // 3. Запуск сочного VFX через PixelFX (createFx)
      const fxType = branch.fx || (rollResult.success ? 'reward' : 'damage');
      createFx(fxType, null, null, {
        amount: branch.moneyDelta,
        count: rollResult.isCrit ? 60 : 40
      });

      outcome = {
        isCheck: true,
        rollResult,
        title: rollResult.success 
          ? (rollResult.isCrit ? '🔥 КРИТИЧЕСКИЙ УСПЕХ!' : '✅ ПРОВЕРКА ПРОЙДЕНА') 
          : '❌ ПРОВАЛ ПРОВЕРКИ',
        text: branch.text,
        delta: branch.moneyDelta,
        reason: branch.reason,
        isDead: !moneyResult.isAlive
      };
    } else {
      // Прямой выбор без броска кубика
      const moneyResult = choice.moneyDelta 
        ? this.player.modifyMoney(choice.moneyDelta, choice.reason)
        : { isAlive: this.player.isAlive() };

      if (choice.fx) {
        createFx(choice.fx, null, null, { amount: choice.moneyDelta });
      }

      outcome = {
        isCheck: false,
        rollResult: null,
        title: '📋 РЕШЕНИЕ ПРИНЯТО',
        text: choice.textOutcome || 'Вы приняли решение.',
        delta: choice.moneyDelta ?? 0,
        reason: choice.reason ?? '',
        isDead: !moneyResult.isAlive
      };
    }

    this.currentOutcome = outcome;

    // Оповещаем UI об исходе
    events.emit('DIALOGUE_OUTCOME', outcome);
  }

  /**
   * Завершить диалог
   */
  closeDialogue() {
    this.currentEvent = null;
    this.currentOutcome = null;
    events.emit('DIALOGUE_END');
  }
}

```

### Файл: `src/dialogue/mockEvents.js`

```javascript
/**
 * База мок-ивентов и диалогов в сеттинге симулятора "темщика"
 */

export const MOCK_EVENTS = [
  {
    id: 'obep_raid',
    title: '🚨 Облава в офисе дроповодов',
    location: 'Промзона, подпольный офис',
    speaker: 'Майор ОБЭП Смирнов',
    avatar: '👮‍♂️',
    text: 'Тяжелый стук в металлическую дверь. В глазок видно двух оперов и понятых. "Открывайте, ОБЭП! Поступил сигнал о незаконном обналичивании и дроп-ферме. Будем ломать!"',
    choices: [
      {
        text: '«Товарищ майор, давайте без протокола» (Проверка Авторитета)',
        type: 'check',
        stat: 'authority',
        difficulty: 12,
        hint: 'Требуется d20 + Авторитет ≥ 12',
        onSuccess: {
          text: 'Майор прищурился, взвесил пачку купюр и усмехнулся: «Ладно, сегодня ты меня не видел. Но держи ухо востро — завтра на районе будет чистка».',
          moneyDelta: 40000,
          reason: 'Успешный откуп + сохранение оборота дропов',
          fx: 'reward',
          next: null
        },
        onFailure: {
          text: '«Ты кому взятку суешь, барыга?!» — майор вламывается в кабинет, изымает системники, меченые купюры и блокирует карты дропов.',
          moneyDelta: -55000,
          reason: 'Конфискация кэша и штрафы ОБЭП',
          fx: 'damage',
          next: null
        }
      },
      {
        text: 'Смыть сим-карты в унитаз и уйти по пожарной лестнице (Проверка Хитрости)',
        type: 'check',
        stat: 'cunning',
        difficulty: 10,
        hint: 'Требуется d20 + Хитрость ≥ 10',
        onSuccess: {
          text: 'Вы ловко уничтожаете сим-боксы, прыгаете с пожарного балкона в сугроб и скрываетесь во дворах. Улики уничтожены, оборотный капитал спасен!',
          moneyDelta: 15000,
          reason: 'Спасение остатков оборотного кэша',
          fx: 'reward',
          next: null
        },
        onFailure: {
          text: 'Пожарный люк заклинило! Пока вы дергали ручку, бойцы СОБР выбили дверь. Пришлось откупаться втрое дороже прямо на коленке.',
          moneyDelta: -45000,
          reason: 'Потеря аппаратуры и экстренная взятка',
          fx: 'damage',
          next: null
        }
      },
      {
        text: 'Сдаться и позвонить штатному адвокату (Без риска, фикс. расход)',
        type: 'direct',
        textOutcome: 'Адвокат решает вопрос юридически: опечатывают только один стол, но гонорар за выезд бьет по карману.',
        moneyDelta: -20000,
        reason: 'Оплата услуг решалы-адвоката',
        fx: 'damage',
        next: null
      }
    ]
  },

  {
    id: 'crypto_otc_deal',
    title: '💎 Сомнительный обмен в Башне Федерация',
    location: 'Москва-Сити, 42 этаж',
    speaker: 'Артур «USDT-Кинг»',
    avatar: '🕶️',
    text: 'Артур развалился в кожаном кресле и крутит в руках печатку: «Есть горячий объем на 50к тезера. Дисконт 6%. Но отправлять надо вперед на миксер. Либо берешь сейчас, либо отдаю пацанам с Люберец».',
    choices: [
      {
        text: 'Прогнать кошелек через сканер и сбить цену (Проверка Связей)',
        type: 'check',
        stat: 'connections',
        difficulty: 13,
        hint: 'Требуется d20 + Связи ≥ 13',
        onSuccess: {
          text: 'Вы звоните знакомому аналитику из криптобиржи. Оказывается, Артур блефует! Вы прижимаете его фактами и выбиваете жирный спред в свою пользу.',
          moneyDelta: 65000,
          reason: 'Чистый арбитраж на криптосделке',
          fx: 'crit',
          next: null
        },
        onFailure: {
          text: 'Связной не отвечает! Вы перевели деньги, а кошелек мгновенно ушел в скам-лист. Артур разводит руками: «Братан, рынок штормит, транза зависла...»',
          moneyDelta: -50000,
          reason: 'Попали на крипто-скам и грязь',
          fx: 'damage',
          next: null
        }
      },
      {
        text: 'Согласиться только на тестовый транш в 15% (Смекалка)',
        type: 'check',
        stat: 'cunning',
        difficulty: 8,
        hint: 'Требуется d20 + Хитрость ≥ 8',
        onSuccess: {
          text: 'Тестовый транш прошел без сучка! Забираем скромную, но верную маржу без лишних седых волос.',
          moneyDelta: 20000,
          reason: 'Быстрый профит с малой сделки',
          fx: 'reward',
          next: null
        },
        onFailure: {
          text: 'Артур заявляет, что ради копеек мараться не станет, и взимает неустойку за бронь переговорки.',
          moneyDelta: -10000,
          reason: 'Неустойка за срыв сделки',
          fx: 'damage',
          next: null
        }
      },
      {
        text: 'Отказаться от сделки и уйти (Пас)',
        type: 'direct',
        textOutcome: 'Вы молча встаете и уходите. Деньги целы, но время потеряно.',
        moneyDelta: 0,
        reason: 'Отказ от рискованной авантюры',
        fx: null,
        next: null
      }
    ]
  },

  {
    id: 'shady_banker',
    title: '🏦 Дроповод не выходит на связь',
    location: 'Кофейня возле метро',
    speaker: 'Колян «Дроп-Менеджер»',
    avatar: '🧢',
    text: 'Колян нервно дергает ногой: «Короче, одна из карт с крупным балансом ушла в блок по 115-ФЗ. В отделении сидит безопасник. Чтобы разморозить, надо занести начальнику отделения или надавить».',
    choices: [
      {
        text: 'Подключить ручного начальника безопасности (Проверка Связей)',
        type: 'check',
        stat: 'connections',
        difficulty: 11,
        hint: 'Требуется d20 + Связи ≥ 11',
        onSuccess: {
          text: 'Один звонок нужному человеку — и блок по 115-ФЗ снят за 15 минут. Деньги выведены в кэш!',
          moneyDelta: 50000,
          reason: 'Разморозка заблокированного счета',
          fx: 'reward',
          next: null
        },
        onFailure: {
          text: 'Контакт в банке сменился на прошлой неделе! Новый безопасник передал данные в Финмониторинг. Счет арестован намертво.',
          moneyDelta: -40000,
          reason: 'Арест счета по 115-ФЗ',
          fx: 'damage',
          next: null
        }
      },
      {
        text: 'Вломиться к управляющему и включить «блатного» (Проверка Авторитета)',
        type: 'check',
        stat: 'authority',
        difficulty: 14,
        hint: 'Требуется d20 + Авторитет ≥ 14',
        onSuccess: {
          text: 'Вы доходчиво объясняете управляющему расклады. Тот бледнеет, подписывает разблокировку и лично выносит наличные.',
          moneyDelta: 70000,
          reason: 'Выбивание замороженных средств',
          fx: 'crit',
          next: null
        },
        onFailure: {
          text: 'Управляющий нажимает тревожную кнопку Росгвардии. Приходится экстренно сбрасывать телефоны и скрываться дворами.',
          moneyDelta: -30000,
          reason: 'Экстренный сброс конспирации',
          fx: 'damage',
          next: null
        }
      }
    ]
  }
];

```

### Файл: `src/entities/Player.js`

```javascript
import { events } from '../core/EventBus.js';

/**
 * Класс Player - Темщик
 * Ключевой принцип: Деньги = ХП. Баланс 0 -> Game Over.
 */
export class Player {
  /**
   * @param {Object} config
   * @param {number} config.startingMoney Стартовый капитал (ХП)
   * @param {number} config.authority Авторитет
   * @param {number} config.connections Связи
   * @param {number} config.cunning Хитрость
   */
  constructor({
    startingMoney = 100000,
    authority = 8,
    connections = 6,
    cunning = 10
  } = {}) {
    this.startingMoney = startingMoney;
    this.maxMoney = startingMoney; // Запоминаем пиковый капитал для прогресс-бара
    this.money = startingMoney;

    // Ролевые характеристики "темщика"
    this.stats = {
      authority,    // Авторитет: решает вопросы силой слова, понтами, влиянием
      connections,  // Связи: доступ к "крышам", инсайдам, ручным ментам, дропам
      cunning       // Хитрость: умение просчитывать риски, путать следы, обманывать
    };

    this.reputation = 50; // 0..100 (нейтральная репутация на районе)
    this.daysSurvived = 1;
    this.maxDays = 30;
    this.targetMoney = 1000000;
  }

  /**
   * Проверка жив ли игрок (остались ли деньги)
   * @returns {boolean}
   */
  isAlive() {
    return this.money > 0;
  }

  /**
   * Изменить баланс (нанесение урона или получение куша)
   * @param {number} delta Положительное число (прибыль) или отрицательное (убыток/штраф/откат)
   * @param {string} reason Описание причины операции
   * @returns {{ money: number, delta: number, isAlive: boolean }}
   */
  modifyMoney(delta, reason = 'Неизвестная операция') {
    const oldMoney = this.money;
    this.money = Math.max(0, this.money + delta);

    if (this.money > this.maxMoney) {
      this.maxMoney = this.money;
    }

    const actualDelta = this.money - oldMoney;

    // Глобальное оповещение об изменении баланса
    events.emit('MONEY_CHANGED', {
      money: this.money,
      maxMoney: this.maxMoney,
      delta: actualDelta,
      reason
    });

    if (actualDelta < 0) {
      // Игрок получил урон по кошельку
      events.emit('PLAYER_DAMAGED', {
        money: this.money,
        delta: actualDelta,
        reason
      });
    } else if (actualDelta > 0) {
      // Игрок сорвал куш
      events.emit('PLAYER_REWARDED', {
        money: this.money,
        delta: actualDelta,
        reason
      });
    }

    // Проверка на банкротство
    if (!this.isAlive()) {
      events.emit('GAME_OVER', {
        reason: `Вы обнулились! Баланс ушел в ноль: ${reason}`
      });
    }

    return {
      money: this.money,
      delta: actualDelta,
      isAlive: this.isAlive()
    };
  }

  /**
   * Проверка характеристики через кубик (d20 + стат против сложности)
   * @param {string} statName 'authority' | 'connections' | 'cunning'
   * @param {number} difficulty Сложность проверки (DC)
   * @param {number} modifier Временный бонус/штраф
   */
  rollCheck(statName, difficulty, modifier = 0) {
    const statValue = this.stats[statName] ?? 0;
    // Бросок кости d20 (1 - 20)
    const diceRoll = Math.floor(Math.random() * 20) + 1;
    const total = diceRoll + statValue + modifier;
    const success = diceRoll === 20 || (diceRoll !== 1 && total >= difficulty);

    return {
      success,
      isCrit: diceRoll === 20,
      isFumble: diceRoll === 1,
      diceRoll,
      statName,
      statValue,
      modifier,
      total,
      difficulty,
      margin: total - difficulty
    };
  }

  /**
   * Завершить день, списать ренту и проверить условия победы/поражения
   */
  advanceDay() {
    this.daysSurvived++;
    
    // Ежедневные траты на конспирацию и жизнь
    this.modifyMoney(-3000, 'Ежедневная рента и расходы на конспирацию');

    if (!this.isAlive()) return; // Если умер от ренты, modifyMoney уже вызвал GAME_OVER

    // Проверка победы
    if (this.money >= this.targetMoney) {
      events.emit('GAME_WIN', { reason: 'Вы собрали 1 000 000 ₽ и готовы улететь в Дубай!' });
      return;
    }

    // Проверка таймера (поражение)
    if (this.daysSurvived > this.maxDays) {
      events.emit('GAME_OVER', { reason: 'Прошло 30 дней, а миллиона нет. Кредиторы вас нашли.' });
    }
  }

  /**
   * Сбросить состояние игрока (для новой игры)
   */
  reset() {
    this.money = this.startingMoney;
    this.maxMoney = this.startingMoney;
    this.daysSurvived = 1;
    events.emit('MONEY_CHANGED', {
      money: this.money,
      maxMoney: this.maxMoney,
      delta: 0,
      reason: 'Новая игра'
    });
  }
}

```

### Файл: `src/main.js`

```javascript
import { GameStateManager, GameStates } from './core/GameStateManager.js';
import { Player } from './entities/Player.js';
import { initPixelFX, getPixelFX, createFx } from './vfx/PixelFX.js';
import { DialogueManager } from './dialogue/DialogueManager.js';
import { UIManager } from './ui/UIManager.js';

/**
 * Точка входа в игру "Темщик" (MVP Roguelike)
 */
class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.uiContainer = document.getElementById('ui-overlay');

    // Настройка размеров Canvas под окно
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // 1. Инициализация VFX-системы (PixelFX)
    this.fx = initPixelFX(this.canvas);
    // Делаем функцию глобально доступной для тестов из DevTools
    window.createFx = createFx;

    // 2. Инициализация Игрока (Деньги = ХП)
    this.player = new Player({
      startingMoney: 100000,
      authority: 8,
      connections: 6,
      cunning: 10
    });

    // 3. Менеджер состояний
    this.gsm = new GameStateManager(GameStates.HUB);

    // 4. Менеджер диалогов
    this.dialogueManager = new DialogueManager(this.player);

    // 5. Менеджер интерфейса
    this.ui = new UIManager({
      container: this.uiContainer,
      player: this.player,
      gsm: this.gsm,
      dm: this.dialogueManager
    });

    // Частицы атмосферы города (ночной криминальный дождь/дымка)
    this.ambientParticles = [];
    this._initAmbientParticles();

    // Запуск игрового цикла
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);

    console.log('🎮 [Game] Игра "Темщик" успешно инициализирована!');
  }

  /**
   * Подгонка Canvas под разрешение экрана
   */
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = false;
    }
  }

  /**
   * Фоновые атмосферные частицы (капли дождя / неоновая пыль)
   */
  _initAmbientParticles() {
    const count = 40;
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speed: 80 + Math.random() * 120,
        length: 6 + Math.random() * 8,
        color: Math.random() > 0.5 ? '#1e293b' : '#334155'
      });
    }
  }

  /**
   * Обновление и отрисовка атмосферного фона
   */
  _renderBackground(dt) {
    // Темный градиент ночного города
    this.ctx.fillStyle = '#0d0e15';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Отрисовка пиксельной сетки (киберпанк / ретро-терминал сеттинг)
    this.ctx.strokeStyle = 'rgba(30, 41, 59, 0.25)';
    this.ctx.lineWidth = 1;
    const gridSize = 40;
    
    this.ctx.beginPath();
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
    }
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
    }
    this.ctx.stroke();

    // Падающий пиксельный дождь
    for (const p of this.ambientParticles) {
      p.y += p.speed * dt;
      if (p.y > this.canvas.height) {
        p.y = -p.length;
        p.x = Math.random() * this.canvas.width;
      }
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, p.length);
    }
  }

  /**
   * Главный цикл (Game Loop)
   */
  loop(currentTime) {
    const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    // 1. Очистка и отрисовка заднего фона
    this._renderBackground(dt);

    // 2. Обновление и отрисовка спецэффектов (PixelFX)
    this.fx.update(dt);
    this.fx.render(this.ctx);

    requestAnimationFrame(this.loop);
  }
}

// Запуск игры после загрузки страницы
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});

```

### Файл: `src/ui/UIManager.js`

```javascript
import { events } from '../core/EventBus.js';
import { GameStates } from '../core/GameStateManager.js';
import { MOCK_EVENTS } from '../dialogue/mockEvents.js';

/**
 * UIManager - Отвечает за рендеринг и интерактивность HTML UI,
 * расположенного поверх Canvas.
 */
export class UIManager {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.container Контейнер #ui-overlay
   * @param {Player} options.player Экземпляр игрока
   * @param {GameStateManager} options.gsm Менеджер состояний
   * @param {DialogueManager} options.dm Менеджер диалогов
   */
  constructor({ container, player, gsm, dm }) {
    this.container = container;
    this.player = player;
    this.gsm = gsm;
    this.dm = dm;

    this._bindEvents();
    this.renderHUD();
    this.updateStateView(this.gsm.getState());
  }

  /**
   * Подписка на события шины
   */
  _bindEvents() {
    events.on('STATE_CHANGED', ({ current, data }) => {
      this.renderHUD();
      this.updateStateView(current, data);
    });

    events.on('MONEY_CHANGED', () => {
      this.updateHUDValues();
    });

    events.on('PLAYER_DAMAGED', ({ delta }) => {
      this._pulseMoneyDisplay('damage');
    });

    events.on('PLAYER_REWARDED', ({ delta }) => {
      this._pulseMoneyDisplay('reward');
    });

    events.on('DIALOGUE_START', ({ event }) => {
      this.renderDialogue(event);
    });

    events.on('DIALOGUE_OUTCOME', (outcome) => {
      this.renderDialogueOutcome(outcome);
    });

    events.on('DIALOGUE_END', () => {
      // Ивенты тратят 1 день и списывают ренту
      this.player.advanceDay();
      
      // Если после списания ренты и проверок игрок еще в игре, возвращаем на карту
      const state = this.gsm.getState();
      if (this.player.isAlive() && state !== GameStates.WIN && state !== GameStates.GAME_OVER) {
        this.gsm.setState(GameStates.EXPLORATION);
      }
    });

    events.on('GAME_OVER', ({ reason }) => {
      this.gsm.setState(GameStates.GAME_OVER, { reason });
    });

    events.on('GAME_WIN', ({ reason }) => {
      this.gsm.setState(GameStates.WIN, { reason });
    });
  }

  /**
   * Рендер верхнего HUD (Баланс/ХП, Статы, Состояние)
   */
  renderHUD() {
    let hud = document.getElementById('hud-bar');
    if (!hud) {
      hud = document.createElement('header');
      hud.id = 'hud-bar';
      hud.className = 'hud-bar';
      this.container.appendChild(hud);
    }

    const stateLabels = {
      [GameStates.HUB]: '🏠 УБЕЖИЩЕ',
      [GameStates.EXPLORATION]: '🗺️ ВЫЛАЗКА В ГОРОД',
      [GameStates.DIALOGUE]: '💬 ТЕМКА / ИВЕНТ',
      [GameStates.GAME_OVER]: '💀 БАНКРОТСТВО',
      [GameStates.WIN]: '🏆 ПОБЕДА'
    };

    const currentState = this.gsm.getState();
    const moneyPercent = Math.min(100, Math.max(0, (this.player.money / this.player.maxMoney) * 100));

    hud.innerHTML = `
      <div class="hud-left">
        <div class="hud-logo">
          <span class="pixel-badge">ТЕМЩИК v0.1</span>
        </div>
        <div class="hud-state-pill" style="margin-left: 8px; color: var(--accent-gold);">
          ДЕНЬ ${this.player.daysSurvived} / ${this.player.maxDays}
        </div>
        <div class="hud-state-pill" id="hud-state-label">
          ${stateLabels[currentState] || currentState}
        </div>
      </div>

      <div class="hud-center">
        <!-- БАЛАНС = ХП -->
        <div class="money-container" id="money-container" title="Деньги — это ваша жизнь. Падение до нуля означает Game Over!">
          <div class="money-label">БАЛАНС (ЦЕЛЬ: 1 МЛН ₽):</div>
          <div class="money-value" id="money-display">
            ${this.player.money.toLocaleString('ru-RU')} ₽
          </div>
          <div class="health-bar-bg">
            <div class="health-bar-fill" id="health-bar-fill" style="width: ${moneyPercent}%"></div>
          </div>
        </div>
      </div>

      <div class="hud-right">
        <div class="stat-badge" title="Авторитет: решает вопросы силой слова и влиянием">
          <span class="stat-icon">👑</span>
          <span class="stat-name">Авторитет:</span>
          <span class="stat-val" id="stat-authority">${this.player.stats.authority}</span>
        </div>
        <div class="stat-badge" title="Связи: доступ к ручным органам, банкам и дропам">
          <span class="stat-icon">📞</span>
          <span class="stat-name">Связи:</span>
          <span class="stat-val" id="stat-connections">${this.player.stats.connections}</span>
        </div>
        <div class="stat-badge" title="Хитрость: анализ рисков и обход ловушек">
          <span class="stat-icon">🧠</span>
          <span class="stat-name">Хитрость:</span>
          <span class="stat-val" id="stat-cunning">${this.player.stats.cunning}</span>
        </div>
      </div>
    `;
  }

  /**
   * Обновление только значений в HUD (без перерисовки DOM)
   */
  updateHUDValues() {
    const moneyDisplay = document.getElementById('money-display');
    const healthBarFill = document.getElementById('health-bar-fill');
    if (moneyDisplay) {
      moneyDisplay.textContent = `${this.player.money.toLocaleString('ru-RU')} ₽`;
    }
    if (healthBarFill) {
      const moneyPercent = Math.min(100, Math.max(0, (this.player.money / this.player.maxMoney) * 100));
      healthBarFill.style.width = `${moneyPercent}%`;
    }
  }

  /**
   * Анимация пульсации плашки денег при уроне или куше
   */
  _pulseMoneyDisplay(type) {
    const el = document.getElementById('money-container');
    if (!el) return;
    el.classList.remove('pulse-damage', 'pulse-reward');
    void el.offsetWidth; // trigger reflow
    el.classList.add(type === 'damage' ? 'pulse-damage' : 'pulse-reward');
  }

  /**
   * Обновить представление активного экрана
   */
  updateStateView(state, data) {
    // Удаляем старую активную панель контента (диалог, хаб, вылазка, геймовер)
    const oldView = document.getElementById('view-content');
    if (oldView) oldView.remove();

    const view = document.createElement('div');
    view.id = 'view-content';
    view.className = 'view-content';
    this.container.appendChild(view);

    switch (state) {
      case GameStates.HUB:
        this.renderHubView(view);
        break;
      case GameStates.EXPLORATION:
        this.renderExplorationView(view);
        break;
      case GameStates.DIALOGUE:
        // Рендерится через renderDialogue / DIALOGUE_START
        break;
      case GameStates.GAME_OVER:
        this.renderGameOverView(view, data);
        break;
      case GameStates.WIN:
        this.renderWinView(view, data);
        break;
    }
  }

  /**
   * 1. Экран Убежища (Хаб)
   */
  renderHubView(container) {
    container.innerHTML = `
      <div class="panel hub-panel">
        <div class="panel-header">
          <span class="terminal-dot green"></span>
          <span class="terminal-dot yellow"></span>
          <span class="terminal-dot red"></span>
          <h2>🏢 УБЕЖИЩЕ (КОНСПИРАТИВНАЯ КВАРТИРА)</h2>
        </div>
        <div class="panel-body">
          <p class="flavor-text">
            Стены оклеены стикерами с сид-фразами и номерами симок. На столе шуршат пачки наличных, 
            ноутбук подключен через три цепочки VPN. Здесь вы в безопасности, но капитал должен работать.
          </p>

          <div class="hub-actions">
            <button class="pixel-btn primary" id="btn-to-exploration">
              <span class="btn-icon">🗺️</span>
              <div class="btn-text-wrap">
                <span class="btn-title">Выйти на вылазку</span>
                <span class="btn-subtitle">Поиск точек интереса, NPC и сомнительных схем</span>
              </div>
            </button>

            <button class="pixel-btn warning" id="btn-upgrade-connections">
              <span class="btn-icon">🤝</span>
              <div class="btn-text-wrap">
                <span class="btn-title">Купить новую базу дропов (-15 000 ₽)</span>
                <span class="btn-subtitle">+2 к Связям</span>
              </div>
            </button>

            <button class="pixel-btn danger" id="btn-instant-event">
              <span class="btn-icon">⚡</span>
              <div class="btn-text-wrap">
                <span class="btn-title">Принять срочный звонок</span>
                <span class="btn-subtitle">Случайный текстовый ивент</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-to-exploration')?.addEventListener('click', () => {
      this.gsm.setState(GameStates.EXPLORATION);
    });

    document.getElementById('btn-upgrade-connections')?.addEventListener('click', () => {
      if (this.player.money > 15000) {
        this.player.modifyMoney(-15000, 'Покупка базы дропов');
        this.player.stats.connections += 2;
        this.renderHUD();
      } else {
        alert('Недостаточно денег на балансе! Деньги — ваше здоровье.');
      }
    });

    document.getElementById('btn-instant-event')?.addEventListener('click', () => {
      const randomEvent = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
      this.gsm.setState(GameStates.DIALOGUE);
      this.dm.startDialogue(randomEvent);
    });
  }

  /**
   * 2. Экран Вылазки (Exploration) с интерактивной картой
   */
  renderExplorationView(container) {
    const shuffledEvents = [...MOCK_EVENTS].sort(() => 0.5 - Math.random());
    const activeEvents = shuffledEvents.slice(0, 3);

    const defaultCoords = [
      { x: '20%', y: '30%' },
      { x: '70%', y: '40%' },
      { x: '45%', y: '75%' }
    ];

    let poisHtml = '';
    activeEvents.forEach((ev, index) => {
      const posX = ev.x || defaultCoords[index].x;
      const posY = ev.y || defaultCoords[index].y;

      poisHtml += `
        <div class="map-pin" data-event-id="${ev.id}" style="left: ${posX}; top: ${posY};">
          <div class="pin-icon">${ev.avatar || '📍'}</div>
          <div class="pin-tooltip">
            <div class="pin-title">${ev.title}</div>
            <div class="pin-loc">${ev.location || 'Неизвестно'}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="panel exploration-panel">
        <div class="panel-header">
          <h2>📍 ВЫЛАЗКА: КРИМИНАЛЬНЫЙ РАЙОН</h2>
        </div>
        <div class="panel-body">
          <p class="flavor-text">Город живет своей суетливой жизнью. Выберите точку на карте для начала дела:</p>
          <div class="map-container">
            <div class="map-bg"></div>
            ${poisHtml}
          </div>
          <div class="exploration-footer" style="margin-top: 24px;">
            <button class="pixel-btn" id="btn-back-to-hub">🏠 Вернуться в Убежище</button>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('.map-pin').forEach((pin) => {
      pin.addEventListener('click', () => {
        const eventId = pin.getAttribute('data-event-id');
        const ev = MOCK_EVENTS.find(e => e.id === eventId) || MOCK_EVENTS[0];
        this.gsm.setState(GameStates.DIALOGUE);
        this.dm.startDialogue(ev);
      });
    });

    document.getElementById('btn-back-to-hub')?.addEventListener('click', () => {
      this.gsm.setState(GameStates.HUB);
    });
  }

  /**
   * 3. Экран Диалога (Ивента)
   */
  renderDialogue(eventData) {
    const view = document.getElementById('view-content');
    if (!view) return;

    view.innerHTML = `
      <div class="dialogue-modal">
        <div class="dialogue-header">
          <div class="speaker-avatar">${eventData.avatar || '👤'}</div>
          <div class="speaker-meta">
            <div class="speaker-name">${eventData.speaker}</div>
            <div class="dialogue-location">${eventData.location || 'Локация'}</div>
          </div>
        </div>

        <div class="dialogue-title">${eventData.title}</div>
        
        <div class="dialogue-body">
          <p class="dialogue-text">${eventData.text}</p>
        </div>

        <div class="dialogue-choices" id="dialogue-choices-container">
          <!-- Кнопки ответов -->
        </div>
      </div>
    `;

    const choicesContainer = document.getElementById('dialogue-choices-container');
    eventData.choices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.className = `dialogue-choice-btn ${choice.type === 'check' ? 'is-check' : 'is-direct'}`;
      
      const statIcons = { authority: '👑', connections: '📞', cunning: '🧠' };
      const statLabel = choice.stat ? `${statIcons[choice.stat] || ''} Сложность: ${choice.difficulty}` : '';

      btn.innerHTML = `
        <div class="choice-content">
          <span class="choice-text">${choice.text}</span>
          ${choice.hint ? `<span class="choice-hint">${choice.hint}</span>` : ''}
        </div>
        ${choice.type === 'check' ? `<span class="choice-stat-badge">${statLabel}</span>` : ''}
      `;

      btn.addEventListener('click', () => {
        // Блокируем кнопки после клика
        choicesContainer.querySelectorAll('button').forEach(b => b.disabled = true);
        this.dm.selectChoice(index);
      });

      choicesContainer.appendChild(btn);
    });
  }

  /**
   * Экран результата проверки диалога
   */
  renderDialogueOutcome(outcome) {
    const choicesContainer = document.getElementById('dialogue-choices-container');
    if (!choicesContainer) return;

    let rollDetails = '';
    if (outcome.isCheck && outcome.rollResult) {
      const r = outcome.rollResult;
      const statNames = { authority: 'Авторитет', connections: 'Связи', cunning: 'Хитрость' };
      rollDetails = `
        <div class="roll-breakdown ${r.success ? 'success' : 'failure'}">
          🎲 Бросок d20: <strong>${r.diceRoll}</strong> + ${statNames[r.statName] || r.statName} (${r.statValue}) 
          = <strong>${r.total}</strong> vs Сложность ${r.difficulty}
          <div class="roll-verdict">${outcome.title}</div>
        </div>
      `;
    }

    const deltaSign = outcome.delta > 0 ? '+' : '';
    const deltaFormatted = outcome.delta !== 0 
      ? `<span class="delta-badge ${outcome.delta > 0 ? 'profit' : 'loss'}">${deltaSign}${outcome.delta.toLocaleString('ru-RU')} ₽</span>` 
      : '';

    choicesContainer.innerHTML = `
      <div class="outcome-box">
        ${rollDetails}
        <p class="outcome-text">${outcome.text}</p>
        <div class="outcome-footer">
          <div class="outcome-delta-info">
            ${deltaFormatted}
            <span class="outcome-reason">${outcome.reason}</span>
          </div>
          <button class="pixel-btn primary" id="btn-dialogue-continue">
            ${outcome.isDead ? '💀 Понятно...' : 'Продолжить'}
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-dialogue-continue')?.addEventListener('click', () => {
      this.dm.closeDialogue();
    });
  }

  /**
   * 4. Экран Game Over (Банкротство)
   */
  renderGameOverView(container, data) {
    container.innerHTML = `
      <div class="panel game-over-panel">
        <div class="panel-header danger-header">
          <h2>💀 ВАС ОБНУЛИЛИ (GAME OVER)</h2>
        </div>
        <div class="panel-body">
          <div class="game-over-skull">💀</div>
          <p class="flavor-text danger-text">
            Баланс упал до 0 ₽. В мире криминальных темок долг не прощают.
            Счета заблокированы, телефоны молчат, а в дверь стучат с кувалдой.
          </p>
          <div class="game-over-reason">
            <strong>Причина банкротства:</strong> ${data?.reason || 'Потеря всех оборотных средств'}
          </div>

          <div class="game-over-actions">
            <button class="pixel-btn danger large" id="btn-restart-game">
              🔄 Начать заново (Новый темщик)
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-restart-game')?.addEventListener('click', () => {
      this.player.reset();
      this.gsm.setState(GameStates.HUB);
    });
  }

  /**
   * 5. Экран Победы (Win)
   */
  renderWinView(container, data) {
    container.innerHTML = `
      <div class="panel game-over-panel" style="border-color: var(--accent-green); box-shadow: 6px 6px 0px #063d27;">
        <div class="panel-header" style="background: #063d27; justify-content: center;">
          <h2 style="color: #ffffff;">🏆 ПОБЕДА! ЭКСИТ СОСТОЯЛСЯ</h2>
        </div>
        <div class="panel-body">
          <div class="game-over-skull" style="font-size: 64px; margin-bottom: 12px;">✈️</div>
          <p class="flavor-text" style="color: #bbf7d0;">
            ${data?.reason || 'Вы собрали нужную сумму.'} <br><br>
            Чемоданы собраны, крипта переведена на холодный кошелек. Вы сидите в бизнес-зале Шереметьево, 
            ожидая рейс в Дубай. Наконец-то можно выдохнуть.
          </p>
          <div class="game-over-actions" style="margin-top: 24px;">
            <button class="pixel-btn primary large" id="btn-restart-win">
              🔄 Начать заново (Новая игра)
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-restart-win')?.addEventListener('click', () => {
      this.player.reset();
      this.gsm.setState(GameStates.HUB);
    });
  }
}

```

### Файл: `src/vfx/PixelFX.js`

```javascript
/**
 * PixelFX - Модуль визуальных пиксельных спецэффектов (VFX)
 * Построен в соответствии с принципами SpriteFusion / pixelfx:
 * - Pixel snapping (привязка к пиксельной сетке, без субпиксельного размытия)
 * - Ограниченная палитра цветов (white -> primary -> secondary -> decay)
 * - Пиксельные формы: блоки, 4-конечные искры, монетки, кольца взрыва
 * - Экранная отдача: Screen Shake и Hit Flash
 */

// Палитры для пиксельных эффектов
const PALETTES = {
  damage: ['#ffffff', '#ff385c', '#c70d3a', '#6b0821', '#2c0b14'],
  reward: ['#ffffff', '#fff375', '#ffcc00', '#ff9900', '#2dd4bf', '#10b981'],
  crit: ['#ffffff', '#38bdf8', '#818cf8', '#c084fc', '#4ade80'],
  sparkle: ['#ffffff', '#fef08a', '#e2e8f0']
};

export class PixelFX {
  /**
   * @param {HTMLCanvasElement} canvas 
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Масштаб виртуального пикселя (размер "зерна" пиксель-арта)
    this.pixelSize = 3;

    // Списки активных частиц и эффектов
    this.particles = [];
    this.floatingTexts = [];
    this.rings = [];

    // Состояние Screen Shake (тряска экрана)
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
    this.shakeOffset = { x: 0, y: 0 };

    // Состояние Hit Flash (вспышка экрана)
    this.flashColor = null;
    this.flashAlpha = 0;
    this.flashDuration = 0;
    this.flashTimer = 0;
  }

  /**
   * Главный API-метод запуска эффекта
   * @param {'damage'|'reward'|'coins'|'crit'|'sparkle'} type 
   * @param {number} x Координата центра на Canvas
   * @param {number} y Координата центра на Canvas
   * @param {Object} options Дополнительные параметры (кол-во, текст урона/денег)
   */
  createFx(type, x, y, options = {}) {
    // Дефолтная привязка к центру экрана, если x/y не заданы
    const originX = x ?? (this.canvas.width / 2);
    const originY = y ?? (this.canvas.height / 2);

    switch (type) {
      case 'damage':
        this._spawnDamageEffect(originX, originY, options);
        break;
      case 'reward':
      case 'coins':
        this._spawnRewardEffect(originX, originY, options);
        break;
      case 'crit':
        this._spawnCritEffect(originX, originY, options);
        break;
      case 'sparkle':
        this._spawnSparkleCluster(originX, originY, options);
        break;
      default:
        console.warn(`[PixelFX] Неизвестный тип эффекта: ${type}`);
    }
  }

  /**
   * Эффект получения урона:
   * 1. Hit flash (вспышка)
   * 2. Screen shake (тряска)
   * 3. Кроваво-огненные осколочные пиксели
   * 4. Всплывающий урон красными пиксельными цифрами
   */
  _spawnDamageEffect(x, y, options) {
    const count = options.count ?? 45;
    const amount = options.amount ?? null;

    // Вспышка экрана (красно-белая)
    this.flashScreen('rgba(255, 30, 60, 0.45)', 0.18);
    // Тряска экрана
    this.shakeScreen(12, 0.35);

    // Взрывное кольцо
    this.rings.push({
      x, y,
      radius: 4,
      maxRadius: 60,
      color: '#ff385c',
      thickness: this.pixelSize,
      speed: 180
    });

    // Осколочные пиксельные частицы
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 260;
      const life = 0.4 + Math.random() * 0.4;
      const sizeInPixels = Math.random() > 0.6 ? 2 : 1;

      this.particles.push({
        type: 'square',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60, // легкий импульс вверх
        gravity: 420,
        drag: 0.94,
        palette: PALETTES.damage,
        life,
        maxLife: life,
        size: sizeInPixels * this.pixelSize
      });
    }

    // Всплывающий текст урона
    if (amount !== null) {
      this.floatingTexts.push({
        text: typeof amount === 'number' ? `-${Math.abs(amount).toLocaleString('ru-RU')} ₽` : String(amount),
        x,
        y: y - 20,
        vy: -70,
        life: 1.1,
        maxLife: 1.1,
        color: '#ff4d6d',
        strokeColor: '#000000',
        fontSize: 22
      });
    }
  }

  /**
   * Эффект награды / куша:
   * 1. Золотистая легкая вспышка
   * 2. Фонтан золотых прямоугольных пикселей-монет
   * 3. 4-конечные пиксельные звездочки
   * 4. Зеленый всплывающий текст прибыли
   */
  _spawnRewardEffect(x, y, options) {
    const count = options.count ?? 50;
    const amount = options.amount ?? null;

    // Легкая золотая вспышка
    this.flashScreen('rgba(255, 230, 80, 0.25)', 0.15);
    // Мягкий screen shake
    this.shakeScreen(4, 0.2);

    // Монеты/купюры (падающие частицы с физикой прыжка)
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6; // фонтан вверх
      const speed = 120 + Math.random() * 280;
      const life = 0.7 + Math.random() * 0.6;

      this.particles.push({
        type: Math.random() > 0.4 ? 'coin' : 'sparkle',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 360,
        drag: 0.96,
        palette: PALETTES.reward,
        life,
        maxLife: life,
        size: this.pixelSize * (Math.random() > 0.5 ? 2 : 1.5),
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 12
      });
    }

    // Всплывающий текст профита
    if (amount !== null) {
      this.floatingTexts.push({
        text: typeof amount === 'number' ? `+${Math.abs(amount).toLocaleString('ru-RU')} ₽` : String(amount),
        x,
        y: y - 20,
        vy: -60,
        life: 1.2,
        maxLife: 1.2,
        color: '#4ade80',
        strokeColor: '#052e16',
        fontSize: 24
      });
    }
  }

  /**
   * Критический успех
   */
  _spawnCritEffect(x, y, options) {
    this.flashScreen('rgba(255, 255, 255, 0.6)', 0.25);
    this.shakeScreen(15, 0.4);

    this.rings.push({
      x, y,
      radius: 4,
      maxRadius: 100,
      color: '#38bdf8',
      thickness: this.pixelSize * 2,
      speed: 260
    });

    this._spawnRewardEffect(x, y, { count: 30, amount: options.amount });
  }

  /**
   * Небольшой кластер мерцающих пиксельных звезд
   */
  _spawnSparkleCluster(x, y, options) {
    const count = options.count ?? 12;
    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 60;
      const offsetY = (Math.random() - 0.5) * 60;
      const life = 0.3 + Math.random() * 0.4;

      this.particles.push({
        type: 'sparkle',
        x: x + offsetX,
        y: y + offsetY,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        gravity: 0,
        drag: 0.9,
        palette: PALETTES.sparkle,
        life,
        maxLife: life,
        size: this.pixelSize * 1.5,
        rotation: 0,
        vRot: 0
      });
    }
  }

  /**
   * Тряска экрана (Screen Shake)
   * @param {number} intensity Пиксели смещения
   * @param {number} duration Длительность в секундах
   */
  shakeScreen(intensity, duration) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }

  /**
   * Вспышка экрана (Hit Flash)
   * @param {string} color CSS цвет
   * @param {number} duration Длительность в секундах
   */
  flashScreen(color, duration) {
    this.flashColor = color;
    this.flashDuration = duration;
    this.flashTimer = duration;
    this.flashAlpha = 1.0;
  }

  /**
   * Обновление состояния VFX на шаг времени dt
   * @param {number} dt Дельта времени в секундах
   */
  update(dt) {
    // 1. Обновление Screen Shake
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
      const progress = this.shakeTimer / this.shakeDuration;
      const currentIntensity = this.shakeIntensity * Math.max(0, progress);
      // Пиксельное смещение (целые числа)
      this.shakeOffset.x = Math.round((Math.random() - 0.5) * 2 * currentIntensity);
      this.shakeOffset.y = Math.round((Math.random() - 0.5) * 2 * currentIntensity);
      if (this.shakeTimer <= 0) {
        this.shakeIntensity = 0;
        this.shakeOffset = { x: 0, y: 0 };
      }
    }

    // 2. Обновление Hit Flash
    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
      this.flashAlpha = Math.max(0, this.flashTimer / this.flashDuration);
    }

    // 3. Обновление расширяющихся колец
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const ring = this.rings[i];
      ring.radius += ring.speed * dt;
      if (ring.radius >= ring.maxRadius) {
        this.rings.splice(i, 1);
      }
    }

    // 4. Обновление частиц
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.vRot) {
        p.rotation += p.vRot * dt;
      }
    }

    // 5. Всплывающие тексты
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.life -= dt;
      if (t.life <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }
      t.y += t.vy * dt;
      t.vy *= 0.95; // замедление всплытия
    }
  }

  /**
   * Отрисовка всех пиксельных эффектов на Canvas
   * @param {CanvasRenderingContext2D} ctx 
   */
  render(ctx) {
    ctx.save();

    // Отключаем размытие изображения для сохранения жестких пикселей
    ctx.imageSmoothingEnabled = false;

    // Применяем Screen Shake сдвиг
    if (this.shakeOffset.x !== 0 || this.shakeOffset.y !== 0) {
      ctx.translate(this.shakeOffset.x, this.shakeOffset.y);
    }

    // 1. Отрисовка колец (в стиле пиксельных shockwaves)
    for (const ring of this.rings) {
      const alpha = 1 - (ring.radius / ring.maxRadius);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = ring.thickness;
      // Рисуем ступенчатый ромб/круг с пиксельной привязкой
      this._drawPixelCircle(ctx, Math.floor(ring.x), Math.floor(ring.y), Math.floor(ring.radius));
      ctx.restore();
    }

    // 2. Отрисовка частиц
    for (const p of this.particles) {
      const progress = 1 - (p.life / p.maxLife); // 0 -> 1
      const paletteIndex = Math.min(
        p.palette.length - 1,
        Math.floor(progress * p.palette.length)
      );
      const color = p.palette[paletteIndex];

      // Pixel Snapping: координаты строго целые, кратные виртуальному пикселю
      const snapX = Math.floor(p.x / this.pixelSize) * this.pixelSize;
      const snapY = Math.floor(p.y / this.pixelSize) * this.pixelSize;

      ctx.fillStyle = color;

      if (p.type === 'square') {
        ctx.fillRect(snapX, snapY, p.size, p.size);
      } else if (p.type === 'coin') {
        // Пиксельная монетка (прямоугольник 2x3 или 3x2 в зависимости от вращения)
        const isFlipped = Math.sin(p.rotation) > 0;
        const width = isFlipped ? p.size * 1.5 : p.size * 0.8;
        const height = p.size * 1.4;
        ctx.fillRect(snapX - width / 2, snapY - height / 2, width, height);
      } else if (p.type === 'sparkle') {
        // 4-конечная пиксельная звезда (крестик)
        const s = this.pixelSize;
        ctx.fillRect(snapX, snapY, s, s);
        ctx.fillRect(snapX - s, snapY, s, s);
        ctx.fillRect(snapX + s, snapY, s, s);
        ctx.fillRect(snapX, snapY - s, s, s);
        ctx.fillRect(snapX, snapY + s, s, s);
      }
    }

    // 3. Отрисовка всплывающего урона / прибыли
    for (const t of this.floatingTexts) {
      const alpha = Math.min(1, t.life / 0.3); // быстрое затухание в конце
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${t.fontSize}px 'Courier New', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Пиксельный контур (толстый черный)
      ctx.strokeStyle = t.strokeColor;
      ctx.lineWidth = 4;
      ctx.strokeText(t.text, Math.floor(t.x), Math.floor(t.y));

      // Заливка текста
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, Math.floor(t.x), Math.floor(t.y));
      ctx.restore();
    }

    // 4. Отрисовка Hit Flash поверх экрана
    if (this.flashAlpha > 0 && this.flashColor) {
      ctx.save();
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillStyle = this.flashColor;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Вспомогательный метод рисования пиксельного кольца (shockwave)
   */
  _drawPixelCircle(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  /**
   * Сбросить все эффекты
   */
  clear() {
    this.particles = [];
    this.floatingTexts = [];
    this.rings = [];
    this.shakeIntensity = 0;
    this.shakeTimer = 0;
    this.flashAlpha = 0;
  }
}

// Экземпляр и синглтон-вызов createFx для совместимости с кодом и библиотекой pixelfx
let fxInstance = null;

export function initPixelFX(canvas) {
  fxInstance = new PixelFX(canvas);
  return fxInstance;
}

export function getPixelFX() {
  return fxInstance;
}

/**
 * Глобальный фасад вызова создания эффекта
 * @param {'damage'|'reward'|'coins'|'crit'|'sparkle'} type 
 * @param {number} x 
 * @param {number} y 
 * @param {Object} options 
 */
export function createFx(type, x, y, options) {
  if (fxInstance) {
    fxInstance.createFx(type, x, y, options);
  } else {
    console.warn('[PixelFX] fxInstance не инициализирован. Вызовите initPixelFX(canvas)');
  }
}

```

