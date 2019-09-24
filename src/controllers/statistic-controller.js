import StatisticFiltersController from "./statistic-filters-controller";
import StatisticInfoController from "./statistic-info-controller";
import StatisticUserRateController from "./statistic-user-rank-controller";
import StatisticCanvasController from "./statistic-canvas-controller";

import StatisticContainer from "../components/statistic-container";

import {render} from "../utils";

import moment from "moment";

export default class StatisticController {
  constructor(container, filmsData) {
    this._container = container;
    this._filmsData = filmsData;
    this._statisticContainer = new StatisticContainer();

    this._statisticUserRateController = new StatisticUserRateController(
        this._statisticContainer.getElement().querySelector(`.statistic__rank-wrap`),
        this._filmsData
    );
    this._statisticFiltersController = new StatisticFiltersController(
        this._statisticContainer.getElement().querySelector(`.statistic__filters-wrap`),
        this._onStatisticDataChange.bind(this)
    );
    this._statisticInfoController = new StatisticInfoController(
        this._statisticContainer.getElement().querySelector(`.statistic__text-list-wrap`),
        this._filmsData
    );
    this._statisticCanvasController = new StatisticCanvasController(
        this._statisticContainer.getElement(),
        this._filmsData
    );

    this._init();
  }

  _init() {
    this.hide();
    render(this._container, this._statisticContainer.getElement());
  }

  show() {
    if (this._statisticContainer.getElement().classList.contains(`visually-hidden`)) {
      this._statisticContainer.getElement().classList.remove(`visually-hidden`);
    }
  }

  hide() {
    this._statisticContainer.getElement().classList.add(`visually-hidden`);
  }

  update(updatedData) {
    this._statisticUserRateController.update(updatedData);
    this._statisticInfoController.update(updatedData);
    this._statisticCanvasController.refresh(updatedData.filter(({userDetails}) => userDetails.alreadyWatched));
  }

  _onStatisticDataChange(filterMode) {
    switch (filterMode) {
      case `all-time`:
        this._statisticUserRateController.update(this._filmsData);
        this._statisticInfoController.update(this._filmsData);
        this._statisticCanvasController.refresh(this._filmsData);
        break;
      case `today`:
        const today = this._filmsData.filter((film) => Math
          .abs(moment(film.userDetails.watchingDate).diff(moment(Date.now()), `days`)) === 0)
          .filter(({userDetails}) => userDetails.alreadyWatched);
        this._statisticUserRateController.update(today);
        this._statisticInfoController.update(today);
        this._statisticCanvasController.refresh(today);
        break;
      case `week`:
        const week = this._filmsData.filter((film) => Math
          .abs(moment(film.userDetails.watchingDate).diff(moment(Date.now()), `days`)) <= 7)
          .filter(({userDetails}) => userDetails.alreadyWatched);
        this._statisticUserRateController.update(week);
        this._statisticInfoController.update(week);
        this._statisticCanvasController.refresh(week);
        break;
      case `month`:
        const month = this._filmsData.filter((film) => Math
          .abs(moment(film.userDetails.watchingDate).diff(moment(Date.now()), `days`)) <= 31)
          .filter(({userDetails}) => userDetails.alreadyWatched);
        this._statisticUserRateController.update(month);
        this._statisticInfoController.update(month);
        this._statisticCanvasController.refresh(month);
        break;
      case `year`:
        const year = this._filmsData.filter((film) => Math
          .abs(moment(film.userDetails.watchingDate).diff(moment(Date.now()), `days`)) <= 365)
          .filter(({userDetails}) => userDetails.alreadyWatched);
        this._statisticUserRateController.update(year);
        this._statisticInfoController.update(year);
        this._statisticCanvasController.refresh(year);
        break;
    }
  }
}
