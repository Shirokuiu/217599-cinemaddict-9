import Component from "./component";

export default class Menu extends Component {
  constructor({watchList, alreadyWatched, favorite}) {
    super();
    this._watchList = watchList;
    this._alreadyWatched = alreadyWatched;
    this._favorite = favorite;
  }

  getTemplate() {
    return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist 
    <span class="main-navigation__item-count">${this._watchList}</span></a>
    <a href="#history" class="main-navigation__item">History 
    <span class="main-navigation__item-count">${this._alreadyWatched}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites 
    <span class="main-navigation__item-count">${this._favorite}</span></a>
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`;
  }
}
