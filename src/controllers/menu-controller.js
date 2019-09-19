import Menu from "../components/menu";

import {Position, render, resetButtons, unrender} from "../utils";

export default class MenuController {
  constructor(container, onMenuDataChange) {
    this._container = container;
    this._onMenuDataChange = onMenuDataChange;
    this._filmsData = [];

    this._menu = new Menu({});
  }

  show(filmsData) {
    if (filmsData !== this.filmsData) {
      unrender(this._menu.getElement());
      this._menu.removeElement();

      this._setMenuData(filmsData);
    }
  }

  hide() {
    unrender(this._menu.getElement());
    this._menu.removeElement();
  }

  _setMenuData(filmsData) {
    this._filmsData = filmsData;
    this._renderMenu(this._container, this._filmsData);
  }

  _renderMenu(container, filmsData) {
    this._menu = new Menu(this._getMenuCount(filmsData));

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
