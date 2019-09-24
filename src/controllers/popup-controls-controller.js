import PopupControls from "../components/popup-controls";

import {render, unrender} from "../utils";
import FilmModel from "../models/film-model";

export default class PopupControlsController {
  constructor(container, filmData, onControlsDataChanged, onControlsDataChange, onAppDataChange) {
    this._onControlsDataChanged = onControlsDataChanged;
    this._onControlsDataChange = onControlsDataChange;
    this._onAppDataChange = onAppDataChange;
    this._container = container;
    this._filmData = filmData;

    this._popupControls = new PopupControls(this._filmData.userDetails);

    this._init();
  }

  _init() {
    render(this._container, this._popupControls.getElement());
    this._popupControls.getElement().addEventListener(`click`, this._onControlsClick.bind(this));
  }

  update(updatedData) {
    unrender(this._popupControls.getElement());
    this._popupControls.removeElement();

    this._updateData(this._container, updatedData);
  }

  _updateData(container, updatedData) {
    this._filmData = updatedData;

    this._updateView(container, this._filmData);
  }

  _updateView(container, updatedData) {
    this._popupControls = new PopupControls(updatedData.userDetails);

    render(container, this._popupControls.getElement());
    this._popupControls.getElement().addEventListener(`click`, this._onControlsClick.bind(this));

    this._onControlsDataChanged(this._filmData.userDetails.alreadyWatched);
  }

  _block() {
    this._popupControls.getElement().style.opacity = `0.5`;
    [...this._popupControls.getElement().querySelectorAll(`.film-details__control-input`)].forEach((control) => {
      control.disabled = true;
    });
  }

  _onControlsClick(evt) {
    if (evt.target.tagName.toLowerCase() !== `input`) {
      return;
    }
    const filmModel = new FilmModel(this._filmData.toRAW());

    filmModel.userDetails.watchlist = this._popupControls.getElement().querySelector(`#watchlist`).checked;
    filmModel.userDetails.alreadyWatched = this._popupControls.getElement().querySelector(`#watched`).checked;
    filmModel.userDetails.favorite = this._popupControls.getElement().querySelector(`#favorite`).checked;

    this._onControlsDataChange(evt.target.id);
    this._onAppDataChange(`update`, filmModel, `popup`);
    this._block();
  }

  onError(filmData) {
    this.update(filmData);
  }
}
