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
