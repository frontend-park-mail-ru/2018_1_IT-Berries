/**
 * Event bus module (singleton mediator pattern)
 * @module bus/
 */


define('bus', function (require) {

  return new class Bus {
    constructor() {
      this.listeners = {};
    }

    /**
     * Subcribe on event.
     * @access public
     * @param {string} event - event name.
     * @param {function} listener - subscriber's function to execute when event will be emitted.
     */
    on(event, listener) {
      (this.listeners[event] || (this.listeners[event] = [])).push(listener);
      return this;
    }

    /**
     * Unsubcribe from event.
     * @access public
     * @param {string} event - event name.
     * @param {function} listener - subscriber's function.
     */
    off(event, listener) {
      if (listener) {
        this.listeners[event] = (this.listeners[event] || []).filter(l => l !== listener);
      } else {
        this.listeners[event] = [];
      }
      return this;
    }

    /**
     * Emit event.
     * @access public
     * @param {string} event - event name.
     * @param {object} data - argument for subscriber's function.
     */
    emit(event, data) {
      (this.listeners[event] || (this.listeners[event] = [])).forEach(l => l(data));
      return this;
    }
  };

});