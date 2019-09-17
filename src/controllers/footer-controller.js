import Footer from "../components/footer";

import {render} from "../utils";

export default class FooterController {
  constructor(filmsData) {
    this._filmsData = filmsData;
    this._container = document.querySelector(`.footer`);
  }

  show(filmsData) {
    if (filmsData !== this._filmsData) {
      this._setFilmsData(filmsData);
    }
  }

  _renderFooter(container, filmsData) {
    const footer = new Footer(this._getTotalFilms(filmsData));

    render(container, footer.getElement());
  }

  _setFilmsData(filmsData) {
    this._filmsData = filmsData;

    this._renderFooter(this._container, filmsData);
  }

  _getTotalFilms(filmsData) {
    return filmsData.length;
  }
}
