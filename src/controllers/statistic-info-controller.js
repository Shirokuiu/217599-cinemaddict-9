import StatisticInfo from "../components/statistic-info";

import {calculateGenres, getTimeFromMinutes, render, unrender} from "../utils";

export default class StatisticInfoController {
  constructor(container) {
    this._container = container;
    this._filmsData = [];
    this._statisticInfo = new StatisticInfo({});
  }

  show(filmsData) {
    if (filmsData !== this._filmsData) {
      unrender(this._statisticInfo.getElement());
      this._statisticInfo.removeElement();

      this._setStatisticInfo(filmsData);
    }
  }

  _setStatisticInfo(filmsData) {
    this._filmsData = filmsData;
    this._renderStatisticInfo(this._container, filmsData);
  }

  _renderStatisticInfo(container, filmsData) {
    this._statisticInfo = new StatisticInfo(this._getStatistic(filmsData));

    render(container, this._statisticInfo.getElement());
  }

  _getStatistic(mode, filmsData) {
    return this._calculateStatistic(mode, filmsData);
  }

  _calculateStatistic(filmsData) {
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

  _getTopGenre(filmsWatched) {
    let maxVal;
    let maxKey;

    for (let [key, value] of Object.entries(calculateGenres(filmsWatched))) {
      if (!maxVal || value > maxVal) {
        maxVal = value;
        maxKey = key;
      }
    }

    return maxKey;
  }
}
