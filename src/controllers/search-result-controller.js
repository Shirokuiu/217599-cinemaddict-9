import SearchResult from "../components/search-result";

import {Position, render, unrender} from "../utils";

export default class SearchResultController {
  constructor(container) {
    this.filmsData = [];
    this._container = container;
    this._searchResult = new SearchResult();
  }

  show(filmsData) {
    unrender(this._searchResult.getElement());
    this._searchResult.removeElement();

    this._setSearchResultData(filmsData);
  }

  hide() {
    unrender(this._searchResult.getElement());
    this._searchResult.removeElement();
  }

  _setSearchResultData(filmsData) {
    this.filmsData = filmsData;
    this._renderResult(this._container, filmsData);
  }

  _renderResult(container, filmsData) {
    this._searchResult = new SearchResult(filmsData);

    render(container, this._searchResult.getElement(), Position.AFTERBEGIN);
  }
}
