import PopupControls from "../components/popup-controls";

import {render} from "../utils";

export default class PopupControlsController {
  constructor(container, filmData, onControlsDataChange) {
    this._onControlsDataChange = onControlsDataChange;
    this._container = container;
    this._filmData = filmData;
    this._popupControls = new PopupControls(this._filmData.userDetails);
  }

  init() {
    render(this._container, this._popupControls.getElement());
    this._popupControls.getElement().addEventListener(`click`, this._onControlsClick.bind(this));
  }

  _onControlsClick(evt) {
    if (evt.target.tagName.toLowerCase() !== `input`) {
      return;
    }
    this._onControlsDataChange(evt.target);
  }
}
