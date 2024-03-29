import Sort from "../components/sort";

import {render, resetButtons} from "../utils";

import moment from "moment";

export default class SortController {
  constructor(container, filmsData, onSortDataChange) {
    this._container = container;
    this._filmsData = filmsData;
    this._onSortDataChange = onSortDataChange;

    this._sort = new Sort();

    this._init();
  }

  _init() {
    render(this._container, this._sort.getElement());

    const onSortClick = (evt) => {
      evt.preventDefault();

      if (evt.target.tagName.toLowerCase() !== `a`) {
        return;
      }

      const menuMod = this._container.querySelector(`.main-navigation__item.main-navigation__item--active`)
        .href.split(`#`)[1];

      if (!(evt.target.classList.contains(`sort__button--active`))) {
        resetButtons(this._sort, `sort__button`);
        evt.target.classList.add(`sort__button--active`);

        switch (menuMod) {
          case `all`:
            this._sortFilms(this._filmsData, evt.target.dataset.sort);
            break;
          case `watchlist`:
            this._sortFilms(this._filmsData.slice()
              .filter(({userDetails}) => userDetails.watchlist), evt.target.dataset.sort);
            break;
          case `history`:
            this._sortFilms(this._filmsData.slice()
              .filter(({userDetails}) => userDetails.alreadyWatched), evt.target.dataset.sort);
            break;
          case `favorites`:
            this._sortFilms(this._filmsData.slice()
              .filter(({userDetails}) => userDetails.favorite), evt.target.dataset.sort);
            break;
        }
      }
    };

    this._sort.getElement().addEventListener(`click`, onSortClick);
  }

  show() {
    if (this._sort.getElement().classList.contains(`visually-hidden`)) {
      this._sort.getElement().classList.remove(`visually-hidden`);
    }
  }

  menuChange() {
    resetButtons(this._sort, `sort__button`, true);
  }

  hide() {
    this._sort.getElement().classList.add(`visually-hidden`);
    resetButtons(this._sort, `sort__button`, true);
  }

  _sortFilms(filmData, sortStatus) {
    switch (sortStatus) {
      case `default`:
        this._onSortDataChange(filmData);
        break;
      case `date`:
        this._onSortDataChange(filmData.slice()
          .sort((a, b) => +moment(b.filmInfo.release.date) - +moment(a.filmInfo.release.date)));
        break;
      case `rate`:
        this._onSortDataChange(filmData.slice()
          .sort((a, b) => (b.filmInfo.totalRating * 100) - (a.filmInfo.totalRating * 100)));
        break;
    }
  }
}
