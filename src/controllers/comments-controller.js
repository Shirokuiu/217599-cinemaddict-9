import CommentsContainer from "../components/comments-container";
import Comments from "../components/comments";

import LocalCommentModel from "../models/local-comment-model";

import API from "../api/api";

import {AppSettings, render, unrender} from "../utils";

import moment from "moment";
import DOMPurify from "dompurify";

export default class CommentsController {
  constructor(container, commentEmotions, filmId, onAppDataChange, onCommentsFocusChange) {
    this._onAppDataChange = onAppDataChange;
    this._onCommentsFocusChange = onCommentsFocusChange;
    this._api = new API({endPoint: AppSettings.END_POINT, authorization: AppSettings.AUTHORIZATION});
    this._commentsData = [];
    this._container = container;
    this._commentEmotions = commentEmotions;
    this._filmId = +filmId;

    this._commentsContainer = new CommentsContainer();
    this._comments = null;

    this._init();
  }

  _init() {
    render(this._container, this._commentsContainer.getElement());
  }

  update(updatedData) {
    unrender(this._commentsContainer.getElement());
    this._commentsContainer.removeElement();

    this._updateData(this._container, updatedData);
  }

  _updateData(container, updatedData) {
    this._commentsData = updatedData;

    this._updateView(container, this._commentsData);
  }

  _updateView(container, updatedData) {
    this._commentsContainer = new CommentsContainer();
    this._comments = new Comments(updatedData, this._commentEmotions);

    render(container, this._commentsContainer.getElement());
    render(this._commentsContainer.getElement(), this._comments.getElement());

    this._comments.getElement().querySelector(`.film-details__comment-input`).addEventListener(`focus`, () => {
      this._onCommentsFocusChange(true);
    });
    this._comments.getElement().querySelector(`.film-details__comment-input`).addEventListener(`blur`, () => {
      this._onCommentsFocusChange(false);
    });
    this._comments.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, this._addComment.bind(this));
    this._comments.getElement().querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, this._onSelectEmojiClick.bind(this));
    [...this._comments.getElement().querySelectorAll(`.film-details__comment-delete`)].forEach((btn) => {
      btn.addEventListener(`click`, (evt) => {
        this._deleteComment(evt);
      });
    });
  }

  _addComment(evt) {
    const img = this._comments.getElement().querySelector(`.film-details__add-emoji-label img`);

    if (evt.metaKey && evt.key === `Enter`) {
      if (evt.target.value === ``) {
        return;
      }
      const localComment = new LocalCommentModel({
        id: this._filmId,
        comment: DOMPurify.sanitize(evt.target.value),
        date: moment(Date.now()).toISOString(),
        emotion: img.alt,
      });
      this._onAppDataChange(`add-comment`, localComment);
      this._blockComments();
    }
  }

  _deleteComment(evt) {
    evt.preventDefault();

    this._onAppDataChange(`delete-comment`, +evt.target.dataset.id, this._filmId);
    this._blockDeleteBtn(evt.target);
  }

  _onSelectEmojiClick(evt) {
    const img = this._comments.getElement().querySelector(`.film-details__add-emoji-label img`);

    if (evt.target.tagName.toLowerCase() !== `input`) {
      return;
    }
    img.classList.remove(`visually-hidden`);
    img.src = `./images/emoji/${evt.target.value}.png`;
    img.alt = `${evt.target.value}`;
  }

  _blockComments() {
    this._commentsContainer.getElement().style.opacity = `0.5`;
    this._comments.getElement().querySelector(`.film-details__comment-input`).disabled = true;
  }

  _blockDeleteBtn(btn) {
    btn.disabled = true;
    btn.textContent = `Deleting…`;
  }
}
