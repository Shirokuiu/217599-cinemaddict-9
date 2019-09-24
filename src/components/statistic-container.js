import Component from "./component";

export default class StatisticContainer extends Component {
  getTemplate() {
    return `<section class="statistic">
      <div class="statistic__rank-wrap"></div>
      <div class="statistic__filters-wrap"></div>
      <div class="statistic__text-list-wrap"></div>
    </section>`;
  }
}
