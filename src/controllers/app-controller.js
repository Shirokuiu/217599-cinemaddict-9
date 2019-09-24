import HeaderController from "./header-controller";
import MainController from "./main-controller";
import FooterController from "./footer-controller";

import {AppSettings, render, setNoResultText, unrender} from "../utils";

import API from "../api/api";
import NoResult from "../components/no-result";

export default class AppController {
  constructor() {
    this._api = new API({endPoint: AppSettings.END_POINT, authorization: AppSettings.AUTHORIZATION});

    this._noResult = new NoResult();

    this._headerController = null;
    this._mainController = null;
    this._footerController = null;
  }

  init() {
    this._renderNoResult(false, `loading`, document.querySelector(`.main`));

    this._api.getFilms().then((films) => {
      this._onLoadFilmsChange();
      this._headerController = new HeaderController(films, this._onSearchDataChange.bind(this));
      this._mainController = new MainController(films, this._onAppDataChange.bind(this));
      this._footerController = new FooterController(films);
    });
  }

  _renderNoResult(remove = false, state = `no-result`, container) {
    unrender(this._noResult.getElement());
    this._noResult.removeElement();
    if (remove) {
      return;
    }
    this._noResult = new NoResult(setNoResultText(state));
    render(container, this._noResult.getElement());
  }

  _onLoadFilmsChange() {
    this._renderNoResult(true);
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
          .then((film) => this._api.getFilms()
            .then((films) => {
              this._mainController.updateData(films);
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
                  this._mainController.updatePopupControls(film);
                  break;
              }
            }))
          .catch(() => {
            this._mainController.popupControlsReject();
          });
        break;
      case `update-rate`:
        this._api.updateFilm({
          id: update.id,
          data: update.toRAW()
        }).then((updatedRate) => {
          this._mainController.updateRate(updatedRate);
        })
          .then(() => this._api.getFilms()
            .then((films) => {
              this._mainController.updateFilmsList(films);
              this._mainController.updateWidgets(films);
            }))
          .catch(() => this._mainController.rateReject());
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
          .then(() => this._api.getFilms()
            .then((films) => {
              this._mainController.updateFilmsList(films);
              this._mainController.updateWidgets(films);
            }));
        break;
      case `delete-comment`:
        this._api.deleteComment(update)
          .then(() => this._api.getComments(context)
            .then((comments) => {
              this._mainController.updateComments(comments);
            })
          )
          .then(() => this._api.getFilms()
            .then((films) => {
              this._mainController.updateFilmsList(films);
              this._mainController.updateWidgets(films);
            }));
        break;
    }
  }
}
