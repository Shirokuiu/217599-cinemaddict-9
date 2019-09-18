import FilmsTopRatedController from "./films-top-rated-controller";
import FilmsMostCommentedController from "./films-most-commented-controller";
import StatisticController from "./statistic-controller";
import SearchResultController from "./search-result-controller";
import FilmsController from "./films-controller";

import Menu from "../components/menu";
import Sort from "../components/sort";
import FilmsContent from "../components/films-content";

import {Position, render, unrender} from "../utils";

import moment from "moment";
import NoResult from "../components/no-result";

export default class MainController {
  constructor(authorization, endPoint, commentEmotions) {
    this._filmsData = [];
    this._authorization = authorization;
    this._endPoint = endPoint;
    this._commentEmotions = commentEmotions;

    this._container = document.querySelector(`.main`);
    this._filmsContent = new FilmsContent();
    this._sort = new Sort();
    this._menu = new Menu({});
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
      this._menu.getElement().classList.add(`visually-hidden`);
      this._sort.getElement().classList.add(`visually-hidden`);
      this._filmsController.show(filmsFound);
      this._searchResultController.show(filmsFound);
      this._statisticController.hide();
      this._filmsTopRatedController.hide();
      this._filmsMostCommentedController.hide();
      return;
    }
    this._menu.getElement().classList.remove(`visually-hidden`);
    this._sort.getElement().classList.remove(`visually-hidden`);
    this._resetButtons(this._menu, `main-navigation__item`, true);
    this._resetButtons(this._sort, `sort__button`, true);
    this._searchResultController.hide();
    this._filmsController.show(filmsFound);
    this._filmsTopRatedController.show(filmsFound);
    this._filmsMostCommentedController.show(filmsFound);
  }

  _setFilmsData(filmsData) {
    this._filmsData = filmsData;
    this._renderMainController(this._container, filmsData);
  }

  _renderMainController(container, filmsData) {
    this._sort = new Sort();
    this._menu = new Menu(this._getMenuCount(filmsData));
    this._filmsController = new FilmsController(this._filmsContent.getElement(), this._authorization, this._endPoint, this._commentEmotions);
    this._filmsTopRatedController = new FilmsTopRatedController(this._filmsContent.getElement(), this._authorization, this._endPoint, this._commentEmotions);
    this._filmsMostCommentedController = new FilmsMostCommentedController(this._filmsContent.getElement(), this._authorization, this._endPoint, this._commentEmotions);
    this._statisticController = new StatisticController(this._container);

    const onMenuClick = (evt) => {
      evt.preventDefault();

      if (evt.target.tagName.toLowerCase() !== `a`) {
        return;
      }

      this._filmsController.onMenuDataChange();

      if (!(evt.target.classList.contains(`main-navigation__item--active`))) {
        this._resetButtons(this._menu, `main-navigation__item`);
        this._resetButtons(this._sort, `sort__button`, true);
        evt.target.classList.add(`main-navigation__item--active`);

        switch (evt.target.href.split(`#`)[1]) {
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
    };

    const onSortClick = (evt) => {
      evt.preventDefault();

      if (evt.target.tagName.toLowerCase() !== `a`) {
        return;
      }

      this._filmsController.onSortDataChange();

      const menuMod = this._menu.getElement().querySelector(`.main-navigation__item.main-navigation__item--active`)
        .href.split(`#`)[1];

      if (!(evt.target.classList.contains(`sort__button--active`))) {
        this._resetButtons(this._sort, `sort__button`);
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

    this._menu.getElement().addEventListener(`click`, onMenuClick);
    this._sort.getElement().addEventListener(`click`, onSortClick);

    render(this._container, this._sort.getElement(), Position.AFTERBEGIN);
    render(container, this._menu.getElement(), Position.AFTERBEGIN);
    this._filmsController.show(this._filmsData);
    this._filmsTopRatedController.show(this._filmsData);
    this._filmsMostCommentedController.show(this._filmsData);
  }

  _getMenuCount(filmsData) {
    return {
      watchList: this._calculateMenuCount(filmsData, `watchList`),
      alreadyWatched: this._calculateMenuCount(filmsData, `history`),
      favorite: this._calculateMenuCount(filmsData, `favorite`),
    };
  }

  _calculateMenuCount(filmsData, mode) {
    let result = null;

    switch (mode) {
      case `watchList`:
        result = filmsData.filter(({userDetails}) => userDetails.watchlist).length;
        break;
      case `history`:
        result = filmsData.filter(({userDetails}) => userDetails.alreadyWatched).length;
        break;
      case `favorite`:
        result = filmsData.filter(({userDetails}) => userDetails.favorite).length;
        break;
    }
    return result;
  }

  _resetButtons(element, className, defaultState = false) {
    [...element.getElement().querySelectorAll(`.${className}`)]
      .forEach((item) => item.classList.remove(`${className}--active`));

    if (defaultState) {
      element.getElement().querySelectorAll(`.${className}`)[0]
        .classList.add(`${className}--active`);
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
