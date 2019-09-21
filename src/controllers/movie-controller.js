import FilmPopupController from "./film-popup-controller";

import Film from "../components/film";

import {AppSettings, getTimeFromMinutes, parseWatchingDate, render} from "../utils";

import moment from "moment";

export default class MovieController {
  constructor(container, filmData, onAppDataChange, context, searchMode) {
    this._onAppDataChange = onAppDataChange;
    this._descriptionLength = AppSettings.PREVIEW_DESCRIPTION_LENGTH;
    this._filmData = filmData;
    this._container = container;
    this._context = context;
    this._searchMode = searchMode;

    this._film = new Film(this._filmData, this._descriptionLength, getTimeFromMinutes(this._filmData.filmInfo.runtime));
    this._filmPopupController = new FilmPopupController(onAppDataChange);
  }

  init() {
    this._film.getElement().querySelector(`.film-card__controls`)
      .addEventListener(`click`, this._onFilmControlsClick.bind(this));

    [...this._film.getElement().querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`)]
      .forEach((item) => item.addEventListener(`click`, () => {
        document.body.classList.add(`hide-overflow`);
        this._filmPopupController.show(this._filmData);
      }));

    render(this._container, this._film.getElement());
  }

  _onFilmControlsClick(evt) {
    evt.preventDefault();

    evt.target.classList.toggle(`film-card__controls-item--active`);

    this._filmData.userDetails.watchlist = this._film.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .classList.contains(`film-card__controls-item--active`);
    this._filmData.userDetails.alreadyWatched = this._film.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .classList.contains(`film-card__controls-item--active`);
    this._filmData.userDetails.favorite = this._film.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .classList.contains(`film-card__controls-item--active`);
    this._filmData.userDetails.watchingDate = parseWatchingDate(this._filmData);

    this._onAppDataChange(`update`, this._filmData, this._context, this._searchMode);
  }
}
