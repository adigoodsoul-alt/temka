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
