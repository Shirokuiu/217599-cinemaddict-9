import Component from "./component";

export default class NoResult extends Component {
  constructor(text) {
    super();
    this._text = text;
  }

  getTemplate() {
    return `<div class="no-result">${this._text}</div>`;
  }
}
