import Component from "./component";

export default class StatisticCanvas extends Component {
  getTemplate() {
    return `<div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>`;
  }
}
