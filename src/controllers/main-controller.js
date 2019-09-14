import Menu from "../components/menu";
import Sort from "../components/sort";
import FilmsContent from "../components/films-content";

import FilmsController from "./films-controller";

import {render} from "../utils";

export default class MainController {
  constructor(filmsData, onDataChangeApp) {
    this._filmsData = filmsData;
    this._onDataChangeApp = onDataChangeApp;
    this._onDataChangeFilms = this._onDataChangeFilms.bind(this);
    this._container = document.querySelector(`.main`);
    this._menu = new Menu(this._getMenuCount(this._filmsData));
    this._sort = new Sort();
    this._filmsContent = new FilmsContent();
    this._filmsController = new FilmsController(this._container, this._filmsData, this._onDataChangeFilms);
  }

  init() {
    render(this._container, this._menu.getElement());
    render(this._container, this._sort.getElement());
    render(this._container, this._filmsContent.getElement());
    this._filmsController.init();
  }

  _onDataChangeFilms(newData, id) {
    this._filmsData[id] = newData;

    this._onDataChangeApp();
  }

  _getMenuCount(filmsData) {
    return {
      watchList: this._calculateMenuCount(filmsData, `watchList`),
      history: this._calculateMenuCount(filmsData, `history`),
      favorite: this._calculateMenuCount(filmsData, `favorite`),
    };
  }

  _calculateMenuCount(filmsData, mode) {
    let result = null;

    switch (mode) {
      case `watchList`:
        result = filmsData.filter((film) => film.watchlist).length;
        break;
      case `history`:
        result = filmsData.filter((film) => film.watched).length;
        break;
      case `favorite`:
        result = filmsData.filter((film) => film.favorite).length;
        break;
    }
    return result;
  }
}
