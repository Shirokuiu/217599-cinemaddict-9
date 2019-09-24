import MovieController from "./movie-controller";

import FilmListRated from "../components/film-list-rated";

import {render, unrender} from "../utils";

export default class FilmsTopRatedController {
  constructor(container, filmsData, onAppDataChange, onFilmClickChange) {
    this._onAppDataChange = onAppDataChange;
    this._onFilmClickChange = onFilmClickChange;
    this._container = container;
    this._filmsData = filmsData;

    this._filmListRated = new FilmListRated();

    this._init();
  }

  _init() {
    render(this._container, this._filmListRated.getElement());

    this._setTopRated(this._filmsData);
  }

  update(updatedFilms) {
    unrender(this._filmListRated.getElement());
    this._filmListRated.removeElement();

    this._updateData(this._container, updatedFilms);
  }

  show() {
    if (this._filmListRated.getElement().classList.contains(`visually-hidden`)) {
      this._filmListRated.getElement().classList.remove(`visually-hidden`);
    }
  }

  hide() {
    this._filmListRated.getElement().classList.add(`visually-hidden`);
  }

  _updateData(container, updatedFilms) {
    this._filmsData = updatedFilms;

    this._updateView(container, this._filmsData);
  }

  _updateView(container, updatedFilms) {
    this._filmListRated = new FilmListRated();

    render(container, this._filmListRated.getElement());

    this._setTopRated(updatedFilms);
  }

  _setTopRated(filmsData) {
    filmsData.slice().sort((a, b) => (b.filmInfo.totalRating * 100) - (a.filmInfo.totalRating * 100)).slice(0, 2)
      .forEach((film) => this._renderFilm(this._filmListRated.getElement()
      .querySelector(`.films-list__container`), film));
  }

  _renderFilm(container, filmsData) {
    const movieController = new MovieController(container, filmsData, this._onAppDataChange, `widget`, this._onFilmClickChange);

    movieController.init();
  }
}
