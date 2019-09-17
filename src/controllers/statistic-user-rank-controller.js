import StatisticUserRate from "../components/statistic-user-rate";

import {Position, render, unrender} from "../utils";

export default class StatisticUserRateController {
  constructor(container) {
    this._container = container;
    this._filmsData = [];
    this._statisticUserRate = new StatisticUserRate(``);

    this._init();
  }

  _init() {
    render(this._container, this._statisticUserRate.getElement());
  }

  show(filmsData) {
    if (filmsData !== this._filmsData) {
      unrender(this._statisticUserRate.getElement());
      this._statisticUserRate.removeElement();

      this._setUserRateData(filmsData);
    }
  }

  _setUserRateData(filmsData) {
    this._filmsData = filmsData;
    this._renderStatisticUserRate(this._container, filmsData);
  }

  _renderStatisticUserRate(container, filmsData) {
    this._statisticUserRate = new StatisticUserRate(this._getUserRate(filmsData));

    render(container, this._statisticUserRate.getElement(), Position.AFTERBEGIN);
  }

  _getUserRate(filmsData) {
    const watchedList = filmsData.filter(({userDetails}) => userDetails.alreadyWatched).length;

    if (watchedList <= 10) {
      return `novice`;
    }

    if (watchedList > 10 && watchedList < 20) {
      return `fan`;
    }

    if (watchedList > 19) {
      return `movie buff`;
    }

    return undefined;
  }
}
