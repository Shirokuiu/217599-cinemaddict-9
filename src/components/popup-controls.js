import Component from "./component";

export default class PopupControls extends Component {
  constructor({watchlist, alreadyWatched, favorite}) {
    super();
    this._watchlist = watchlist;
    this._alreadyWatched = alreadyWatched;
    this._favorite = favorite;
  }

  getTemplate() {
    return `<section class="film-details__controls">
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
      </section>`;
  }
}
