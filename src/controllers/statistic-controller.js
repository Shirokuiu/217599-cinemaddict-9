import StatisticFiltersController from "./statistic-filters-controller";
import StatisticInfoController from "./statistic-info-controller";
import StatisticUserRateController from "./statistic-user-rank-controller";

import StatisticContainer from "../components/statistic-container";

import {render, unrender} from "../utils";

import moment from "moment";
import StatisticCanvasController from "./statistic-canvas-controller";

export default class StatisticController {
  constructor(container) {
    this._container = container;
    this._filmsData = [];
    this._statisticContainer = new StatisticContainer();
    this._statisticUserRateController = new StatisticUserRateController(this._statisticContainer.getElement());
    this._statisticFiltersController = new StatisticFiltersController(this._statisticContainer.getElement(), this._onStatisticDataChange);
    this._statisticInfoController = new StatisticInfoController(this._statisticContainer.getElement());
    this._statisticCanvasController = new StatisticCanvasController(this._statisticContainer.getElement());

    this._onStatisticDataChange = this._onStatisticDataChange.bind(this);
  }

  show(filmsData) {
    if (filmsData !== this._filmsData) {
      unrender(this._statisticContainer.getElement());
      this._statisticContainer.removeElement();
      this._setStatisticData(filmsData);
      return;
    }

    if (this._statisticContainer.getElement().classList.contains(`visually-hidden`)) {
      this._statisticContainer.getElement().classList.remove(`visually-hidden`);
    }
  }

  hide() {
    this._statisticContainer.getElement().classList.add(`visually-hidden`);
  }

  _setStatisticData(filmsData) {
    this._filmsData = filmsData;
    this._renderStatistic(this._container, filmsData);
  }

  _renderStatistic(container, filmsData) {
    this._statisticContainer = new StatisticContainer();
    this._statisticUserRateController = new StatisticUserRateController(this._statisticContainer.getElement());
    this._statisticFiltersController = new StatisticFiltersController(this._statisticContainer.getElement(), this._onStatisticDataChange);
    this._statisticInfoController = new StatisticInfoController(this._statisticContainer.getElement());
    this._statisticCanvasController = new StatisticCanvasController(this._statisticContainer.getElement());

    render(container, this._statisticContainer.getElement());
    this._statisticUserRateController.show(filmsData);
    this._statisticUserRateController.show(filmsData);
    this._statisticFiltersController.init();
    this._statisticInfoController.show(filmsData);
    this._statisticCanvasController.show(filmsData);
  }

  _onStatisticDataChange(filterMode) {
    switch (filterMode) {
      case `all-time`:
        this._statisticUserRateController.show(this._filmsData);
        this._statisticInfoController.show(this._filmsData);
        this._statisticCanvasController.show(this._filmsData);
        break;
      case `today`:
        const today = this._filmsData.filter((film) => Math
          .abs(moment(film.userDetails.watchingDate).diff(moment(Date.now()), `days`)) === 0)
          .filter(({userDetails}) => userDetails.alreadyWatched);
        this._statisticUserRateController.show(today);
        this._statisticInfoController.show(today);
        this._statisticCanvasController.show(today);
        break;
      case `week`:
        const week = this._filmsData.filter((film) => Math
          .abs(moment(film.userDetails.watchingDate).diff(moment(Date.now()), `days`)) <= 7)
          .filter(({userDetails}) => userDetails.alreadyWatched);
        this._statisticUserRateController.show(week);
        this._statisticInfoController.show(week);
        this._statisticCanvasController.show(week);
        break;
      case `month`:
        const month = this._filmsData.filter((film) => Math
          .abs(moment(film.userDetails.watchingDate).diff(moment(Date.now()), `days`)) <= 31)
          .filter(({userDetails}) => userDetails.alreadyWatched);
        this._statisticUserRateController.show(month);
        this._statisticInfoController.show(month);
        this._statisticCanvasController.show(month);
        break;
      case `year`:
        const year = this._filmsData.filter((film) => Math
          .abs(moment(film.userDetails.watchingDate).diff(moment(Date.now()), `days`)) <= 365)
          .filter(({userDetails}) => userDetails.alreadyWatched);
        this._statisticUserRateController.show(year);
        this._statisticInfoController.show(year);
        this._statisticCanvasController.show(year);
        break;
    }
  }
}
