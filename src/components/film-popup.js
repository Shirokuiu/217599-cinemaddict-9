import Component from "./component";

import moment from "moment";

export default class FilmPopup extends Component {
  constructor({filmInfo, userDetails}, runtime) {
    super();
    this._poster = filmInfo.poster;
    this._ageRating = filmInfo.ageRating;
    this._title = filmInfo.title;
    this._alternativeTitle = filmInfo.alternativeTitle;
    this._totalRating = filmInfo.totalRating;
    this._director = filmInfo.director;
    this._writers = filmInfo.writers;
    this._actors = filmInfo.actors;
    this._releaseDate = filmInfo.release.date;
    this._runtime = runtime;
    this._releaseCountry = filmInfo.release.releaseCountry;
    this._genre = filmInfo.genre;
    this._description = filmInfo.description;
    this._personalRating = userDetails.personalRating;
    this._watchlist = userDetails.watchlist;
    this._alreadyWatched = userDetails.alreadyWatched;
    this._favorite = userDetails.favorite;
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

      <section class="film-details__controls">
        <input 
          type="checkbox" 
          class="film-details__control-input visually-hidden" 
          id="watchlist" 
          name="watchlist"
          ${this._watchlist ? `checked` : ``}
        >
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input 
          type="checkbox" 
          class="film-details__control-input visually-hidden" 
          id="watched" 
          name="watched"
          ${this._alreadyWatched ? `checked` : ``}
        >
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input 
          type="checkbox" 
          class="film-details__control-input visually-hidden" 
          id="favorite" 
          name="favorite"
          ${this._favorite ? `checked` : ``}
        >
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>
    <div class="form-details__middle-container ${!this._alreadyWatched ? `visually-hidden` : ``}">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="./images/posters/the-great-flamarion.jpg" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">The Great Flamarion</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              ${new Array(9).fill().map((item, idx) =>`<input 
                type="radio" 
                name="score" 
                class="film-details__user-rating-input visually-hidden" 
                value="${idx + 1}" 
                id="rating-${idx + 1}"
                ${(idx + 1) === this._personalRating ? `checked` : ``}
                >
              <label class="film-details__user-rating-label" for="rating-${idx + 1}">${idx + 1}</label>`).join(``)}
            </div>
          </section>
        </div>
      </section>
    </div>
    <div class="form-details__bottom-container">
      <!-- comments-controller !-->
    </div>
  </form>`;
  }
}
