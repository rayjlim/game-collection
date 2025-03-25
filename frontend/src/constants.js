export default {};
export const ENVIRONMENT = process.env.NODE_ENV;
export const FULL_DATE_FORMAT = 'yyyy-MM-dd';
export const REST_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
export const LARGE_GAME_SIZE = 25;
export const MEDIUM_GAME_SIZE = 10;
export const TAG_SET = [
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
];
