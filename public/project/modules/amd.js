/**
 * Asynchronous Module Definition module.
 * @module amd/
 */


(function () {

  /**
   * Несколько плюсов такого подхода:
   * - независимость от порядка загрузки скриптов;
   * - модули подгружаются тогда, когда в них, действительно, есть необходимость;
   * - гарантия того, что необходимые модули будут подгружены;
   * - уже загруженные модули берутся из переменной modules, а не загружаются заново (кэширование);
   * - отсутствие глобальных переменных для экспорта;
   *
   */

  const modules = {};
  const factories = {};

  /**
   * Get module by name
   * @param {string} name - module name
   * @return {*|null}
   */
  window.require = function (name) {
    return modules[name] || factories[name] && (modules[name] = factories[name](require)) || null;
  };

  /**
   * Set module with name
   * @param {string} name - module name
   * @param {function} factory - module's constructor
   */
  window.define = function (name, factory) {
    factories[name] = factory;
  };

})();
