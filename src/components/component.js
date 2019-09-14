import {createElement} from '../utils';

export default class Component {
  constructor() {
    this._element = null;
  }

  set element(value) {
    this._element = value;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement(value = null) {
    this.element = value;
  }

  getTemplate() {
    throw Error(`Abstract method not implemented`);
  }
}
