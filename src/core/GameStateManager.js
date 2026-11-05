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
