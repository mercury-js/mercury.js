/**
 * General custom helpers.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

/* TODO:
 - JSOcd
*/


/* HOF */

const mapperReduce = <T>(
  g: (x: T, y: T) => T,
  f: (x: T) => T,
) => (...xs: T[]) => xs.slice(1).reduce((a, e) => g(a, f(e)), f(xs[0]));


/* Env */

const isClient = () => typeof window !== 'undefined';


/* DOM */

/**
 * Calls `cb` immediately if `docArg` is no longer in loading,
 * i.e. its ready state is either "interactive" or "complete",
 * else on `DOMContentLoaded`. In other words, guarantees that
 * `cb` is called ASAP and that DOM nodes are available (incl.
 * after the fact).
 * 
 * @param cb - Callback.
 * @param docArg - Falls back to main `document`. 
 */
function onceDOMLoad(cb:Function, docArg?:Document) {
  const doc = docArg || document;
  if (doc.readyState !== 'loading') cb(); // don't pass args
  else doc.addEventListener('DOMContentLoaded', () => cb());
};

/**
 * DRY convenience to always resolve `nodeOrSelector` to a `Node`.
 * @param nodeOrSelector - A `Node` or a valid CSS selector.
 *     Falsy or failed selector falls back to main `document`.
 */
const getNode = (nodeOrSelector?: string|Node) => (
  typeof nodeOrSelector === 'string'
    ? document.querySelector(nodeOrSelector)
    : nodeOrSelector
) || (document);

/**
 * Calls `callback` on all nodes added to DOM (callback filters).
 * @param callback - Passed each added node.
 * @param nodeOrSelector - Observation target or a valid CSS selector.
 *     E.g. 'body'. Falsy falls back to main `document`.
 * @param options - Optional additional options to `MutationObserver.observe`.
 */
function addAddedNodeObserver(
  callback: (node: Node)=> any,
  nodeOrSelector?: Node|string,
  options: Object={},
) {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(addedNodes => {
        callback(addedNodes);
      });
    });
  });

  const node = getNode(nodeOrSelector);
  if ((!node)) return;

  observer.observe(node, {
    subtree: true,
    childList: true,
    ...options,
  });
  return observer;
}

/**
 * Calls `callback` on matching nodes curently in **&** later added to DOM.
 * @param callback - Passed each matching node (responsible for filtering).
 * @param nodeName - Valid DOM `Node.nodeName` (case-insensitive). E.g.'a'.
 * @param nodeOrSelector - Root node, or a valid CSS selector. E.g. 'body'.
 *     Falls back to main `document`.
 * @note Ensures that DOM has loaded.
 */
function applyToNodes(
  callback: (node: Node) => any,
  nodeName: string,
  nodeOrSelector?: Node|string,
) { onceDOMLoad(() => {
  nodeName = nodeName.toUpperCase();
  const rootNode = getNode(nodeOrSelector); // @ts-ignore
  const currentNodes = rootNode.querySelectorAll(nodeName);
  currentNodes.forEach( // in DOM now
    (currentNode: Node) => callback(currentNode)
  );

  // @ts-ignore
  // added to DOM later
  addAddedNodeObserver((addedNode: Element) => {
    if (addedNode.nodeName === nodeName) callback(addedNode);
    if (addedNode.querySelectorAll) { // check children too
      const addedChildNodes = addedNode.querySelectorAll(nodeName);
      addedChildNodes.forEach(addedChildNode => callback(addedChildNode));
    }
  }, rootNode);
}); }

/**
 * Adds `callback` to given `element` enetring the user viewport.
 * @param element - Observed element.
 * @param callback - Called, when `element` enters user viewport.
 * @param options - Passed to `IntersectionObserver` constructor.
 */
const addOnVisible = (
  element: Element,
  callback: Function,
  options?: Object,
) => new IntersectionObserver(([entry]) => {
  entry.isIntersecting && callback();
}, options).observe(element);

