/**
 * Mouse heuristics.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import {
  dist,
  upTo,
  absMin,
  Grouped,
  getGroupedElems,
} from './helpers';


// NOTE: client coordinates
let xMouse: number, yMouse: number;
const onMouseMove = (evt: MouseEvent) => ({
  x: xMouse,
  y: yMouse,
} = evt);


type RelativeToElem = 'center' | 'closest' | undefined;

function getMouseDistance(
  elem: Element,
  relativeTo: RelativeToElem
) {
  const rect = elem.getBoundingClientRect();
  let { x, y } = rect;
  let dx = x - xMouse;
  let dy = y - yMouse;

  switch (relativeTo) {
    case 'center':
      dx += rect.width  / 2;
      dy += rect.height / 2;
      break;
    case 'closest':
      dx = absMin(dx, rect.right  - xMouse);
      dy = absMin(dy, rect.bottom - yMouse);
      break;
  }

  return dist(dx, dy);
};

/**
 * @note Does not attach mouse tracker.
 * @see getGroupedElems
 * @see getMouseDistance
 * @returns Closest element to mouse.
 */
function getClosestToMouse(
  elems: string | Element[] | NodeList,
  grouper: (elem: Element) => any,
  relativeTo: RelativeToElem = 'closest',
) {
  // TODO: optimize?
  // - n closest: reduce vs. sort
  // - query select elems only once, store and add added
  const grouped = getGroupedElems(elems, grouper); // @ts-ignore
  const _gmd = a => getMouseDistance(a, relativeTo);
  // TODO: (param) filter out if mouse is **on** link?
  Object.values(grouped).forEach(elemArr => elemArr.sort(
    (a, b) => _gmd(a) - _gmd(b)
  ));
  return grouped;
};

// TODO: generalize?
/**
 * @note Assumes all inbound links have root-relative hrefs
 *   (for example "/product/sneakers")
 * @see getClosestToMouse
 * @param callback
 * @param intervalMs
 */
function trackLinksClosestToMouse(
  callback: (grp: Grouped<HTMLAnchorElement>) => void,
  intervalMs=250,
) {
  // TODO: filter by href attribute (absolute) instead?
  window.addEventListener('mousemove', onMouseMove);
  setInterval(() => { callback( // @ts-ignore // TODO: multiple slugs?
    getClosestToMouse('a[href^="/"]', a => upTo(a.href, '/', true), 'closest')
  ); }, intervalMs);
}

export {
  getClosestToMouse,
  trackLinksClosestToMouse,
};
