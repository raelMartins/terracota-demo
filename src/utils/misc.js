import {formatWithCommas} from './formatAmount';

export const timeRelativeGreeting = name => {
  let TIME_OF_DAY = '';
  let time = new Date().getHours();

  // if (time >= 5 && time < 12) {
  if (time >= 0 && time < 12) {
    TIME_OF_DAY = 'morning';
  } else if (time >= 12 && time < 17) {
    TIME_OF_DAY = 'afternoon';
    // } else if (time >= 17 || time < 5) {
  } else if (time >= 17) {
    TIME_OF_DAY = 'evening';
  }
  return `Good ${TIME_OF_DAY}${name ? ` ${name?.trim()}` : ``}`;

  return;
};

export const splitArrayIntoChunks = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array?.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

export const randomBackgroundColor = () => {
  const colors = [
    '#2A2F36',
    '#183D3D',
    '#3B2338',
    `#000035`,
    `#4f276e`,
    `#225559`,
    `#c0eaed`,
    `#9e9e28`,
    `#5c5c47`,
    `#7d5f72`,
  ];

  return colors?.[Math.floor(Math.random() * colors?.length)];
};

export const capitalizeString = string => {
  const capitalized_string = string
    ?.split(' ')
    ?.map(el => el?.charAt(0).toUpperCase() + el?.slice(1))
    ?.join(' ')
    ?.split('-')
    ?.map(el => el?.charAt(0).toUpperCase() + el?.slice(1))
    ?.join('-')
    ?.split('_')
    ?.map(el => el?.charAt(0).toUpperCase() + el?.slice(1))
    ?.join('_');

  return capitalized_string;
};

export const formatPropertySize = string => {
  return !isNaN(string * 1) ? `${formatWithCommas(string * 1)} sqm` : string;
};

export const checkIfSFH = info => {
  const isSFH =
    info?.building_type === 'Detached' ||
    info?.building_type === 'Semi Detached' ||
    info?.building_type === 'Land' ||
    info?.unit?.project?.building_type === 'Detached' ||
    info?.unit?.project?.building_type === 'Semi Detached' ||
    info?.unit?.project?.building_type === 'Land';
  return isSFH;
};
