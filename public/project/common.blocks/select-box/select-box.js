import eventBus from '../../modules/event-bus.js';
import selectBoxTemplate from './select-box.tmpl.pug';

export default class SelectBoxBlock {

  constructor(el, attrs, onChangeEvent) {
    this._el = el;
    this._attrs = attrs;
    this._onChangeEvent = onChangeEvent;
  }

  init() {
    this.selectBox = this._el.getElementsByClassName('selector')[0];

    // Close selectbox if clicked elsewhere
    document.addEventListener('click', this.closeSelectBox.bind(this));

    this.convertSelectBox();

    this.selectboxOptions = this._el.getElementsByClassName('selectbox-options')[0];

    this.wrapSelectBox();

    // Fix dropdown
    this._label = this._el.getElementsByClassName('selectbox__label')[0];
    this._label.addEventListener('click', this.onClickLabel.bind(this._label));
  }

  clear() {
    this._el.innerHTML = '';
  }

  render(attrs) {
    this._attrs = attrs || this._attrs;
    this._el.innerHTML = selectBoxTemplate(this._attrs);
  }

  // Helper functions

  static _insertAfter(_ref, _new)  {
    _ref.parentNode.insertBefore(_new, _ref.nextSibling);
  }

  static _hasClass(el, cls)  {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  closeSelectBox()  {
    this.selectboxOptions.setAttribute('class', 'selectbox-options selectbox-options--hidden');
  }



  convertSelectBox() {

    this.selectBox.required = true;

    // For mobiles... We need to change our new selectboxes based on values of that old ones
    this.selectBox.addEventListener('change', this.onChangeOption.bind(this.selectBox));

    // Get all <option> from each selectbox
    let options = this.selectBox.options;

    let newSelect = document.createElement('div');
    newSelect.setAttribute('class', 'selectbox');

    // Add a data-pair attribute for a new selectbox so we can pair options values
    // from the original one and this new one together - we need to know which
    // selectbox was clicked/changed.
    newSelect.setAttribute('data-pair', 'select-1');

    let label = document.createElement('div');
    label.setAttribute('class', 'selectbox__label');
    newSelect.appendChild(label);

    let wrap = document.createElement('div');
    wrap.setAttribute('class', 'selectbox-options selectbox-options--hidden');

    // Grab option values into our new dropdown
    for (let j = 0; j < options.length; j++) {
      let option = document.createElement('div');
      option.setAttribute('class', 'selectbox__option');
      option.setAttribute('data-value', options[j].value);

      // Is option selected?
      if (options[j].selected === true) {
        option.setAttribute('class', option.className + ' selectbox__option--selected');

        // Set a selected option's text into the label
        label.innerHTML = options[j].text;
      }

      // Don't show a disabled option in the list, it's just used in the label and in the original input
      if (!options[j].disabled) {
        option.innerHTML = options[j].text;
        wrap.appendChild(option);
        newSelect.appendChild(wrap);
      }

    }
    
    SelectBoxBlock._insertAfter(this.selectBox, newSelect);
    this.selectBox.setAttribute('data-sid', 'select-1');
    this.selectBox.style.display = 'none';
  }

  onChangeOption() {
    let target = document.getElementsByClassName('selectbox__label');
    let val = this.value;
    let pairId = this.dataset.sid;
    let opts = this.options;

    // Go through all labels...
    for (let a = 0; a < target.length; a++) {

      // Find the right one based on pair id
      if (target[a].parentElement.dataset.pair === pairId) {

        // Go through all options
        for (let b = 0; b < opts.length; b++) {

          // Find the right one by its value
          if (opts[b].value === val) {

            // Set a text
            target[a].innerHTML = opts[b].innerHTML;
            break;
          }
        }

        break;
      }
    }

    eventBus.emit('change-theme', this.value);
  }

  wrapSelectBox() {

    // Wrap selectbox elements, needed to mobile-click works properly

    let container = document.createElement('div');
    container.setAttribute('class', 'selector-container');

    let box = this._el.getElementsByClassName('selectbox')[0];

    this.selectBox.parentElement.insertBefore(container, this.selectBox);
    box.parentElement.insertBefore(container, box);
    container.appendChild(this.selectBox);
    container.appendChild(box);
  }

  onClickLabel(event) {

    // Don't close selectbox if user clicks on it
    event.stopPropagation();

    let _this = this;
    let _options = this.nextSibling;
    let _option = _options.children;

    // Should it be shown or hidden after this click?
    if (SelectBoxBlock._hasClass(_options, 'selectbox-options--hidden')) {
      _options.setAttribute('class', 'selectbox-options');
    } else {
      _options.setAttribute('class', 'selectbox-options selectbox-options--hidden');
    }

    // Clickable options
    for (let o = 0; o < _option.length; o++) {
      _option[o].onclick = function() {

        // Unset selected class
        for (let s = 0; s < _option.length; s++) {
          if (s !== o) {
            _option[s].setAttribute('class', 'selectbox__option');
          }
        }

        // Change label and set a new selected class for current item
        _this.innerHTML = this.innerHTML;
        this.setAttribute('class', 'selectbox__option selectbox__option--selected');

        // Set selected value to the original selectbox
        let sel = document.querySelectorAll('[data-sid="' + _this.parentElement.dataset.pair + '"]');
        sel[0].value = this.dataset.value;

        // Close the box
        _options.setAttribute('class', 'selectbox-options selectbox-options--hidden');

        eventBus.emit('change-theme', this.dataset.value);

      };
    }

  }

}

