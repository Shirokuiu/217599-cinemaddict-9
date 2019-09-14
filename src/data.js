export const getFilmMock = () => ({
  poster: [
    `made-for-each-other.png`,
    `popeye-meets-sinbad.png`,
    `sagebrush-trail.jpg`,
    `santa-claus-conquers-the-martians.jpg`,
    `the-dance-of-life.jpg`,
    `the-great-flamarion.jpg`,
    `the-man-with-the-golden-arm.jpg`,
  ][Math.floor(Math.random() * 7)],
  title: [
    `Побег из Шоушенка`,
    `Зеленая миля`,
    `Форрест Гамп`,
    `Король Лев`,
    `Жизнь прекрасна`,
    `Интерстеллар`,
    `Матрица`,
    `Властелин колец: Братство кольца`,
    `Американская история`,
    `Титаник`,
    `Хатико: Самый верный друг`,
    `Шоу Трумана`,
    `Крестный отец 2`,
    `Гран Торино`,
    `Спасти рядового Райана`,
  ][Math.floor(Math.random() * 8)],
  rate: [
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ][Math.floor(Math.random() * 9)],
  userRate: null,
  date: {
    month: [
      `30 March`,
      `20 February`,
      `15 July`,
      `8 September`,
      `3 Octomber`,
      `22 November`,
      `23 December`,
      `5 April`,
      `19 May`,
    ][Math.floor(Math.random() * 9)],
    year: [
      2000,
      1999,
      1996,
      1990,
      2014,
      1986,
      2002,
      2007
    ][Math.floor(Math.random() * 8)],
  },
  filmTable: {
    director: [
      `Anthony Mann`,
      `Anne Wigton`,
      `Heinz Herald`,
      `Richard Weil`,
      `Erich von Stroheim`,
      `Mary Beth Hughes`,
      `Dan Duryea`
    ][Math.floor(Math.random() * 7)],
    writers: [
      `Anthony Mann`,
      `Anne Wigton`,
      `Heinz Herald`,
      `Richard Weil`,
      `Erich von Stroheim`,
      `Mary Beth Hughes`,
      `Dan Duryea`
    ].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 7) - 1),
    actors: [
      `Anthony Mann`,
      `Anne Wigton`,
      `Heinz Herald`,
      `Richard Weil`,
      `Erich von Stroheim`,
      `Mary Beth Hughes`,
      `Dan Duryea`
    ].sort(() => Math.random() - 0.5).slice(0, (Math.floor(Math.random() * 7)) - 1),
    country: [
      `USA`,
      `Russia`,
      `Germany`,
      `Italy`,
      `Great Britain`,
      `France`,
      `Spain`
    ][Math.floor(Math.random() * 7)],
  },
  duration: [
    `1h 55m`,
    `2h 10m`,
    `3h 00m`,
    `1h 35m`,
    `1h 14m`,
    `2h 38m`,
    `1h 39m`,
    `1h 22m`,
  ][Math.floor(Math.random() * 8)],
  category: [
    `Musical`,
    `Drama`,
    `Economics `,
    `Educational`,
    `Epic`,
    `Historical`,
    `Thriller`,
    `Fantasy`,
  ][Math.floor(Math.random() * 8)],
  description: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit`,
    `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,
    `eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.`
  ][Math.floor(Math.random() * 4)],
  comments: new Array(Math.floor(Math.random() * 10)).fill({
    avatar: [
      `angry`,
      `puke`,
      `sleeping`,
      `smile`,
      `trophy`,
    ][Math.floor(Math.random() * 5)],
    comment: [
      `Interesting setting and a good cast`,
      `Booooooooooring`,
      `Very very old. Meh`,
      `Almost two hours? Seriously?`,
    ][Math.floor(Math.random() * 4)],
    author: [
      `Tim Macoveev`,
      `John Doe`,
    ][Math.floor(Math.random() * 2)],
    commentDate: [
      `3 days ago`,
      `2 days ago`,
      `Today`,
    ][Math.floor(Math.random() * 3)],
  }),
  favorite: Boolean(Math.round(Math.random())),
  watchlist: Boolean(Math.round(Math.random())),
  watched: Boolean(Math.round(Math.random())),
  pegi: [
    `18+`,
    `16+`,
    `12+`,
    `21+`,
  ][Math.floor(Math.random() * 4)]
});

export const getMenuMock = () => (
  [
    {
      title: `All movies`,
      count: null,
      isActive: true,
    },
    {
      title: `Watchlist`,
      count: 0,
      isActive: false,
    },
    {
      title: `History`,
      count: 0,
      isActive: false,
    },
    {
      title: `Favorites`,
      count: 0,
      isActive: false,
    },
  ]
);

