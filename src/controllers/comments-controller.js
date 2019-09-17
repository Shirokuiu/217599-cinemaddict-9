import CommentsContainer from "../components/comments-container";

import {render} from "../utils";

export default class CommentsController {
  constructor(container, commentEmotions) {
    this._commentsData = [];
    this._container = container;
    this._commentEmotions = commentEmotions;
  }

  show(commentsData) {
    if (commentsData !== this._commentsData) {
      this._setComments(commentsData);
    }
  }

  _renderComments(container, commentsData) {
    const commentsContainer = new CommentsContainer(commentsData, this._commentEmotions);

    render(this._container, commentsContainer.getElement());
  }

  _setComments(commentsData) {
    this._commentsData = commentsData;

    this._renderComments(this._container, commentsData);
  }
}
