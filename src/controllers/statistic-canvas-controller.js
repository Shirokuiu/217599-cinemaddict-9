import StatisticCanvas from "../components/statistic-canvas";

import {calculateGenres, render} from "../utils";

import Chart from "chart.js";
import ChartPlugin from "chartjs-plugin-datalabels";

export default class StatisticCanvasController {
  constructor(container, filmsData) {
    this.filmsData = filmsData;
    this._container = container;
    this._statisticCanvas = new StatisticCanvas();
    this._genres = calculateGenres(this.filmsData);
    this._chart = null;

    this._init();
  }

  _init() {
    render(this._container, this._statisticCanvas.getElement());

    this._chart = new Chart(this._statisticCanvas.getElement().querySelector(`.statistic__chart`), {
      plugins: [ChartPlugin],
      type: `horizontalBar`,
      data: {
        labels: [...Object.keys(this._genres)],
        datasets: [{
          data: [...Object.values(this._genres)],
          backgroundColor: `#ffe800`
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              fontSize: 20,
              fontColor: `#ffffff`
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        tooltip: {
          enabled: false
        },
        legend: {
          position: `left`,
          display: false,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        },
      }
    });
  }

  refresh(updatedData) {
    this.filmsData = updatedData;
    this._genres = calculateGenres(this.filmsData);

    this._chart.data.labels = [...Object.keys(this._genres)];
    this._chart.data.datasets[0].data = [...Object.values(this._genres)];
    this._chart.update();
  }
}
