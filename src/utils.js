export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
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
