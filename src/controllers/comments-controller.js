import Comments from "../components/comments";

import {AppSettings, render, unrender} from "../utils";

import moment from "moment";
import LocalCommentModel from "../models/local-comment-model";
import CommentsContainer from "../components/comments-container";
import API from "../api/api";

export default class CommentsController {
  constructor(container, commentEmotions, filmId, onAppDataChange) {
    this._onAppDataChange = onAppDataChange;
    this._api = new API({endPoint: AppSettings.END_POINT, authorization: AppSettings.AUTHORIZATION});
    this._commentsData = [];
    this._container = container;
    this._commentEmotions = commentEmotions;
    this._filmId = +filmId;
    this._commentsContainer = new CommentsContainer();
  }

  init() {
    render(this._container, this._commentsContainer.getElement());
    this._api.getComments(this._filmId)
      .then((comments) => {
        this._commentsData = comments;


        this._renderComments(this._commentsContainer.getElement(), this._commentsData);
        // filmPopup.getElement().querySelector(`.film-details__comment-input`)
        //   .addEventListener(`focus`, () => {
        //     document.removeEventListener(`keydown`, onEscKeyDown);
        //   });
        // filmPopup.getElement().querySelector(`.film-details__comment-input`)
        //   .addEventListener(`blur`, () => {
        //     document.addEventListener(`keydown`, onEscKeyDown);
        //   });
      });
  }

  show(commentsData) {
    if (commentsData !== this._commentsData) {
      // unrender(this._commentsContainer.getElement());
      // this._commentsContainer.removeElement();
      // render(this._container, this._commentsContainer.getElement());

      this._setComments(commentsData);
    }
  }

  _setComments(commentsData) {
    this._commentsData = commentsData;

    this._renderComments(this._commentsContainer.getElement(), this._commentsData);
  }

  _renderComments(container, commentsData) {
    this._comments = new Comments(commentsData, this._commentEmotions);

    const addComment = (evt) => {
      const img = this._comments.getElement().querySelector(`.film-details__add-emoji-label img`);

      if (evt.metaKey && evt.key === `Enter`) {
        if (evt.target.value === ``) {
          return;
        }
        const localComment = new LocalCommentModel({
          id: this._filmId,
          comment: evt.target.value,
          date: moment(Date.now()).toISOString(),
          emotion: img.alt,
        });
        // commentsContainer.getElement().querySelector(`.film-details__comments-list`)
        //   .insertAdjacentHTML(`beforeend`, `<li class="film-details__comment">
        //     <span class="film-details__comment-emoji">
        //       <img src="${img.src}" width="55" height="55" alt="emoji">
        //     </span>
        //     <div>
        //       <p class="film-details__comment-text">${evt.target.value}</p>
        //       <p class="film-details__comment-info">
        //         <span class="film-details__comment-author"></span>
        //         <span class="film-details__comment-day">${moment(Date.now()).format(`YY/MM/DD HH:MM`)}</span>
        //         <button class="film-details__comment-delete">Delete</button>
        //       </p>
        //     </div>
        //   </li>`);
        // evt.target.value = ``;
        // commentsContainer.getElement().querySelector(`.film-details__comments-count`)
        //   .textContent = commentsContainer.getElement().querySelectorAll(`.film-details__comments-list li`).length
        this._onAppDataChange(`add-comment`, localComment);
      }
    };

    const onSelectEmojiClick = (evt) => {
      const img = this._comments.getElement().querySelector(`.film-details__add-emoji-label img`);

      if (evt.target.tagName.toLowerCase() !== `input`) {
        return;
      }
      img.classList.remove(`visually-hidden`);
      img.src = `./images/emoji/${evt.target.value}.png`;
      img.alt = `${evt.target.value}`;
    };

    this._comments.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener('keydown', addComment);
    this._comments.getElement().querySelector(`.film-details__emoji-list`)
      .addEventListener('click', onSelectEmojiClick);

    render(container, this._comments.getElement());
  }

  // _makeLocalComment({comment, date, emotion}) {
  //   return {
  //     comment: comment,
  //     date: date,
  //     emotion: emotion
  //   }
  // }
}
