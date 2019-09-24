import CommentsController from "./comments-controller";
import PopupControlsController from "./popup-controls-controller";
import PopupRateController from "./popup-rate-controller";

import FilmPopup from "../components/film-popup";

import API from "../api/api";

import {AppSettings, getTimeFromMinutes, parseWatchingDate, render, unrender} from "../utils";

export default class FilmPopupController {
  constructor(filmsData, onAppDataChange) {
    this._onAppDataChange = onAppDataChange;
    this._filmData = filmsData;
    this._api = new API({endPoint: AppSettings.END_POINT, authorization: AppSettings.AUTHORIZATION});
    this._commentEmotions = AppSettings.COMMENT_EMOTIONS;
    this._container = document.querySelector(`body`);

    this._filmPopup = new FilmPopup(this._filmData, getTimeFromMinutes(this._filmData.filmInfo.runtime));

    this._popupControlsController = new PopupControlsController(this._filmPopup.getElement().querySelector(`.form-details__top-container`), this._filmData, this._onControlsDataChanged.bind(this), this._onControlsDataChange.bind(this), this._onAppDataChange);
    this._popupRateController = new PopupRateController(this._filmPopup.getElement().querySelector(`.form-details__middle-container`), this._filmData, this._onAppDataChange);
    this._commentsController = new CommentsController(this._filmPopup.getElement().querySelector(`.film-details__inner`), this._commentEmotions, this._filmData.id, this._onAppDataChange, this._onCommentsFocusChange.bind(this));

    this._onEscKeyDown = this._onEscKeyDown.bind(this);

    this._init();
  }

  _init() {
    this._filmData.userDetails.watchingDate = parseWatchingDate(this._filmData);

    render(this._container, this._filmPopup.getElement());

    document.addEventListener(`keydown`, this._onEscKeyDown);

    this._filmPopup.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
      document.body.classList.remove(`hide-overflow`);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      this.hide();
    });

    this._api.getComments(this._filmData.id)
      .then((comments) => {
        this._commentsController.update(comments);
      });
  }

  hide() {
    unrender(this._filmPopup.getElement());
    this._filmPopup.removeElement();
  }

  updateControls(updatedFilm) {
    this._popupControlsController.update(updatedFilm);
  }

  updateComments(updatedComments) {
    this._commentsController.update(updatedComments);
  }

  updateRate(updatedRate) {
    this._popupRateController.update(updatedRate);
  }

  rateReject() {
    this._popupRateController.onError(this._filmData);
  }

  controlsReject() {
    this._popupControlsController.onError(this._filmData);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      document.body.classList.remove(`hide-overflow`);
      this.hide();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _onCommentsFocusChange(status) {
    if (status) {
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      return;
    }
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onControlsDataChanged(alreadyWatched) {
    this._popupRateController.unblock();
    if (alreadyWatched) {
      this._filmPopup.getElement().querySelector(`.form-details__middle-container `)
        .classList.remove(`visually-hidden`);
      return;
    }
    this._filmPopup.getElement().querySelector(`.form-details__middle-container `)
      .classList.add(`visually-hidden`);
  }

  _onControlsDataChange(itemControl) {
    if (itemControl === `watched`) {
      this._popupRateController.block();
    }
  }
}