/**
 * @param elems - Selector or superset of elements.
 * @param grouper - Subset grouper.
 * @returns Grouped elements.
 */
function getGroupedElems(
  elems: string | Element[] | NodeList,
  grouper: (elem: Element) => any,
) {
  if (typeof elems === 'string')
    elems = document.querySelectorAll(elems);
  
  return groupBy<Element>(
    elems as Iterable<Element>,
    grouper
  );

};


// <a> & href

// NOTE: captures lead/trailing slash
const REGEXP_HREF_PATH = /(^https?:\/\/.*?(\/|$))|(^\/)|(\/$)|(\?.*)/g;
const hrefToPath = (href: string, prefix='/') => prefix + href.replaceAll(
  REGEXP_HREF_PATH, ''
);

const hrefIsInbound = (href: string) => href?.startsWith(
  window.location.origin + '/'
);

// TODO: reuse inbound knowledge for perf?
const getInboundAElemPath = (aElem: HTMLAnchorElement) => (
  (href: string) => hrefIsInbound(href) && hrefToPath(href)
)(aElem.href);

// misc

const elemIsHidden = (elem: HTMLElement) => (
  elem?.style?.display === 'none'
);

const getQuery = (url: string) => (
  q => q ? Object.fromEntries(q
    .split('&')
    .map(x => x.split('='))
  ) : {}
)(url.split('?')[1]);


/* RegExp (general) */

const REGEXP_ESCAPE = /[.*+?^${}()|[\]\\]/g;
const escapeRegExp = (s: string) => s.replaceAll(REGEXP_ESCAPE, '\\$&');
const getRawRegExp = (s: string) => new RegExp(escapeRegExp(s));


/* Object utils */

const isArr = Array.isArray;
const toArr = (x: any) => isArr(x) ? x : [x];
const iterToArr = <T>(iter: Iterable<T>): T[] =>
  isArr(iter) ? iter : [...iter];

const objEx = (obj: any, ...keys: [any]) => {
  const res = {} as any;
  for (const key of keys) res[key] = obj[key];
  return res;
}; // @ts-ignore
const objExer = (...keys) => obj => objEx(obj, ...keys);

const objMap = (
  obj: Object,
  funKey: Function = past,
  funVal: Function = past,
  funRes: Function = past,
) => funRes((isArr(obj) ? past : Object.entries)(obj).reduce( // @ts-ignore
  (acc, [key, val]) => (void (acc[funKey(key)] = funVal(val)) || acc), {}));

const objPush = <T>(obj: any, key: keyof any, val: T) => {
  obj[key] = isArr(obj[key])
    ? obj[key].concat(val)
    : [val];
  return obj;
};

type Grouped<T> = Record<keyof any, T[]>;
const groupBy = <T>(
  iter: Iterable<T>,
  func: (x: T) => keyof any
): Grouped<T> => (iterToArr(iter)).reduce((acc, el) => objPush(acc, func(el), el), {});

// NOTE: `structuredClone` lacks browser (& older node) support
const jsonClone = (obj: {}) => JSON.parse(JSON.stringify(obj));


/* Math */

const { abs, min, pow, sqrt } = Math;
const sqrd = (x: number) => pow(x, 2);
const dist = (...ds: number[]) => sqrt(ds.reduce(
  (a, d) => a + sqrd(d), 0
));

const absMin = mapperReduce(min, abs);


/* Misc */

const upTo = (x: string | any[], sep: any, reverse=false) => x.slice( // @ts-ignore
  0, x[`${reverse ? 'lastI' : 'i'}ndexOf`](sep)
);

//@ts-ignore
const past = x => x;


export {
  dist,
  past,
  upTo,
  toArr,
  objEx,
  absMin,
  objMap,
  groupBy,
  objExer,
  getQuery,
  isClient,
  jsonClone,
  hrefToPath,
  addOnVisible,
  escapeRegExp,
  getRawRegExp,
  applyToNodes,
  elemIsHidden,
  getGroupedElems,
  getInboundAElemPath,
};

export type {
  Grouped,
};
