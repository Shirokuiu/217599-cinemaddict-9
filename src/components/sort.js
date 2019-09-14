import Component from "./component";

export default class Sort extends Component {
  getTemplate() {
    return `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort="default">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort="date">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort="rate">Sort by rating</a></li>
  </ul>`;
  }
}
