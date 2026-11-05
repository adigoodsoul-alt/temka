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
      // Возвращаемся в предыдущее состояние (или EXPLORATION)
      if (this.player.isAlive()) {
        this.gsm.setState(GameStates.EXPLORATION);
      }
    });

    events.on('GAME_OVER', ({ reason }) => {
      this.gsm.setState(GameStates.GAME_OVER, { reason });
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
      [GameStates.GAME_OVER]: '💀 БАНКРОТСТВО'
    };

    const currentState = this.gsm.getState();
    const moneyPercent = Math.min(100, Math.max(0, (this.player.money / this.player.maxMoney) * 100));

    hud.innerHTML = `
      <div class="hud-left">
        <div class="hud-logo">
          <span class="pixel-badge">ТЕМЩИК v0.1</span>
        </div>
        <div class="hud-state-pill" id="hud-state-label">
          ${stateLabels[currentState] || currentState}
        </div>
      </div>

      <div class="hud-center">
        <!-- БАЛАНС = ХП -->
        <div class="money-container" id="money-container" title="Деньги — это ваша жизнь. Падение до нуля означает Game Over!">
          <div class="money-label">БАЛАНС (ХП):</div>
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
   * 2. Экран Вылазки (Exploration)
   */
  renderExplorationView(container) {
    container.innerHTML = `
      <div class="panel exploration-panel">
        <div class="panel-header">
          <h2>📍 ВЫЛАЗКА: КРИМИНАЛЬНЫЙ РАЙОН</h2>
        </div>
        <div class="panel-body">
          <p class="flavor-text">
            Город живет своей суетливой жизнью. Патрули ППС, тонированные внедорожники 
            и неприметные кофейни. Выберите точку интереса для проведения сделки:
          </p>

          <div class="poi-grid">
            <div class="poi-card" data-event-id="obep_raid">
              <div class="poi-icon">🚨</div>
              <div class="poi-info">
                <h3>Офис дроповодов</h3>
                <p>Тревожные сигналы от дроп-менеджеров. Возможна облава силовиков.</p>
                <span class="poi-badge danger">Высокий риск</span>
              </div>
            </div>

            <div class="poi-card" data-event-id="crypto_otc_deal">
              <div class="poi-icon">💎</div>
              <div class="poi-info">
                <h3>Москва-Сити, Башня Федерация</h3>
                <p>Артур предлагает горячий объем USDT со скидкой 6%.</p>
                <span class="poi-badge warning">Средний риск</span>
              </div>
            </div>

            <div class="poi-card" data-event-id="shady_banker">
              <div class="poi-icon">🏦</div>
              <div class="poi-info">
                <h3>Отделение банка на Ленинском</h3>
                <p>Заморозка счета по 115-ФЗ. Нужно решить вопрос на месте.</p>
                <span class="poi-badge info">Проверка связей</span>
              </div>
            </div>
          </div>

          <div class="exploration-footer">
            <button class="pixel-btn" id="btn-back-to-hub">
              🏠 Вернуться в Убежище
            </button>
          </div>
        </div>
      </div>
    `;

    // Клик по точкам интереса
    container.querySelectorAll('.poi-card').forEach((card) => {
      card.addEventListener('click', () => {
        const eventId = card.getAttribute('data-event-id');
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
}
