import StatisticUserRate from "../components/statistic-user-rate";

import {getUserRate, Position, render, unrender} from "../utils";

export default class StatisticUserRateController {
  constructor(container, filmsData) {
    this._container = container;
    this._filmsData = filmsData;
    this._statisticUserRate = new StatisticUserRate(getUserRate(this._filmsData));

    this._init();
  }

  _init() {
    render(this._container, this._statisticUserRate.getElement());
  }

  update(updatedData) {
    unrender(this._statisticUserRate.getElement());
    this._statisticUserRate.removeElement();

    this._updateData(this._container, updatedData);
  }

  _updateData(container, updatedData) {
    this._filmsData = updatedData;

    this._updateView(container, this._filmsData);
  }

  _updateView(container, updatedData) {
    this._statisticUserRate = new StatisticUserRate(getUserRate(updatedData));

    render(container, this._statisticUserRate.getElement(), Position.AFTERBEGIN);
  }
}
