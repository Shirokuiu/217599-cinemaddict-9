import HeaderController from "./header-controller";
import MainController from "./main-controller";
import FooterController from "./footer-controller";

import {getFilmMock} from "../data";

export default class AppController {
  constructor() {
    this._filmsData = this._makeData();
    this._headerController = new HeaderController(this._filmsData);
    this._onDataChangeApp = this._onDataChangeApp.bind(this);
    this._mainController = new MainController(this._filmsData, this._onDataChangeApp);
    this._footerController = new FooterController(this._filmsData);
  }

  init() {
    this._headerController.init();
    this._mainController.init();
    this._footerController.init();
  }

  _makeData() {
    const newData = new Array(15).fill().map(getFilmMock);

    newData.forEach((it, idx) => {
      it.id = idx;
    });
    return newData;
  }

  _onDataChangeApp() {
    this._headerController.updateUserData();
  }
}
