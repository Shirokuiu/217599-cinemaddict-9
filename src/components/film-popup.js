import Component from "./component";

import moment from "moment";
import {AppSettings} from "../utils";

export default class FilmPopup extends Component {
  constructor({filmInfo, userDetails}, runtime) {
    super();
    this._poster = filmInfo ? filmInfo.poster : ``;
    this._ageRating = filmInfo ? filmInfo.ageRating: ``;
    this._title = filmInfo ? filmInfo.title: ``;
    this._alternativeTitle = filmInfo ? filmInfo.alternativeTitle: ``;
    this._totalRating = filmInfo ? filmInfo.totalRating: ``;
    this._director = filmInfo ? filmInfo.director: ``;
    this._writers = filmInfo ? filmInfo.writers: ``;
    this._actors = filmInfo ? filmInfo.actors: ``;
    this._releaseDate = filmInfo ? filmInfo.release.date: ``;
    this._runtime = runtime;
    this._releaseCountry = filmInfo ? filmInfo.release.releaseCountry: ``;
    this._genre = filmInfo ? filmInfo.genre: ``;
    this._description = filmInfo ? filmInfo.description: ``;
    this._alreadyWatched = userDetails ? userDetails.alreadyWatched: ``;
  }

  getTemplate() {
    return `<form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${this._poster}" alt="">

          <p class="film-details__age">${this._ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${this._title}</h3>
              <p class="film-details__title-original">Original: ${this._alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${this._totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${this._director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${this._writers.map((writer) => writer).join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${this._actors.map((actor) => actor).join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${moment(this._releaseDate).format(`DD MMMM YYYY`)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${this._runtime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${this._releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${this._genre.length === 1 ? `Genre` : `Genres`}</td>
              <td class="film-details__cell">
                ${this._genre.map((genr) => `<span class="film-details__genre">${genr}</span>`).join(``)}
            </tr>
          </table>

          <p class="film-details__film-description">${this._description}</p>
        </div>
      </div>

      <!-- popup-controls !-->
    </div>
    <div class="form-details__middle-container ${!this._alreadyWatched ? `visually-hidden` : ``}">
      <!-- popup-rate !-->
    </div>
    <!-- comments-container !-->
  </form>`;
  }
}
