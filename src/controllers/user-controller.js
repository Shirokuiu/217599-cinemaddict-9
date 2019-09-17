import User from "../components/user";

import {getUserRate, render} from "../utils";

export default class UserController {
  constructor(container, filmsData) {
    this._filmsData = filmsData;
    this._container = container;
    this._user = new User(getUserRate(this._filmsData));
  }

  init() {
    render(this._container, this._user.getElement());
  }
}
