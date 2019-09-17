import Component from "./component";

export default class NoResult extends Component {
  getTemplate() {
    return `<div class="no-result">
        There is no movies for your request.
      </div>`;
  }
}
