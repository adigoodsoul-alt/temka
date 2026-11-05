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
