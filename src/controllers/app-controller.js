import HeaderController from "./header-controller";
import MainController from "./main-controller";
import FooterController from "./footer-controller";

import {AppSettings} from "../utils";

import API from "../api/api";
import film from "../components/film";

export default class AppController {
  constructor() {
    this._api = new API({endPoint: AppSettings.END_POINT, authorization: AppSettings.AUTHORIZATION});
    this._headerController = new HeaderController(this._onSearchDataChange.bind(this));
    this._mainController = new MainController(this._onAppDataChange.bind(this));
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

  _onAppDataChange(actionStatus, update, context, searchMode) {
    switch (actionStatus) {
      case `update`:
        this._api.updateFilm({
          id: update.id,
          data: update.toRAW()
        })
          .then(() => this._api.getFilms()
            .then((films) => {
              if (!searchMode) {
                this._mainController.updateMenu(films);
              }
              this._headerController.updateUserData(films);
              switch (context) {
                case `films-list`:
                  this._mainController.updateWidgets(films);
                  break;
                case `widget`:
                  this._mainController.updateFilmsList(films);
                  break;
                case `popup`:
                  this._mainController.updateFilmsList(films);
                  this._mainController.updateWidgets(films);
                  break;
              }
            }));
        break;
      case `add-comment`:
        this._api.updateComment({
          id: update.id,
          data: update.toRAW()
        })
          .then(() => this._api.getComments(update.id)
            .then((comments) => {
              this._mainController.updateComments(comments);
            }))
          .then(() =>  this._api.getFilms()
            .then((films) => {
              this._mainController.updateFilmsList(films);
              this._mainController.updateWidgets(films);
            }))
    }
  }
}
