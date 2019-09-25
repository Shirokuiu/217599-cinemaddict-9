import HeaderController from "./header-controller";
import MainController from "./main-controller";
import FooterController from "./footer-controller";

import NoResult from "../components/no-result";

import {AppSettings, debounce, render, setNoResultText, unrender} from "../utils";

import API from "../api/api";

export default class AppController {
  constructor() {
    this._api = new API({endPoint: AppSettings.END_POINT, authorization: AppSettings.AUTHORIZATION});

    this._noResult = new NoResult(setNoResultText(`loading`));

    this._headerController = null;
    this._mainController = null;
    this._footerController = null;

    this._debounce = debounce(this._debounceSearch.bind(this), 1000);
  }

  init() {
    render(document.querySelector(`main`), this._noResult.getElement());

    this._api.getFilms().then((films) => {
      if (!films.length) {
        unrender(this._noResult.getElement());
        this._noResult.removeElement();

        this._noResult = new NoResult(setNoResultText(`empty`));

        render(document.querySelector(`main`), this._noResult.getElement());
      } else {
        unrender(this._noResult.getElement());
        this._noResult.removeElement();
      }
      this._headerController = new HeaderController(films, this._onSearchDataChange.bind(this));
      if (films.length) {
        this._mainController = new MainController(films, this._onAppDataChange.bind(this));
      }
      this._footerController = new FooterController(films);
    });
  }

  _debounceSearch(filmsFound, mode) {
    this._mainController.searchMode(filmsFound, mode);
  }

  _onSearchDataChange(filmsFound, mode) {
    this._debounce(filmsFound, mode);
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
