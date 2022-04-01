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
  useState,
  useEffect,
  useLayoutEffect,
  MutableRefObject,
  // @ts-ignore
  startTransition,
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
const useRerenderEffect = (fun: Function, deps: any[]=[]) => {
  const ref = useRef(0);
  useEffect(() => {
    if ((ref.current)) fun();
    else ref.current = 1; // eslint-disable-next-line
  }, deps);
};

// NOTE: adds some overhead vs. just using a ref
/** Binds a ref as function argument (closure workaround). */
const useBindRef = <A, B, C>(
  dep: A,
  fun: (depRef: MutableRefObject<A>, ...args: B[]
) => C) => {
  const ref = useRef(dep);
  useEffect(() => { ref.current = dep; }, [dep]);
  return fun.bind(null, ref);
};

// TODO: check (purpose)
/**
 * Allows marking updates
 * within custom hooks as non-urgent
 * without refactoring them.
 */
const useCustomHookTransition = (_val: any) => {
  const [val, setVal] = useState(_val);
  useEffect(() => {
    startTransition(() => {
      setVal(_val);
    });
  }, [_val]);
  return val;
};

/** Forces a rerender. */
const useRerender = () => (f => () => f(b => ++b))(useState(0)[1]);

// NOTE: do add helpful note when using this
const useIsomorphicLayoutEffect = isClient()
  ? useLayoutEffect
  : useEffect;

export {
  usePrev,
  useBindRef,
  useRerender,
  useRerenderEffect,
  useCustomHookTransition,
  useIsomorphicLayoutEffect
};
