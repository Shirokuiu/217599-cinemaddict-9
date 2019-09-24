import FilmsTopRatedController from "./films-top-rated-controller";
import FilmsMostCommentedController from "./films-most-commented-controller";
import StatisticController from "./statistic-controller";
import SearchResultController from "./search-result-controller";
import FilmsController from "./films-controller";
import MenuController from "./menu-controller";
import SortController from "./sort-controller";
import FilmPopupController from "./film-popup-controller";

import FilmsContent from "../components/films-content";

import {render} from "../utils";

export default class MainController {
  constructor(filmsData, onAppDataChange) {
    this._onAppDataChange = onAppDataChange;
    this._filmsData = filmsData;
    this._container = document.querySelector(`.main`);

    this._filmsContent = new FilmsContent();

    this._searchResultController = new SearchResultController(this._container);
    this._menuController = new MenuController(this._container, this._filmsData, this._onMenuDataChange.bind(this));
    this._sortController = new SortController(this._container, this._filmsData, this._onSortDataChange.bind(this));
    this._filmsController = new FilmsController(this._filmsContent.getElement(), this._filmsData, this._onAppDataChange, this._onFilmClickChange.bind(this));
    this._statisticController = new StatisticController(this._container, this._filmsData);
    this._filmsTopRatedController = new FilmsTopRatedController(this._filmsContent.getElement(), this._filmsData, this._onAppDataChange, this._onFilmClickChange.bind(this));
    this._filmsMostCommentedController = new FilmsMostCommentedController(this._filmsContent.getElement(), this._filmsData, this._onAppDataChange, this._onFilmClickChange.bind(this));
    this._filmPopupController = null;

    this._changesCount = 0;

    this._init();
  }

  _init() {
    render(this._container, this._filmsContent.getElement());
  }

  searchMode(filmsFound, mode) {
    if (mode) {
      this._menuController.hide();
      this._sortController.hide();
      this._filmsController.update(filmsFound);
      this._filmsController.searchMode(mode, filmsFound);
      this._searchResultController.show(filmsFound);
      this._statisticController.hide();
      this._filmsTopRatedController.hide();
      this._filmsMostCommentedController.hide();
      return;
    }
    this._menuController.show();
    this._sortController.show();
    this._searchResultController.hide();
    this._filmsController.update(filmsFound);
    this._filmsController.searchMode(mode);
    this._filmsTopRatedController.update(filmsFound);
    this._filmsMostCommentedController.update(filmsFound);
  }

  updateData(updatedData) {
    this._filmsData = updatedData;
  }

  updateMenu(updatedFilms) {
    this._menuController.update(updatedFilms);
    this._statisticController.update(updatedFilms);
  }

  updateWidgets(updatedFilms) {
    this._filmsTopRatedController.update(updatedFilms);
    this._filmsMostCommentedController.update(updatedFilms);
  }

  updateFilmsList(updatedFilms) {
    this._filmsController.update(updatedFilms);
  }

  updatePopupControls(updatedFilm) {
    this._filmPopupController.updateControls(updatedFilm);
  }

  updateComments(updatedComments) {
    this._filmPopupController.updateComments(updatedComments);
  }

  updateRate(updatedRate) {
    this._filmPopupController.updateRate(updatedRate);
  }

  rateReject() {
    this._filmPopupController.rateReject();
  }

  popupControlsReject() {
    this._filmPopupController.controlsReject();
  }

  _onMenuDataChange(menuState) {
    this._filmsController.onMenuDataChange();
    this._sortController.menuChange();

    switch (menuState) {
      case `all`:
        this._sortController.show();
        this._filmsController.update(this._filmsData.slice());
        this._filmsTopRatedController.show();
        this._filmsMostCommentedController.show();
        this._statisticController.hide();
        break;
      case `watchlist`:
        this._sortController.show();
        this._filmsController.update(this._filmsData.slice().filter(({userDetails}) => userDetails.watchlist));
        this._filmsTopRatedController.show();
        this._filmsMostCommentedController.show();
        this._statisticController.hide();
        break;
      case `history`:
        this._sortController.show();
        this._filmsController.update(this._filmsData.slice().filter(({userDetails}) => userDetails.alreadyWatched));
        this._filmsTopRatedController.show();
        this._filmsMostCommentedController.show();
        this._statisticController.hide();
        break;
      case `favorites`:
        this._sortController.show();
        this._filmsController.update(this._filmsData.slice().filter(({userDetails}) => userDetails.favorite));
        this._filmsTopRatedController.show();
        this._filmsMostCommentedController.show();
        this._statisticController.hide();
        break;
      case `stats`:
        this._sortController.hide();
        this._filmsController.hide();
        this._filmsTopRatedController.hide();
        this._filmsMostCommentedController.hide();
        this._statisticController.show();
        break;
    }
  }

  _onSortDataChange(sortedFilms) {
    this._filmsController.onSortDataChange();
    this._filmsController.update(sortedFilms);
  }

  _onFilmClickChange(filmdata) {
    this._filmPopupController = new FilmPopupController(filmdata, this._onAppDataChange);
  }
}
