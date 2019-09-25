import StatisticInfo from "../components/statistic-info";

import {calculateGenres, getTimeFromMinutes, render, unrender} from "../utils";

export default class StatisticInfoController {
  constructor(container, filmsData) {
    this._container = container;
    this._filmsData = filmsData;

    this._statisticInfo = new StatisticInfo(this._getStatistic(this._filmsData));

    this._init();
  }

  _init() {
    render(this._container, this._statisticInfo.getElement());
  }

  update(updatedData) {
    unrender(this._statisticInfo.getElement());
    this._statisticInfo.removeElement();

    this._updateData(this._container, updatedData);
  }

  _updateData(container, updatedData) {
    this._filmsData = updatedData;

    this._updateView(container, this._filmsData);
  }

  _updateView(container, updatedData) {
    this._statisticInfo = new StatisticInfo(this._getStatistic(updatedData));

    render(container, this._statisticInfo.getElement());
  }

  _getStatistic(mode, filmsData) {
    return this._calculateStatistic(mode, filmsData);
  }

  _calculateStatistic(filmsData) {
    if (filmsData.length) {
      const watched = filmsData.filter(({userDetails}) => userDetails.alreadyWatched);
      const duration = watched.map(({filmInfo}) => filmInfo.runtime)
        .reduce((first, second) => first + second);

      const topGenre = this._getTopGenre(watched);

      return {
        watched: watched.length,
        totalDuration: {
          hours: parseInt(getTimeFromMinutes(duration).split(` `)[0], 10),
          minutes: parseInt(getTimeFromMinutes(duration).split(` `)[1], 10),
        },
        topGenre,
      };
    }

    return 0;
  }

  _getTopGenre(filmsWatched) {
    let maxVal;
    let maxKey;

    if (filmsWatched.length) {
      for (let [key, value] of Object.entries(calculateGenres(filmsWatched))) {
        if (!maxVal || value > maxVal) {
          maxVal = value;
          maxKey = key;
        }
      }
    }

    return maxKey;
  }
}
