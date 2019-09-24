import Component from "./component";

export default class StatisticUserRate extends Component {
  constructor(userRate) {
    super();
    this._userRate = userRate;
  }

  getTemplate() {
    return `<p class="statistic__rank">
      Your rank 
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"> 
      <span class="statistic__rank-label">${this._userRate}</span>
    </p>`;
  }
}
