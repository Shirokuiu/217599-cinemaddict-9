import FilmsList from "../components/films-list";

import MovieController from "./movie-controller";

import {Position, render, unrender} from "../utils";
import NoResult from "../components/no-result";

export default class FilmsController {
  constructor(container, authorization, endPoint, commentEmotions) {
    this._authorization = authorization;
    this._endPoint = endPoint;
    this._commentEmotions = commentEmotions;
    this._filmsData = [];
    this._container = container;
    this._filmsList = new FilmsList();
    this._noResult = new NoResult();
  }

  show(filmsData) {
    if (filmsData !== this._filmsData) {
      unrender(this._filmsList.getElement());
      this._filmsList.removeElement();

      render(this._container, this._filmsList.getElement(), Position.AFTERBEGIN);
      this._setFilmsData(filmsData);
    }

    if (!filmsData.length) {
      this._filmsList.getElement().querySelector(`.films-list__container`).classList.add(`visually-hidden`);

      render(this._filmsList.getElement(), this._noResult.getElement());
    } else {
      unrender(this._noResult.getElement());
      this._noResult.removeElement();

      this._filmsList.getElement().querySelector(`.films-list__container`).classList.remove(`visually-hidden`);
    }
  }

  hide() {
    unrender(this._filmsList.getElement());
    this._filmsList.removeElement();
  }

  _setFilmsData(filmsData) {
    this._filmsData = filmsData;
    filmsData.forEach((film) => this._renderFilm(this._filmsList.getElement().querySelector(`.films-list__container`), film));
  }

  _renderFilm(container, filmData) {
    const movieController = new MovieController(container, filmData, this._authorization, this._endPoint, this._commentEmotions);

    movieController.init();
  }
}
