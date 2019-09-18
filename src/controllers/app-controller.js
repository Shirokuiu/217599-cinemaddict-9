import HeaderController from "./header-controller";
import MainController from "./main-controller";
import FooterController from "./footer-controller";

import {AppSettings} from "../utils";

import API from "../api/api";

export default class AppController {
  constructor() {
    this._api = new API({endPoint: AppSettings.END_POINT, authorization: AppSettings.AUTHORIZATION});

    this._headerController = new HeaderController(this._onSearchDataChange.bind(this));
    this._mainController = new MainController(AppSettings.AUTHORIZATION, AppSettings.END_POINT, AppSettings.COMMENT_EMOTIONS);
    this._footerController = new FooterController();
  }

  init() {
    this._api.getFilms().then((films) => {
      this._headerController.show(films);
      this._mainController.show(films);
      this._footerController.show(films);
    }).then(() => {
      this._mainController.filmsIsLoaded();
    });
  }

  _onSearchDataChange(filmsFound, mode) {
    this._mainController.searchMode(filmsFound, mode);
  }
}
