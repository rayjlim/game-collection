module.exports = {
  ENVIRONMENT: process.env.NODE_ENV,
  FULL_DATE_FORMAT: 'yyyy-MM-dd',
  REST_ENDPOINT: process.env.REACT_APP_API_ENDPOINT,
  LARGE_GAME_SIZE: 25,
  MEDIUM_GAME_SIZE: 10,
  TAG_SET: [
    {
      label: 'to-download',
      color: 'blue',
    },
    {
      label: 'to-install',
      color: 'green',
    },
    {
      label: 'installed',
      color: 'red',
    },
    {
      label: 'pink-paw',
      color: 'magenta',
    },
    {
      label: 'tried',
      color: 'orange',
    },
    {
      label: 'to-review',
      color: 'purple',
    },
    {
      label: 'skip',
      color: 'lime',
    },
    {
      label: 'dl-high',
      color: 'maroon',
    },
    {
      label: 'finished',
      color: 'grey',
    },
    {
      label: 'storyline',
      color: 'purple',
    },
    {
      label: 'techtree',
      color: 'purple',
    },
    {
      label: 'levels',
      color: 'purple',
    },
  ],
};
