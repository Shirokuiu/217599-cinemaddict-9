import CommentsController from "./comments-controller";
import FilmPopup from "../components/film-popup";
import FilmPopupContainer from "../components/film-popup-container";

import API from "../api/api";

import {render, unrender} from "../utils";

export default class FilmPopupController {
  constructor(commentEmotions, runtime, authorization, endPoint) {
    this._authorization = authorization;
    this._endPoint = endPoint;
    this._api = new API({endPoint: this._endPoint, authorization: this._authorization});
    this._commentEmotions = commentEmotions;
    this._runtime = runtime;
    this._container = document.querySelector(`body`);
    this.filmPopupContainer = new FilmPopupContainer();
  }

  hide() {
    unrender(this.filmPopupContainer.getElement());
    this.filmPopupContainer.removeElement();
  }

  show(filmData) {
    this._setFilmData(filmData);
  }

  _setFilmData(filmData) {
    this.filmData = filmData;
    this._updateFilmPopupController(filmData);
  }

  _updateFilmPopupController(filmData) {
    render(this._container, this.filmPopupContainer.getElement());
    this._renderFilmPopup(this.filmPopupContainer.getElement(), filmData);
  }

  _renderFilmPopup(container, filmData) {
    const filmPopup = new FilmPopup(filmData, this._runtime);
    const commentsController = new CommentsController(filmPopup.getElement().querySelector(`.form-details__bottom-container`), this._commentEmotions);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        document.body.classList.remove(`hide-overflow`);
        this.hide();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    filmPopup.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
      document.body.classList.remove(`hide-overflow`);
      this.hide();
    });

    render(container, filmPopup.getElement());

    this._api.getComments(filmData.id)
      .then((comments) => {
        commentsController.show(comments);
        document.addEventListener(`keydown`, onEscKeyDown);
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
}
