/**
 * Mouse heuristics.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import { absMin, dist, getGroupedElems } from './helpers';


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

// TODO: (n)ClosestTo

// TODO: API
export {};
