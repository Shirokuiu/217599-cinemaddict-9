import PopupRate from "../components/popup-rate";

import FilmModel from "../models/film-model";

import {render, unrender} from "../utils";

export default class PopupRateController {
  constructor(container, filmData, onAppDataChange) {
    this._onAppDataChange = onAppDataChange;
    this._container = container;
    this._filmData = filmData;

    this._popupRate = new PopupRate(this._filmData);

    this._init();
  }

  _init() {
    render(this._container, this._popupRate.getElement());

    this._popupRate.getElement().addEventListener(`click`, this._onSelectRateClick.bind(this));
    this._popupRate.getElement().querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, this._onUndoClick.bind(this));
  }

  update(updatedData) {
    unrender(this._popupRate.getElement());
    this._popupRate.removeElement();

    this._updateData(this._container, updatedData);
  }

  _updateData(container, updatedData) {
    this._filmData = updatedData;

    this._updateView(container, this._filmData);

    this._popupRate.getElement().addEventListener(`click`, this._onSelectRateClick.bind(this));
    this._popupRate.getElement().querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, this._onUndoClick.bind(this));
  }

  _updateView(container, updatedData) {
    this._popupRate = new PopupRate(updatedData);

    render(container, this._popupRate.getElement());
  }

  _onUndoClick() {
    [...this._popupRate.getElement().querySelectorAll(`.film-details__user-rating-input`)].forEach((item) => {
      item.checked = false;
    });
    this._setRate(0);
  }

  _onSelectRateClick(evt) {
    if (evt.target.tagName.toLowerCase() !== `input`) {
      return;
    }
    this._setRate(+evt.target.value);
  }

  _setRate(rateValue) {
    const filmModel = new FilmModel(this._filmData.toRAW());

    filmModel.userDetails.personalRating = rateValue;
    this._onAppDataChange(`update-rate`, filmModel);
    this.block();
  }

  block() {
    this._popupRate.getElement().style.opacity = `0.5`;
    this._popupRate.getElement().querySelectorAll(`.film-details__user-rating-input`).disabled = true;
  }

  unblock() {
    this._popupRate.getElement().style.opacity = `1`;
    this._popupRate.getElement().querySelectorAll(`.film-details__user-rating-input`).disabled = false;
  }

  onError(filmData) {
    this.update(filmData);
    this.unblock();
  }
}
