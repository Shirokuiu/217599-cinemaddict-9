import MovieController from "./movie-controller";

import FilmsList from "../components/films-list";
import NoResult from "../components/no-result";
import LoadMore from "../components/load-more";

import {AppSettings, Position, render, setNoResultText, unrender} from "../utils";

export default class FilmsController {
  constructor(container, onAppDataChange) {
    this._onAppDataChange = onAppDataChange;
    this._filmsData = [];
    this._container = container;
    this._startLoad = 0;
    this._loadedFilms = AppSettings.FILMS_TO_ROW;

    this._filmsList = new FilmsList();
    this._noResult = new NoResult();
    this._loadMore = new LoadMore();
  }

  show(filmsData) {
    if (filmsData !== this._filmsData) {
      this._updateFilmList();

      this._setFilmsData(filmsData);
    }

    if (filmsData.length > AppSettings.FILMS_TO_ROW) {
      render(this._filmsList.getElement(), this._loadMore.getElement());
      this._loadMore.getElement().addEventListener(`click`, this._onLoadMoreClick.bind(this));
    }

    if (!filmsData.length) {
      this._filmsList.getElement().querySelector(`.films-list__container`).classList.add(`visually-hidden`);
      this._renderNoResult(false, `no-result`);
    } else {
      this._renderNoResult(true, `no-result`);
      this._filmsList.getElement().querySelector(`.films-list__container`).classList.remove(`visually-hidden`);
    }
  }

  hide() {
    this._updateFilmList(true);
  }

  onMenuDataChange() {
    this._updateLoadMoreButton();
  }

  onSortDataChange() {
    this._updateLoadMoreButton();
  }

  searchMode(status, filmsData) {
    if (status) {
      this._updateLoadMoreButton(status);
      this._updateFilmList();
      filmsData.forEach((film) => this._renderFilm(this._filmsList
        .getElement().querySelector(`.films-list__container`), film));
      if (!filmsData.length) {
        this._renderNoResult(false, `no-result`);
      }
    }
  }

  _setFilmsData(filmsData) {
    this._filmsData = filmsData;
    filmsData.slice(this._startLoad, AppSettings.FILMS_TO_ROW).forEach((film) => this._renderFilm(this._filmsList
      .getElement().querySelector(`.films-list__container`), film));
  }

  _renderFilm(container, filmData) {
    const movieController = new MovieController(container, filmData, this._onAppDataChange);

    movieController.init();
  }

  _onLoadMoreClick() {
    const copyData = this._filmsData.slice();

    copyData.slice(this._loadedFilms, this._loadedFilms + AppSettings.FILMS_TO_ROW)
      .forEach((film) => this._renderFilm(this._filmsList
      .getElement().querySelector(`.films-list__container`), film));

    this._loadedFilms += AppSettings.FILMS_TO_ROW;
    if (this._filmsData.length <= this._loadedFilms) {
      this._updateLoadMoreButton(true);
    }
  }

  _updateLoadMoreButton(remove = false) {
    unrender(this._loadMore.getElement());
    this._loadMore.removeElement();
    if (remove) {
      return;
    }
    this._loadedFilms = AppSettings.FILMS_TO_ROW;
    render(this._filmsList.getElement(), this._loadMore.getElement());
  }

  _updateFilmList(remove = false) {
    unrender(this._filmsList.getElement());
    this._filmsList.removeElement();
    if (remove) {
      return;
    }
    render(this._container, this._filmsList.getElement(), Position.AFTERBEGIN);
  }

  _renderNoResult(remove = false, state = `no-result`) {
    unrender(this._noResult.getElement());
    this._noResult.removeElement();
    if (remove) {
      return;
    }
    this._noResult = new NoResult(setNoResultText(state));
    render(this._filmsList.getElement(), this._noResult.getElement());
  }
}
