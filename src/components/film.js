import Component from "./component";

export default class Film extends Component {
  constructor({poster, title, rate, date, duration, category, description, comments, favorite, watchlist, watched}, titleLength) {
    super();
    this._poster = poster;
    this._title = title;
    this._rate = rate;
    this._date = date;
    this._duration = duration;
    this._category = category;
    this._description = description;
    this._comments = comments;
    this._favorite = favorite;
    this._watchlist = watchlist;
    this._watched = watched;
    this._titleLength = titleLength;
  }

  getTemplate() {
    return `<article class="film-card">
          <h3 class="film-card__title">${this._title}</h3>
          <p class="film-card__rating">${this._rate}</p>
          <p class="film-card__info">
            <span class="film-card__year">${this._date.year}</span>
            <span class="film-card__duration">${this._duration}</span>
            <span class="film-card__genre">${this._category}</span>
          </p>
          <img src="./images/posters/${this._poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${this._description.length > this._titleLength ? (this._description.slice(0, this.titleLength)) + `...` : this._description}</p>
          <a class="film-card__comments">${this._comments.length} comments</a>
          <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._watchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._watched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${this._favorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
          </form>
        </article>`;
  }
}
