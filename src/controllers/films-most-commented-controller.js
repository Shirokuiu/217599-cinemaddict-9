import MovieController from "./movie-controller";

import FilmsListCommented from "../components/films-list-commented";

import {render, unrender} from "../utils";

export default class FilmsMostCommentedController {
  constructor(container, filmsData, onAppDataChange, onFilmClickChange) {
    this._onAppDataChange = onAppDataChange;
    this._onFilmClickChange = onFilmClickChange;
    this._container = container;
    this._filmsData = filmsData;

    this._filmListCommented = new FilmsListCommented();

    this._init();
  }

  _init() {
    render(this._container, this._filmListCommented.getElement());

    this._setTopCommented(this._filmsData);
  }

  update(updatedData) {
    unrender(this._filmListCommented.getElement());
    this._filmListCommented.removeElement();

    this._updateData(this._container, updatedData);
  }

  show() {
    if (this._filmListCommented.getElement().classList.contains(`visually-hidden`)) {
      this._filmListCommented.getElement().classList.remove(`visually-hidden`);
    }
  }

  hide() {
    this._filmListCommented.getElement().classList.add(`visually-hidden`);
  }

  _updateData(container, updatedData) {
    this._filmsData = updatedData;

    this._updateView(container, this._filmsData);
  }

  _updateView(container, updatedData) {
    this._filmListCommented = new FilmsListCommented();

    render(container, this._filmListCommented.getElement());
    this._setTopCommented(updatedData);
  }

  _setTopCommented(filmsData) {
    filmsData.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, 2)
      .forEach((film) => this._renderFilm(this._filmListCommented.getElement()
        .querySelector(`.films-list__container`), film));
  }

  _renderFilm(container, filmsData) {
    const movieController = new MovieController(
        container,
        filmsData,
        this._onAppDataChange,
        `widget`,
        this._onFilmClickChange
    );

    movieController.init();
  }
}
