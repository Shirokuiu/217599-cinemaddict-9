import FilmsList from "../components/films-list";

import MovieController from "./movie-controller";

import {render} from "../utils";

export default class FilmsController {
  constructor(container, filmsData, onDataChangeFilms) {
    this._filmsData = filmsData;
    this._onDataChangeFilms = onDataChangeFilms;
    this._container = container;
    this._filmsList = new FilmsList();
  }

  init() {
    render(this._container.querySelector(`.films`), this._filmsList.getElement());
    this._filmsData.forEach((film) => this._renderFilm(this._container.querySelector(`.films-list__container`), film));
  }

  _renderFilm(container, filmData) {
    const movieController = new MovieController(container, filmData, this._onDataChangeFilms);

    movieController.init();
  }
}
