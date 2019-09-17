import StatisticUserRate from "../components/statistic-user-rate";

import {getUserRate, Position, render, unrender} from "../utils";

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
    this._statisticUserRate = new StatisticUserRate(getUserRate(filmsData));

    render(container, this._statisticUserRate.getElement(), Position.AFTERBEGIN);
  }
}
