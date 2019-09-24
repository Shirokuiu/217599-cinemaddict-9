import StatisticFilters from "../components/statistic-filters";

import {render} from "../utils";

export default class StatisticFiltersController {
  constructor(container, onStatisticDataChange) {
    this._container = container;
    this._onStatisticDataChange = onStatisticDataChange;
    this._statisticFilters = new StatisticFilters();

    this._init();
  }

  _init() {
    render(this._container, this._statisticFilters.getElement());

    this._statisticFilters.getElement().addEventListener(`change`, this._onFiltersChange.bind(this));
  }

  _onFiltersChange(evt) {
    this._onStatisticDataChange(evt.target.value);
  }
}
