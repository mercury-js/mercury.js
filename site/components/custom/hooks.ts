/**
 * Custom hooks.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import {
  useRef,
  useEffect,
  useLayoutEffect
} from 'react';
import {
  past,
  isClient,
  jsonClone
} from '@lib/custom/helpers';

/** Persists a value from a previous render. */
const usePrev = (val: any, clone=false) => {
  const fun = clone ? jsonClone : past;
  const ref = useRef(fun(val));
  // no dep as could be mutable object (by ref)
  useEffect(() => { ref.current = fun(val); }); 
  return ref.current;
};

// NOTE: runs twice in React strictMode dev
/** `useEffect` that runs on every render but the first one. */
const useReRenderEffect = (fun: Function, deps: any[]=[]) => {
  const ref = useRef(0);
  useEffect(() => {
    if ((ref.current)) fun();
    else ref.current = 1; // eslint-disable-next-line
  }, deps);
};

// NOTE: do add helpful note when using this
const useIsomorphicLayoutEffect = isClient()
  ? useLayoutEffect
  : useEffect;

export {
  usePrev,
  useReRenderEffect,
  useIsomorphicLayoutEffect
};
