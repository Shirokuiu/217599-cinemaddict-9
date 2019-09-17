import UserController from "./user-controller";

import Search from "../components/search";
import UserContent from "../components/user-content";

import {render, unrender} from "../utils";

export default class HeaderController {
  constructor(onSearchDataChange) {
    this._container = document.querySelector(`.header`);
    this._filmsData = [];
    this._search = new Search();
    this._userContent = new UserContent();
    this._onSearchDataChange = onSearchDataChange;
    this._searchingMode = false;

    this._init();
  }

  _init() {
    render(this._container, this._search.getElement());
    render(this._container, this._userContent.getElement());

    this._search.getElement().querySelector(`.search__field`)
      .addEventListener(`input`, this._onSearchInput.bind(this));
    this._search.getElement().querySelector(`.search__reset`)
      .addEventListener(`click`, this._onBtnResetClick.bind(this));
  }

  show(filmsData) {
    if (filmsData !== this._filmsData) {
      this._setFilmsData(filmsData);
    }
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

  _setFilmsData(filmsData) {
    this._filmsData = filmsData;

    this._renderUser(this._userContent.getElement(), filmsData);
  }

  _onSearchInput(evt) {
    const {value} = evt.target;

    if (value !== ``) {
      if (value.length > 2) {
        const filmsFound = this._filmsData.filter((film) => {
          return film.filmInfo.title.toLowerCase().includes(value.toLowerCase());
        });
        this._searchingMode = true;
        this._onSearchDataChange(filmsFound, this._searchingMode);
        return;
      }
    }
    this._searchingMode = false;
    this._onSearchDataChange(this._filmsData, this._searchingMode);
  }

  _onBtnResetClick() {
    if (this._searchingMode) {
      this._searchingMode = false;
      this._onSearchDataChange(this._filmsData, this._searchingMode);
    }
  }
}
