import MovieController from "./movie-controller";

import FilmListRated from "../components/film-list-rated";

import {render, unrender} from "../utils";

export default class FilmsTopRatedController {
  constructor(container, authorization, endPoint, commentEmotions) {
    this._authorization = authorization;
    this._endPoint = endPoint;
    this._commentEmotions = commentEmotions;
    this._container = container;
    this._filmListRated = new FilmListRated();
  }

  show(filmsData) {
    unrender(this._filmListRated.getElement());
    this._filmListRated.removeElement();

    render(this._container, this._filmListRated.getElement());
    this._setTopRated(filmsData);
  }

  hide() {
    unrender(this._filmListRated.getElement());
    this._filmListRated.removeElement();
  }

  _setTopRated(filmsData) {
    filmsData.slice().sort((a, b) => (b.filmInfo.totalRating * 100) - (a.filmInfo.totalRating * 100)).slice(0, 2)
      .forEach((film) => this._renderFilm(this._filmListRated.getElement()
      .querySelector(`.films-list__container`), film));
  }

  _renderFilm(container, filmsData) {
    const movieController = new MovieController(container, filmsData, this._authorization, this._endPoint, this._commentEmotions);

    movieController.init();
  }
}
