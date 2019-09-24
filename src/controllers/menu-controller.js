import Menu from "../components/menu";

import {Position, render, resetButtons, unrender} from "../utils";

export default class MenuController {
  constructor(container, filmsData, onMenuDataChange) {
    this._container = container;
    this._onMenuDataChange = onMenuDataChange;
    this._filmsData = filmsData;

    this._menu = new Menu(this._getMenuCount(this._filmsData));

    this._init();
  }

  _init() {
    render(this._container, this._menu.getElement());

    this._menu.getElement().addEventListener(`click`, this._onMenuClick.bind(this));
  }

  show() {
    if (this._menu.getElement().classList.contains(`visually-hidden`)) {
      this._menu.getElement().classList.remove(`visually-hidden`);
    }
  }

  hide() {
    this._menu.getElement().classList.add(`visually-hidden`);
    resetButtons(this._menu, `main-navigation__item`, true);
  }

  update(updatedData) {
    unrender(this._menu.getElement());
    this._menu.removeElement();

    this._updateData(this._container, updatedData);
  }

  _updateData(container, updatedData) {
    this._filmsData = updatedData;

    this._updateView(container, this._filmsData);
  }

  _updateView(container, updatedData) {
    this._menu = new Menu(this._getMenuCount(updatedData));

    this._menu.getElement().addEventListener(`click`, this._onMenuClick.bind(this));

    render(container, this._menu.getElement(), Position.AFTERBEGIN);
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

  _onMenuClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName.toLowerCase() !== `a`) {
      return;
    }

    if (!(evt.target.classList.contains(`main-navigation__item--active`))) {
      resetButtons(this._menu, `main-navigation__item`);
      evt.target.classList.add(`main-navigation__item--active`);

      this._onMenuDataChange(evt.target.href.split(`#`)[1]);
    }
  }
}
