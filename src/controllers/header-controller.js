import Search from "../components/search";
import UserContent from "../components/user-content";

import UserController from "./user-controller";

import {render, unrender} from "../utils";

export default class HeaderController {
  constructor(filmsData) {
    this._container = document.querySelector(`.header`);
    this._filmsData = filmsData;
    this._search = new Search();
    this._userContent = new UserContent();
  }

  init() {
    render(this._container, this._search.getElement());
    render(this._container, this._userContent.getElement());
    this._renderUser(this._userContent.getElement(), this._filmsData);
  }

  updateUserData() {
    unrender(this._userContent.getElement());
    this._userContent.removeElement();

    render(this._container, this._userContent.getElement());
    this._renderUser(this._userContent.getElement(), this._filmsData);
  }

  _renderUser(container, filmsData) {
    const userController = new UserController(container, filmsData);

    userController.init();
  }
}
