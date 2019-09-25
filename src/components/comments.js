import Component from "./component";

import moment from "moment";

export default class Comments extends Component {
  constructor(commentsData, commentEmotions) {
    super();
    this._commentsData = commentsData;
    this._commentEmotions = commentEmotions;
  }

  getTemplate() {
    return `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">
          Comments <span class="film-details__comments-count">${this._commentsData.length}</span>
        </h3>

        <ul class="film-details__comments-list">
          ${this._commentsData.map(({id, emotion, comment, author, date}) => `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
            </span>
            <div>
              <p class="film-details__comment-text">${comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${moment(date).fromNow()}</span>
                <button class="film-details__comment-delete" data-id="${id}">Delete</button>
              </p>
            </div>
          </li>`).join(``)}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
            <span class="film-details__error-message film-details__error-message--img visually-hidden">Choose emoji</span>
            <img class="visually-hidden" src="images/emoji/smile.png" width="55" height="55" alt="">
          </div>

          <label class="film-details__comment-label">
            <span class="film-details__error-message film-details__error-message--textarea visually-hidden">Please, fill this field</span>
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>
          <div class="film-details__emoji-list">
            ${this._commentEmotions.map((emotion) => `<input 
              class="film-details__emoji-item visually-hidden" 
              name="comment-emoji" 
              type="radio" 
              id="emoji-${emotion}" 
              value="${emotion}"
            >
            <label class="film-details__emoji-label" for="emoji-${emotion}">
              <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
            </label>`).join(``)}
          </div>
        </div>
      </section>`;
  }
}
