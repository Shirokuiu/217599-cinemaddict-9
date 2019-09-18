import MovieController from "./movie-controller";

import FilmsList from "../components/films-list";
import NoResult from "../components/no-result";
import LoadMore from "../components/load-more";

import {AppSettings, Position, render, unrender} from "../utils";

export default class FilmsController {
  constructor(container, authorization, endPoint, commentEmotions) {
    this._authorization = authorization;
    this._endPoint = endPoint;
    this._commentEmotions = commentEmotions;
    this._filmsData = [];
    this._container = container;
    this._startLoad = 0;
    this._loadedFilms = AppSettings.FILMS_TO_ROW;
    this._sortClicked = false;

    this._filmsList = new FilmsList();
    this._noResult = new NoResult();
    this._loadMore = new LoadMore();
  }

  show(filmsData) {
    if (filmsData !== this._filmsData && filmsData.length > AppSettings.FILMS_TO_ROW && !this._sortClicked) {
      unrender(this._filmsList.getElement());
      this._filmsList.removeElement();

      render(this._container, this._filmsList.getElement(), Position.AFTERBEGIN);
      render(this._filmsList.getElement(), this._loadMore.getElement());

      this._loadMore.getElement().addEventListener(`click`, this._onLoadMoreClick.bind(this));

      this._setFilmsData(filmsData);
      this._showFilms(filmsData);
    } else {
      unrender(this._filmsList.getElement());
      this._filmsList.removeElement();

      render(this._container, this._filmsList.getElement(), Position.AFTERBEGIN);
      if (filmsData.length > this._loadedFilms) {
        render(this._filmsList.getElement(), this._loadMore.getElement());
      }

      this._showFilms(filmsData);
    }

    if (!filmsData.length) {
      this._filmsList.getElement().querySelector(`.films-list__container`).classList.add(`visually-hidden`);
      this._renderNoResult(false, `no-result`, this._filmsList.getElement());
    } else {
      this._renderNoResult(true, `no-result`, this._filmsList.getElement());

      this._filmsList.getElement().querySelector(`.films-list__container`).classList.remove(`visually-hidden`);
    }
  }

  hide() {
    unrender(this._filmsList.getElement());
    this._filmsList.removeElement();
  }

  onMenuDataChange() {
    this._sortClicked = false;
    unrender(this._loadMore.getElement());
    this._loadMore.removeElement();

    this._loadedFilms = AppSettings.FILMS_TO_ROW;
    render(this._filmsList.getElement(), this._loadMore.getElement());
  }

  onSortDataChange() {
    this._sortClicked = true;
  }

  _setFilmsData(filmsData) {
    this._filmsData = filmsData;
  }

  _renderFilm(container, filmData) {
    const movieController = new MovieController(container, filmData, this._authorization, this._endPoint, this._commentEmotions);

    movieController.init();
  }

  _showFilms(filmsData, start = this._startLoad, loaded = this._loadedFilms, mode = `default`) {
    let showedFilms = [];

    switch (mode) {
      case `default`:
        showedFilms = filmsData.slice(start, loaded).forEach((film) => this._renderFilm(this._filmsList
          .getElement().querySelector(`.films-list__container`), film));
        break;
    }

    return {
      showedFilms,
      loaded
    };
  }

  _onLoadMoreClick() {
    unrender(this._filmsList.getElement());
    unrender(this._loadMore.getElement());
    this._filmsList.removeElement();
    this._loadMore.removeElement();

    render(this._container, this._filmsList.getElement(), Position.AFTERBEGIN);
    render(this._filmsList.getElement(), this._loadMore.getElement());

    this._loadMore.getElement().addEventListener(`click`, this._onLoadMoreClick.bind(this));
    this._loadedFilms += AppSettings.FILMS_TO_ROW;
    this._showFilms(this._filmsData);

    if (this._filmsData.length < this._loadedFilms) {
      unrender(this._loadMore.getElement());
      this._loadMore.removeElement();
    }
  }

  _renderNoResult(remove = false, state = `no-result`, container) {
    unrender(this._noResult.getElement());
    this._noResult.removeElement();
    if (remove) {
      return;
    }
    this._noResult = new NoResult(this._setNoResultText(state));
    render(container, this._noResult.getElement());
  }

  _setNoResultText(state) {
    let resultText = ``;

    switch (state) {
      case `loading`:
        resultText = `Loading…`;
        break;
      case `no-result`:
        resultText = `There is no movies for your request.`;
        break;
    }
    return resultText;
  }
}
