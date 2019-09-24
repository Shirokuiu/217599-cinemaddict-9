import UserController from "./user-controller";

import Search from "../components/search";

import {render} from "../utils";

export default class HeaderController {
  constructor(filmsData, onSearchDataChange) {
    this._container = document.querySelector(`.header`);
    this._filmsData = filmsData;
    this._search = new Search();
    this._userController = null;
    this._onSearchDataChange = onSearchDataChange;
    this._searchingMode = false;

    this._init();
  }

  _init() {
    render(this._container, this._search.getElement());

    this._search.getElement().querySelector(`.search__field`)
      .addEventListener(`input`, this._onSearchInput.bind(this));
    this._search.getElement().querySelector(`.search__reset`)
      .addEventListener(`click`, this._onBtnResetClick.bind(this));

    this._renderUser(this._container, this._filmsData);
  }

  updateUserData(updateFilms) {
    this._userController.update(updateFilms);
  }

  _renderUser(container, filmsData) {
    this._userController = new UserController(container, filmsData);
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
