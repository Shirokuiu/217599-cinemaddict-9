import Film from "../components/film";

import {render} from "../utils";

export default class MovieController {
  constructor(container, filmData, onDataChangeFilms) {
    this._titleLength = 139;
    this._filmData = filmData;
    this._onDataChangeFilms = onDataChangeFilms;
    this._container = container;
    this._film = new Film(this._filmData, this._titleLength);
  }

  init() {
    render(this._container, this._film.getElement());

    this._film.getElement().querySelector(`.film-card__controls`)
      .addEventListener(`click`, this._onFilmCardControlsClick.bind(this));
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

    this._onDataChangeFilms(entry, this._filmData.id);
  }

  _makeEntry(filmData) {
    return Object.assign({}, filmData);
  }
}
