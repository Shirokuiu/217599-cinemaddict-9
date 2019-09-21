import FilmsTopRatedController from "./films-top-rated-controller";
import FilmsMostCommentedController from "./films-most-commented-controller";
import StatisticController from "./statistic-controller";
import SearchResultController from "./search-result-controller";
import FilmsController from "./films-controller";
import MenuController from "./menu-controller";
import SortController from "./sort-controller";

import FilmsContent from "../components/films-content";
import NoResult from "../components/no-result";

import {render, setNoResultText, unrender} from "../utils";

export default class MainController {
  constructor(onAppDataChange) {
    this._onAppDataChange = onAppDataChange;
    this._filmsData = [];
    this._container = document.querySelector(`.main`);

    this._filmsContent = new FilmsContent();
    this._noResult = new NoResult();

    this._menuController = new MenuController(this._container, this._onMenuDataChange.bind(this));
    this._sortController = new SortController(this._container, this._onSortDataChange.bind(this));
    this._searchResultController = new SearchResultController(this._container);

    this._init();
  }

  _init() {
    render(this._container, this._filmsContent.getElement());
    this._renderNoResult(false, `loading`, this._filmsContent.getElement());
  }

  show(filmsData) {
    if (filmsData !== this._filmsData) {
      this._setFilmsData(filmsData);
    }
  }

  filmsIsLoaded() {
    this._renderNoResult(true);
  }

  searchMode(filmsFound, mode) {
    if (mode) {
      this._menuController.hide();
      this._sortController.hide();
      this._filmsController.show(filmsFound);
      this._filmsController.searchMode(mode, filmsFound);
      this._searchResultController.show(filmsFound);
      this._statisticController.hide();
      this._filmsTopRatedController.hide();
      this._filmsMostCommentedController.hide();
      return;
    }
    this._menuController.show(this._filmsData);
    this._sortController.show(this._filmsData);
    this._searchResultController.hide();
    this._filmsController.show(filmsFound);
    this._filmsController.searchMode(mode);
    this._filmsTopRatedController.show(filmsFound);
    this._filmsMostCommentedController.show(filmsFound);
  }

  updateMenu(updatedFilms) {
    this._menuController.show(updatedFilms);
  }

  updateWidgets(updatedFilms) {
    this._filmsTopRatedController.show(updatedFilms);
    this._filmsMostCommentedController.show(updatedFilms);
  }

  updateFilmsList(updatedFilms) {
    this._filmsController.show(updatedFilms);
  }

  _setFilmsData(filmsData) {
    this._filmsData = filmsData;
    this._renderMainController(this._container, filmsData);
  }

  _onMenuDataChange(menuState) {
    this._filmsController.onMenuDataChange();
    this._sortController.menuChange();

    switch (menuState) {
      case `all`:
        this._sortController.show(this._filmsData);
        this._filmsController.show(this._filmsData.slice());
        this._filmsTopRatedController.show(this._filmsData);
        this._filmsMostCommentedController.show(this._filmsData);
        this._statisticController.hide();
        break;
      case `watchlist`:
        this._sortController.show(this._filmsData);
        this._filmsController.show(this._filmsData.slice().filter(({userDetails}) => userDetails.watchlist));
        this._filmsTopRatedController.show(this._filmsData);
        this._filmsMostCommentedController.show(this._filmsData);
        this._statisticController.hide();
        break;
      case `history`:
        this._sortController.show(this._filmsData);
        this._filmsController.show(this._filmsData.slice().filter(({userDetails}) => userDetails.alreadyWatched));
        this._filmsTopRatedController.show(this._filmsData);
        this._filmsMostCommentedController.show(this._filmsData);
        this._statisticController.hide();
        break;
      case `favorites`:
        this._sortController.show(this._filmsData);
        this._filmsController.show(this._filmsData.slice().filter(({userDetails}) => userDetails.favorite));
        this._filmsTopRatedController.show(this._filmsData);
        this._filmsMostCommentedController.show(this._filmsData);
        this._statisticController.hide();
        break;
      case `stats`:
        this._sortController.hide();
        this._filmsController.hide();
        this._filmsTopRatedController.hide();
        this._filmsMostCommentedController.hide();
        this._statisticController.show(this._filmsData);
        break;
    }
  }

  _onSortDataChange(sortedFilms) {
    this._filmsController.onSortDataChange();
    this._filmsController.show(sortedFilms);
  }

  _renderMainController(container, filmsData) {
    this._filmsController = new FilmsController(this._filmsContent.getElement(), this._onAppDataChange);
    this._filmsTopRatedController = new FilmsTopRatedController(this._filmsContent.getElement(), this._onAppDataChange);
    this._filmsMostCommentedController = new FilmsMostCommentedController(this._filmsContent.getElement(), this._onAppDataChange);
    this._statisticController = new StatisticController(this._container);

    this._sortController.show(filmsData);
    this._menuController.show(filmsData);
    this._filmsController.show(this._filmsData);
    this._filmsTopRatedController.show(this._filmsData);
    this._filmsMostCommentedController.show(this._filmsData);
  }

  _renderNoResult(remove = false, state = `no-result`, container) {
    unrender(this._noResult.getElement());
    this._noResult.removeElement();
    if (remove) {
      return;
    }
    this._noResult = new NoResult(setNoResultText(state));
    render(container, this._noResult.getElement());
  }
}
