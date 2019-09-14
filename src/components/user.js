import Component from "./component";

export default class User extends Component {
  constructor(userRate) {
    super();
    this._userRate = userRate;
  }

  getTemplate() {
    return `<section class="header__profile profile">
    <p class="profile__rating">${this._userRate}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
  }
}
