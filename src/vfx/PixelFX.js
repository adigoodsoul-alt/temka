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
