import User from "../components/user";

import {getUserRate, render, unrender} from "../utils";

export default class UserController {
  constructor(container, filmsData) {
    this._filmsData = filmsData;
    this._container = container;
    this._user = new User(getUserRate(this._filmsData));

    this._init();
  }

  _init() {
    render(this._container, this._user.getElement());
  }

  update(updatedData) {
    unrender(this._user.getElement());
    this._user.removeElement();

    this._updateData(this._container, updatedData);
  }

  _updateData(container, updatedData) {
    this._filmsData = updatedData;

    this._updateView(container, this._filmsData);
  }

  _updateView(container, updatedData) {
    this._user = new User(getUserRate(updatedData));

    render(container, this._user.getElement());
  }
}
