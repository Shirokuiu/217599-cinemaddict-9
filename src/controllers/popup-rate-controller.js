import PopupRate from "../components/popup-rate";

import {render, unrender} from "../utils";

export default class PopupRateController {
  constructor(container, onSelectRateDataChange) {
    this._onSelectRateDataChange = onSelectRateDataChange;
    this._container = container;
    this._filmData = [];
    this._popupRate = new PopupRate();
  }

  show(filmData) {
    if (filmData !== this._filmData) {
      unrender(this._popupRate.getElement());
      this._popupRate.removeElement();

      this._setRateData(filmData);
    }
  }

  _setRateData(filmData) {
    this._filmData = filmData;
    this._renderPopupRate(this._container, this._filmData);
  }

  _renderPopupRate(container, filmData) {
    this._popupRate = new PopupRate(filmData);

    this._popupRate.getElement().addEventListener(`click`, this._onSelectRateClick.bind(this));
    this._popupRate.getElement().querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, this._onUndoClick.bind(this));

    render(container, this._popupRate.getElement());
  }

  _onUndoClick() {
    [...this._popupRate.getElement().querySelectorAll(`.film-details__user-rating-input`)].forEach((item) => {
      item.checked = false;
    });

    this._onSelectRateDataChange(0);
  }

  _onSelectRateClick(evt) {
    if (evt.target.tagName.toLowerCase() !== `input`) {
      return;
    }
    this._onSelectRateDataChange(+evt.target.value);
  }
}
