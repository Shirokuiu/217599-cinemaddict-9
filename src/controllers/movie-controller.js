import FilmPopupController from "./film-popup-controller";

import Film from "../components/film";

import {getTimeFromMinutes, render} from "../utils";

export default class MovieController {
  constructor(container, filmData, authorization, endPoint, commentEmotions) {
    this._authorization = authorization;
    this._endPoint = endPoint;
    this._commentEmotions = commentEmotions;
    this._titleLength = 139;
    this._filmData = filmData;
    this._container = container;
    this._film = new Film(this._filmData, this._titleLength, getTimeFromMinutes(this._filmData.filmInfo.runtime));
    this._filmPopupController =
      new FilmPopupController(
          this._commentEmotions,
          getTimeFromMinutes(this._filmData.filmInfo.runtime),
          this._authorization,
          this._endPoint
      );
  }

  init() {
    this._film.getElement().querySelector(`.film-card__controls`)
      .addEventListener(`click`, this._onFilmCardControlsClick.bind(this));

    [...this._film.getElement().querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`)]
      .forEach((item) => item.addEventListener(`click`, () => {
        document.body.classList.add(`hide-overflow`);
        this._filmPopupController.show(this._filmData);
      }));

    render(this._container, this._film.getElement());
  }

  _onFilmCardControlsClick(evt) {
    evt.preventDefault();

    const entry = this._makeEntry(this._filmData);

    evt.target.classList.toggle(`film-card__controls-item--active`);

    entry.watchlist = this._film.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).classList
      .contains(`film-card__controls-item--active`);
    entry.watched = this._film.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).classList
      .contains(`film-card__controls-item--active`);
    entry.favorite = this._film.getElement().querySelector(`.film-card__controls-item--favorite`).classList
      .contains(`film-card__controls-item--active`);
  }

  _makeEntry(filmData) {
    return Object.assign({}, filmData);
  }
}
