import FilmsTopRatedController from "./films-top-rated-controller";
import FilmsMostCommentedController from "./films-most-commented-controller";
import StatisticController from "./statistic-controller";
import SearchResultController from "./search-result-controller";
import FilmsController from "./films-controller";
import MenuController from "./menu-controller";

import Sort from "../components/sort";
import FilmsContent from "../components/films-content";
import NoResult from "../components/no-result";

import {Position, render, resetButtons, setNoResultText, unrender} from "../utils";

import moment from "moment";

export default class MainController {
  constructor(onAppDataChange) {
    this._onAppDataChange = onAppDataChange;
    this._filmsData = [];
    this._container = document.querySelector(`.main`);

    this._filmsContent = new FilmsContent();
    this._sort = new Sort();
    this._onMenuDataChange = this._onMenuDataChange.bind(this);
    this._menuController = new MenuController(this._container, this._onMenuDataChange);
    this._noResult = new NoResult();

    this._searchResultController = new SearchResultController(this._container);
    this._filmsController = new FilmsController(this._filmsContent.getElement());
    this._filmsTopRatedController = new FilmsTopRatedController(this._filmsContent.getElement());
    this._filmsMostCommentedController = new FilmsMostCommentedController(this._filmsContent.getElement());
    this._statisticController = new StatisticController(this._container);

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
      this._sort.getElement().classList.add(`visually-hidden`);
      this._filmsController.show(filmsFound);
      this._filmsController.searchMode(mode, filmsFound);
      this._searchResultController.show(filmsFound);
      this._statisticController.hide();
      this._filmsTopRatedController.hide();
      this._filmsMostCommentedController.hide();
      return;
    }
    this._menuController.show(this._filmsData);
    this._sort.getElement().classList.remove(`visually-hidden`);
    resetButtons(this._sort, `sort__button`, true);
    this._searchResultController.hide();
    this._filmsController.show(filmsFound);
    this._filmsController.searchMode(mode);
    this._filmsTopRatedController.show(filmsFound);
    this._filmsMostCommentedController.show(filmsFound);
  }

  updateMenu() {

  }

  _setFilmsData(filmsData) {
    this._filmsData = filmsData;
    this._renderMainController(this._container, filmsData);
  }

  _onMenuDataChange(menuState) {
    this._filmsController.onMenuDataChange();
    resetButtons(this._sort, `sort__button`, true);

    switch (menuState) {
      case `all`:
        this._sort.getElement().classList.remove(`visually-hidden`);
        this._filmsController.show(this._filmsData);
        this._filmsTopRatedController.show(this._filmsData);
        this._filmsMostCommentedController.show(this._filmsData);
        this._statisticController.hide();
        break;
      case `watchlist`:
        this._sort.getElement().classList.remove(`visually-hidden`);
        this._filmsController.show(this._filmsData.slice().filter(({userDetails}) => userDetails.watchlist));
        this._filmsTopRatedController.show(this._filmsData);
        this._filmsMostCommentedController.show(this._filmsData);
        this._statisticController.hide();
        break;
      case `history`:
        this._sort.getElement().classList.remove(`visually-hidden`);
        this._filmsController.show(this._filmsData.slice().filter(({userDetails}) => userDetails.alreadyWatched));
        this._filmsTopRatedController.show(this._filmsData);
        this._filmsMostCommentedController.show(this._filmsData);
        this._statisticController.hide();
        break;
      case `favorites`:
        this._sort.getElement().classList.remove(`visually-hidden`);
        this._filmsController.show(this._filmsData.slice().filter(({userDetails}) => userDetails.favorite));
        this._filmsTopRatedController.show(this._filmsData);
        this._filmsMostCommentedController.show(this._filmsData);
        this._statisticController.hide();
        break;
      case `stats`:
        this._sort.getElement().classList.add(`visually-hidden`);
        this._filmsController.hide();
        this._filmsTopRatedController.hide(this._filmsData);
        this._filmsMostCommentedController.hide(this._filmsData);
        this._statisticController.show(this._filmsData);
        break;
    }
  }

  _renderMainController(container, filmsData) {
    this._sort = new Sort();
    this._filmsController = new FilmsController(this._filmsContent.getElement(), this._onAppDataChange);
    this._filmsTopRatedController = new FilmsTopRatedController(this._filmsContent.getElement());
    this._filmsMostCommentedController = new FilmsMostCommentedController(this._filmsContent.getElement());
    this._statisticController = new StatisticController(this._container);

    const onSortClick = (evt) => {
      evt.preventDefault();

      if (evt.target.tagName.toLowerCase() !== `a`) {
        return;
      }

      this._filmsController.onSortDataChange();

      const menuMod = this._container.querySelector(`.main-navigation__item.main-navigation__item--active`)
        .href.split(`#`)[1];

      if (!(evt.target.classList.contains(`sort__button--active`))) {
        resetButtons(this._sort, `sort__button`);
        evt.target.classList.add(`sort__button--active`);

        switch (menuMod) {
          case `all`:
            sortFilms(this._filmsData, evt.target.dataset.sort);
            break;
          case `watchlist`:
            sortFilms(this._filmsData.slice()
              .filter(({userDetails}) => userDetails.watchlist), evt.target.dataset.sort);
            break;
          case `history`:
            sortFilms(this._filmsData.slice()
              .filter(({userDetails}) => userDetails.alreadyWatched), evt.target.dataset.sort);
            break;
          case `favorites`:
            sortFilms(this._filmsData.slice()
              .filter(({userDetails}) => userDetails.favorite), evt.target.dataset.sort);
            break;
        }
      }
    };

    const sortFilms = (filmData, sortStatus) => {
      switch (sortStatus) {
        case `default`:
          this._filmsController.show(filmData);
          break;
        case `date`:
          this._filmsController.show(filmData.slice()
            .sort((a, b) => +moment(b.filmInfo.release.date) - +moment(a.filmInfo.release.date)));
          break;
        case `rate`:
          this._filmsController.show(filmData.slice()
            .sort((a, b) => (b.filmInfo.totalRating * 100) - (a.filmInfo.totalRating * 100)));
          break;
      }
    };

    this._sort.getElement().addEventListener(`click`, onSortClick);

    render(this._container, this._sort.getElement(), Position.AFTERBEGIN);
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
