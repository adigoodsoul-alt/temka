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
