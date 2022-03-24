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

// NOTE: param distances always elem - mouse, d0 top/left-most
const _minDist = (d0: number, d1: number) =>
  d0 < 0 && d1 > 0 ? 0 : absMin(d0, d1);

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
      dx = _minDist(dx, rect.right  - xMouse);
      dy = _minDist(dy, rect.bottom - yMouse);
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
  maxDistancePx=0,
  nClosestPerGroup=0, // NOTE: >0 will sort
  relativeTo: RelativeToElem = 'closest',
) {
  // TODO: query select elems once & mutate groups?
  const grouped = getGroupedElems(elems, grouper);
  
  const _distance = (
    elem: Element
  ) => getMouseDistance(elem, relativeTo);
  
  // NOTE: must return modified group (in-place is OK)
  const _modifyEachGroup = (
    func: (group: Element[]) => Element[]
  ) => Object.entries(grouped).forEach(([ key, group ]) => {
    grouped[key] = func(group);
  });

  // NOTE:
  // - separate passes over groups
  // - filter first
  
  if (maxDistancePx) _modifyEachGroup(group => group
    .filter(elem => _distance(elem) <= maxDistancePx)
  );

  if (nClosestPerGroup) _modifyEachGroup(group => group
    .sort((a, b) => _distance(a) - _distance(b))
    .slice(0, nClosestPerGroup)
  );

  return grouped;
};


// TODO: split and intersect for `getClosestToMouse`?
const MOUSE_HEURISTICS_OPTIONS = Object.freeze({
  intervalMs: 1000,
  groupByPage: true,
  maxDistancePx: 100,
  nClosestPerGroup: 2, // >0 will sort
  includedPathPrefixes: ['/'],
});

export type MouseHeuristicsOptions = Partial<
  typeof MOUSE_HEURISTICS_OPTIONS
>;

// TODO: generalize?
/**
 * @note Assumes all inbound links have root-relative hrefs
 *   (for example "/product/sneakers")
 * @param mouseHeuristicsOptions - Merged with
 *     {@link MOUSE_HEURISTICS_OPTIONS defaults}.
 * @see getClosestToMouse
 */
function trackLinksClosestToMouse(
  callback: (grp: Grouped<HTMLAnchorElement>) => void,
  mouseHeuristicsOptions: MouseHeuristicsOptions,
) {  
  const {
    intervalMs,
    groupByPage,
    maxDistancePx,
    nClosestPerGroup,
    includedPathPrefixes,
  } = Object.assign({},
    MOUSE_HEURISTICS_OPTIONS,
    mouseHeuristicsOptions
  );
  
  // TODO:?
  // - filter by href attribute (absolute) instead
  // - multiple slugs
  // - optimize
  window.addEventListener('mousemove', onMouseMove);
  const selector = includedPathPrefixes
    .map(p => `a[href^="${p}"]`)
    .join(',');
  const grouper = groupByPage
    ? (a: any) => upTo(a.href, '/', true)
    : () => ''; // all-in-one (key)
  // @ts-ignore (we know we'll have groups of <a>)
  setInterval(() => { callback(getClosestToMouse(
    selector,
    grouper,
    maxDistancePx,
    nClosestPerGroup,
    'closest'
  )); }, intervalMs);
}

export {
  getClosestToMouse,
  trackLinksClosestToMouse,
};
