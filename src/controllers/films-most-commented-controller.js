import MovieController from "./movie-controller";

import FilmsListCommented from "../components/films-list-commented";

import {render, unrender} from "../utils";

export default class FilmsMostCommentedController {
  constructor(container) {
    this._container = container;
    this._filmListCommented = new FilmsListCommented();
  }

  show(filmsData) {
    unrender(this._filmListCommented.getElement());
    this._filmListCommented.removeElement();

    render(this._container, this._filmListCommented.getElement());
    this._setTopCommented(filmsData);
  }

  hide() {
    unrender(this._filmListCommented.getElement());
    this._filmListCommented.removeElement();
  }

  _setTopCommented(filmsData) {
    filmsData.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, 2)
      .forEach((film) => this._renderFilm(this._filmListCommented.getElement()
        .querySelector(`.films-list__container`), film));
  }

  _renderFilm(container, filmsData) {
    const movieController = new MovieController(container, filmsData);

    movieController.init();
  }
}
