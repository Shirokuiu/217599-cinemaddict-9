import CommentsController from "./comments-controller";
import FilmPopup from "../components/film-popup";
import FilmPopupContainer from "../components/film-popup-container";

import API from "../api/api";

import {AppSettings, getTimeFromMinutes, parseWatchingDate, render, unrender} from "../utils";
import PopupControlsController from "./popup-controls-controller";
import PopupRateController from "./popup-rate-controller";
import CommentsContainer from "../components/comments-container";

export default class FilmPopupController {
  constructor(onAppDataChange) {
    this._onAppDataChange = onAppDataChange;
    this._filmData = [];
    // this._api = new API({endPoint: AppSettings.END_POINT, authorization: AppSettings.AUTHORIZATION});
    this._commentEmotions = AppSettings.COMMENT_EMOTIONS;
    this._container = document.querySelector(`body`);

    this._filmPopupContainer = new FilmPopupContainer();
    this._popupRateController = new PopupRateController();
    this._commentsController = new CommentsController();
  }

  hide() {
    this._renderPopupContainer(true);
  }

  show(filmData) {
    filmData.userDetails.watchingDate = parseWatchingDate(filmData);

    this._renderPopupContainer();
    this._setFilmData(filmData);
  }

  updateComments(updatedComments) {
    this._commentsController.show(updatedComments);
  }

  _setFilmData(filmData) {
    this._filmData = filmData;
    this._renderFilmPopup(this._filmPopupContainer.getElement(), filmData);
  }

  _renderPopupContainer(remove = false) {
    if (remove) {
      unrender(this._filmPopupContainer.getElement());
      this._filmPopupContainer.removeElement();
      return;
    }
    render(this._container, this._filmPopupContainer.getElement());
  }

  _renderFilmPopup(container, filmData) {
    const filmPopup = new FilmPopup(filmData, getTimeFromMinutes(filmData.filmInfo.runtime));
    const popupControlsController = new PopupControlsController(filmPopup.getElement().querySelector(`.form-details__top-container`), filmData, this._onControlsDataChange.bind(this));
    this._popupRateController = new PopupRateController(filmPopup.getElement().querySelector(`.form-details__middle-container`), this._onSelectRateDataChange.bind(this));
    this._commentsController = new CommentsController(filmPopup.getElement(), this._commentEmotions, filmData.id, this._onAppDataChange);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        document.body.classList.remove(`hide-overflow`);
        this.hide();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    document.addEventListener(`keydown`, onEscKeyDown);

    filmPopup.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
      document.body.classList.remove(`hide-overflow`);
      document.removeEventListener(`keydown`, onEscKeyDown);
      this.hide();
    });

    render(container, filmPopup.getElement());
    popupControlsController.init();
    this._popupRateController.show(filmData);
    this._commentsController.init();

    // this._api.getComments(filmData.id)
    //   .then((comments) => {
    //     this._commentsController.show(comments);
    //     filmPopup.getElement().querySelector(`.film-details__comment-input`)
    //       .addEventListener(`focus`, () => {
    //         document.removeEventListener(`keydown`, onEscKeyDown);
    //       });
    //     filmPopup.getElement().querySelector(`.film-details__comment-input`)
    //       .addEventListener(`blur`, () => {
    //         document.addEventListener(`keydown`, onEscKeyDown);
    //       });
    //   });
  }

  _onControlsDataChange(controlItem) {
    this._filmData.userDetails[this._userDetailsToRAW()[controlItem.id]] = controlItem.checked;

    if (controlItem.id === `watched`) {
      this._filmPopupContainer.getElement().querySelector(`.form-details__middle-container `)
        .classList.toggle(`visually-hidden`);
    }

    this._onAppDataChange(`update`, this._filmData, `popup`);
  }

  _onSelectRateDataChange(rateValue) {
    this._filmData.userDetails.personalRating = rateValue;

    this._onAppDataChange(`update`, this._filmData, `popup`);
  }

  _userDetailsToRAW() {
    return {
      watchlist: `watchlist`,
      watched: `alreadyWatched`,
      favorite: `favorite`
    }
  }
}
