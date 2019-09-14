import Component from "./component";

export default class Footer extends Component {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return `<section class="footer__statistics">
    <p>${this._filmsCount} movies inside</p>
  </section>`;
  }
}
