import User from "../components/user";

import {getUserRate, render, unrender, update} from "../utils";

export default class UserController {
  constructor(container) {
    this._filmsData = [];
    this._container = container;
    this._user = new User(``);
  }

  show(filmsData) {
    unrender(this._user.getElement());
    this._user.removeElement();

    this._setUserData(filmsData);
  }

  _setUserData(filmsData) {
    this._filmsData = filmsData;
    this._renderUser(this._container, this._filmsData);
  }

  _renderUser(container, filmsData) {
    this._user = new User(getUserRate(filmsData));

    render(container, this._user.getElement());
  }
}
