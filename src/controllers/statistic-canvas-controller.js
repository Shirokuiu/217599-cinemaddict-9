import StatisticCanvas from "../components/statistic-canvas";

import {calculateGenres, render, unrender} from "../utils";

import Chart from "chart.js";
import ChartPlugin from "chartjs-plugin-datalabels";

export default class StatisticCanvasController {
  constructor(container) {
    this.filmsData = [];
    this._container = container;
    this._statisticCanvas = new StatisticCanvas();
    this._chart = null;
  }

  show(filmsData) {
    if (filmsData !== this.filmsData) {
      unrender(this._statisticCanvas.getElement());
      this._statisticCanvas.removeElement();
      this._setStatisticCanvasData(filmsData);
    }
  }

  _setStatisticCanvasData(filmsData) {
    this.filmsData = filmsData;
    this._renderStatisticCanvas(this._container, filmsData);
  }

  _renderStatisticCanvas(cotainer, filmsData) {
    this._statisticCanvas = new StatisticCanvas();
    const genres = calculateGenres(filmsData);

    this._chart = new Chart(this._statisticCanvas.getElement().querySelector(`.statistic__chart`), {
      plugins: [ChartPlugin],
      type: `horizontalBar`,
      data: {
        labels: [...Object.keys(genres)],
        datasets: [{
          data: [...Object.values(genres)],
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

    render(cotainer, this._statisticCanvas.getElement());
  }
}
