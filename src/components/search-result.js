import Component from "./component";

export default class SearchResult extends Component {
  constructor(filmsData) {
    super();
    this._result = filmsData ? filmsData : [];
  }

  getTemplate() {
    return `<div class="result">
    <p class="result__text">Result <span class="result__count">${this._result.length}</span></p>
  </div>`;
  }
}
