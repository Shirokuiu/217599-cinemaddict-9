import CommentsController from "./comments-controller";
import FilmPopup from "../components/film-popup";
import FilmPopupContainer from "../components/film-popup-container";

import API from "../api/api";

import {AppSettings, getTimeFromMinutes, parseWatchingDate, render, unrender} from "../utils";

export default class FilmPopupController {
  constructor(onAppDataChange) {
    this._onAppDataChange = onAppDataChange;
    this._api = new API({endPoint: AppSettings.END_POINT, authorization: AppSettings.AUTHORIZATION});
    this._commentEmotions = AppSettings.COMMENT_EMOTIONS;
    this._container = document.querySelector(`body`);

    this.filmPopupContainer = new FilmPopupContainer();
  }

  hide() {
    this._renderPopupContainer(true);
  }

  show(filmData) {
    filmData.userDetails.watchingDate = parseWatchingDate(filmData);

    this._renderPopupContainer();
    this._setFilmData(filmData);
  }

  _setFilmData(filmData) {
    this._renderFilmPopup(this.filmPopupContainer.getElement(), filmData);
  }

  _renderPopupContainer(remove = false) {
    if (remove) {
      unrender(this.filmPopupContainer.getElement());
      this.filmPopupContainer.removeElement();
      return;
    }
    render(this._container, this.filmPopupContainer.getElement());
  }

  _renderFilmPopup(container, filmData) {
    const filmPopup = new FilmPopup(filmData, getTimeFromMinutes(filmData.filmInfo.runtime));
    const commentsController = new CommentsController(filmPopup.getElement().querySelector(`.form-details__bottom-container`), this._commentEmotions);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        document.body.classList.remove(`hide-overflow`);
        this.hide();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onPopupControlsClick = (evt) => {
      if (evt.target.tagName.toLowerCase() !== `input`) {
        return;
      }
      filmData.userDetails.watchlist = filmPopup.getElement().querySelector(`#watchlist`).checked;
      filmData.userDetails.alreadyWatched = filmPopup.getElement().querySelector(`#watched`).checked;
      filmData.userDetails.favorite = filmPopup.getElement().querySelector(`#favorite`).checked;

      if (evt.target.id === `watched` && evt.target.checked === false) {
        this._resetRate(filmPopup.getElement(), filmData, true);
      } else {
        filmPopup.getElement().querySelector(`.form-details__middle-container`)
          .classList.toggle(`visually-hidden`);
      }

      this._onAppDataChange(`update`, filmData, `popup`);
    };

    const onUndoClick = () => {
      if (filmData.userDetails.personalRating) {
        this._resetRate(filmPopup.getElement(), filmData);
      }
    };

    const onSelectRatingClick = (evt) => {
      if (evt.target.tagName.toLowerCase() !== `input`) {
        return;
      }
      this._selectRate(filmPopup.getElement(), filmData, +evt.target.value);
    };

    document.addEventListener(`keydown`, onEscKeyDown);

    filmPopup.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
      document.body.classList.remove(`hide-overflow`);
      document.removeEventListener(`keydown`, onEscKeyDown);
      this.hide();
    });

    filmPopup.getElement().querySelector(`.film-details__controls`)
      .addEventListener(`click`, onPopupControlsClick);
    filmPopup.getElement().querySelector(`.film-details__user-rating-score`)
      .addEventListener(`click`, onSelectRatingClick);
    filmPopup.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, onUndoClick);

    render(container, filmPopup.getElement());

    this._api.getComments(filmData.id)
      .then((comments) => {
        commentsController.show(comments);
        filmPopup.getElement().querySelector(`.film-details__comment-input`)
          .addEventListener(`focus`, () => {
            document.removeEventListener(`keydown`, onEscKeyDown);
          });
        filmPopup.getElement().querySelector(`.film-details__comment-input`)
          .addEventListener(`blur`, () => {
            document.addEventListener(`keydown`, onEscKeyDown);
          });
      });
  }

  _selectRate(element, filmData, rateNumber) {
    this._block(element);
    this._api.updateFilm({
      id: filmData.id,
      data: filmData.toRAW()
    })
      .then(() => {
        this._unBlock(element);
        filmData.userDetails.personalRating = rateNumber;
      })
      .catch(() => {
        this._unBlock(element);
      })
  }

  _resetRate(element, filmData, remove = false) {
    this._block(element);
    this._api.updateFilm({
      id: filmData.id,
      data: filmData.toRAW()
    }).then(() => {
      this._unBlock(element);
      filmData.userDetails.personalRating = 0;
      [...element.querySelectorAll(`.film-details__user-rating-input`)].forEach((rate) => {
        rate.checked = false;
      });

      if (remove) {
        element.querySelector(`.form-details__middle-container`)
          .classList.toggle(`visually-hidden`);
      }
    })
      .catch(() => {
        element.querySelector(`#watched`).checked = true;
        this._unBlock(element);
      });
  }

  _block(element) {
    element.querySelector(`.film-details__user-rating-wrap`).style.opacity = `0.5`;
    element.querySelector(`#watched`).disabled = true;
    element.querySelector(`.film-details__watched-reset`).disabled = true;
    [...element.querySelectorAll(`.film-details__user-rating-input`)].forEach((rate) => {
      rate.disabled = true;
    })
  }

  _unBlock(element) {
    element.querySelector(`.film-details__user-rating-wrap`).style.opacity = `1`;
    element.querySelector(`#watched`).disabled = false;
    element.querySelector(`.film-details__watched-reset`).disabled = false;
    [...element.querySelectorAll(`.film-details__user-rating-input`)].forEach((rate) => {
      rate.disabled = false;
    })
  }
}
