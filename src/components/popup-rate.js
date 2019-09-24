import Component from "./component";

import {AppSettings} from "../utils";

export default class PopupRate extends Component {
  constructor(filmData) {
    super();
    this._personalRating = filmData.userDetails.personalRating;
    this._poster = filmData.filmInfo.poster;
  }

  getTemplate() {
    return `<section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${this._poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">The Great Flamarion</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              ${new Array(AppSettings.PERSONAL_RATING_POINTS.END).fill().map((item, idx) =>`<input 
                type="radio" 
                name="score" 
                class="film-details__user-rating-input visually-hidden" 
                value="${idx + AppSettings.PERSONAL_RATING_POINTS.START}" 
                id="rating-${idx + AppSettings.PERSONAL_RATING_POINTS.START}"
                ${(idx + AppSettings.PERSONAL_RATING_POINTS.START) === this._personalRating ? `checked` : ``}
                >
              <label class="film-details__user-rating-label" for="rating-${idx + 1}">${idx + 1}</label>`).join(``)}
            </div>
          </section>
        </div>
      </section>`;
  }
}
