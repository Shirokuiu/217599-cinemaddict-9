import MovieController from "./movie-controller";

import FilmsList from "../components/films-list";
import NoResult from "../components/no-result";
import LoadMore from "../components/load-more";

import {AppSettings, Position, render, setNoResultText, unrender} from "../utils";

export default class FilmsController {
  constructor(container, filmsData, onAppDataChange, onFilmClickChange) {
    this._onAppDataChange = onAppDataChange;
    this._onFilmClickChange = onFilmClickChange;
    this._filmsData = filmsData;
    this._container = container;
    this._startLoad = 0;
    this._loadedFilms = AppSettings.FILMS_TO_ROW;

    this._filmsList = new FilmsList();
    this._noResult = new NoResult();
    this._loadMore = new LoadMore();

    this._init();
  }

  _init() {
    render(this._container, this._filmsList.getElement());

    this._setFilms(this._filmsData);
    this._checkFilmsToRow();
  }

  update(updatedData) {
    unrender(this._filmsList.getElement());
    this._filmsList.removeElement();

    this._updateData(this._container, updatedData);
  }

  _updateData(container, updatedData) {
    this._filmsData = updatedData;

    this._updateView(container, this._filmsData);
  }

  _updateView(container, updatedData) {
    this._filmsList = new FilmsList();

    render(container, this._filmsList.getElement(), Position.AFTERBEGIN);
    this._checkFilmsToRow();

    this._setFilms(updatedData);
  }

  hide() {
    unrender(this._filmsList.getElement());
    this._filmsList.removeElement();
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
      this.update(filmsData);
      if (!filmsData.length) {
        this._renderNoResult(false, `no-result`);
      }
    }
  }

  _setFilms(filmsData) {
    filmsData.slice(this._startLoad, AppSettings.FILMS_TO_ROW).forEach((film) => this._renderFilm(this._filmsList
      .getElement().querySelector(`.films-list__container`), film));
  }

  _renderFilm(container, filmData, searchMode) {
    const movieController = new MovieController(container, filmData, this._onAppDataChange, `films-list`, this._onFilmClickChange, searchMode);

    movieController.init();
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

  _checkFilmsToRow() {
    if (this._filmsData.length > AppSettings.FILMS_TO_ROW) {
      render(this._filmsList.getElement(), this._loadMore.getElement());
      this._loadMore.getElement().addEventListener(`click`, this._onLoadMoreClick.bind(this));
    }

    if (!this._filmsData.length) {
      this._filmsList.getElement().querySelector(`.films-list__container`).classList.add(`visually-hidden`);
      this._renderNoResult(false, `no-result`);
    } else {
      this._renderNoResult(true, `no-result`);
      this._filmsList.getElement().querySelector(`.films-list__container`).classList.remove(`visually-hidden`);
    }
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
}
