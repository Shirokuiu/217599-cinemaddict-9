import Footer from "../components/footer";

import {render} from "../utils";

export default class FooterController {
  constructor(filmsData) {
    this._filmsData = filmsData;
    this._container = document.querySelector(`.footer`);
    this._footer = new Footer(this._getTotalFilms(this._filmsData));

    this._init();
  }

  _init() {
    render(this._container, this._footer.getElement());
  }

  _getTotalFilms(filmsData) {
    return filmsData.length;
  }
}
