/**
 * Device detection utilities.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

const MOBILE_UAS = [
  'iPad',
  'iPod',
  'iPhone',
  'Android',
  'BlackBerry',
  'Opera Mini',
  'Windows Phone',
];

const MOBILE_REGEX = new RegExp(MOBILE_UAS.join('|'));
const isOnMobile = () => MOBILE_REGEX.test(navigator.userAgent);

const hasCoarsePointer = () => (
  mediaQuery => mediaQuery && !!mediaQuery.matches // @ts-ignore
)(window.matchMedia && matchMedia('(pointer:coarse'));

const hasOrientation = () => 'orientation' in window;

const isOnTouchable = () => // @ts-ignore
  navigator.msMaxTouchPoints > 0 ||
  navigator.maxTouchPoints > 0 ||
  hasCoarsePointer() ||
  hasOrientation() ||
  isOnMobile();

const screenIsNarrow = (breakPoint=600) =>
  window.matchMedia(`(max-width: ${breakPoint}px)`).matches;

export {
  isOnMobile,
  isOnTouchable,
  screenIsNarrow,
};
