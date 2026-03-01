/**
 * Mini event emitter (<500 bytes minifié)
 * Events: consent:update, consent:accept-all, consent:reject-all, banner:show, banner:hide
 */
export function createEmitter() {
  const listeners = {};

  return {
    on(event, fn) {
      (listeners[event] || (listeners[event] = [])).push(fn);
    },

    off(event, fn) {
      const list = listeners[event];
      if (list) listeners[event] = list.filter(f => f !== fn);
    },

    emit(event, data) {
      const list = listeners[event];
      if (list) list.forEach(fn => fn(data));
    }
  };
}
