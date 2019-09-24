import moment from "moment";

export const AppSettings = {
  AUTHORIZATION: `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`,
  END_POINT: `https://htmlacademy-es-9.appspot.com/cinemaddict/`,
  COMMENT_EMOTIONS: [`smile`, `sleeping`, `puke`, `angry`],
  FILMS_TO_ROW: 5,
  PREVIEW_DESCRIPTION_LENGTH: 139,
  PERSONAL_RATING_POINTS: {
    START: 1,
    END: 9
  }
};

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const getUserRate = (filmsData) => {
  const watchedList = filmsData.filter(({userDetails}) => userDetails.alreadyWatched).length;

  if (watchedList <= 10) {
    return `novice`;
  }

  if (watchedList > 10 && watchedList < 20) {
    return `fan`;
  }

  if (watchedList > 19) {
    return `movie buff`;
  }

  return undefined;
};

export const getTimeFromMinutes = (mins) => {
  let hours = Math.trunc(mins / 60);
  let minutes = mins % 60;
  return `${hours}h ${minutes}m`;
};

export const calculateGenres = (filmsWatched) => {
  return filmsWatched.map((film) => film.filmInfo.genre)
    .reduce((first, second) => first.concat(second))
    .map((name) => {
      return {
        count: 1,
        name
      };
    })
    .reduce((first, second) => {
      first[second.name] = (first[second.name] || 0) + second.count;
      return first;
    }, {});
};

export const setNoResultText = (state) => {
  let resultText = ``;

  switch (state) {
    case `loading`:
      resultText = `Loading…`;
      break;
    case `no-result`:
      resultText = `There is no movies for your request.`;
      break;
  }
  return resultText;
};

export const resetButtons = (element, className, defaultState = false) => {
  [...element.getElement().querySelectorAll(`.${className}`)]
    .forEach((item) => item.classList.remove(`${className}--active`));

  if (defaultState) {
    element.getElement().querySelectorAll(`.${className}`)[0]
      .classList.add(`${className}--active`);
  }
};

export const parseWatchingDate = (filmData) => {
  if (filmData.userDetails.watchingDate) {
    return moment(filmData.userDetails.watchingDate).toISOString();
  }
  return moment(Date.now()).toISOString();
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, component, place = Position.BEFOREEND) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(component);
      break;
    case Position.BEFOREEND:
      container.append(component);
      break;
  }
};

export const unrender = (component) => {
  if (component) {
    component.remove();
  }
};
