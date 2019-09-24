import Component from "./component";

export default class StatisticInfo extends Component {
  constructor({topGenre, totalDuration, watched}) {
    super();
    this._topGenre = topGenre;
    this._hours = totalDuration ? totalDuration.hours : ``;
    this._minutes = totalDuration ? totalDuration.minutes : ``;
    this._watched = watched;
  }

  getTemplate() {
    return `<ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${this._watched} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${this._hours} <span class="statistic__item-description">h</span> ${this._minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${this._topGenre}</p>
      </li>
    </ul>`;
  }
}
