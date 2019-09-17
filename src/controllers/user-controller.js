import User from "../components/user";

import {render} from "../utils";

export default class UserController {
  constructor(container, filmsData) {
    this._filmsData = filmsData;
    this._container = container;
    this._user = new User(this._getUserRate(this._filmsData));
  }

  init() {
    render(this._container, this._user.getElement());
  }

  _getUserRate(filmsData) {
    const watchedList = filmsData.filter(({userDetails}) => userDetails.alreadyWatched).length;

    if (watchedList <= 10) {
      return `novice`;
    }

    if (watchedList > 10 && watchedList < 20) {
      return `fan`;
    }

    if (watchedList > 19) {
      return `movie buff`;
    }

    return undefined;
  }
}
