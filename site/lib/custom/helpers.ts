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
// TODO: jsocd?

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
) => funRes((Array.isArray(obj) ? past : Object.entries)(obj).reduce( // @ts-ignore
  (acc, [key, val]) => (void (acc[funKey(key)] = funVal(val)) || acc) // eslint-disable-next-line
, {}));

// NOTE: `structuredClone` lacks browser (& older node) support
const jsonClone = (obj: {}) => JSON.parse(JSON.stringify(obj));


/* Misc */

//@ts-ignore
const past = x => x;


export {
  past,
  objEx,
  objMap,
  objExer,
  getQuery,
  isClient,
  jsonClone,
  addOnVisible,
  escapeRegExp,
  getRawRegExp,
  applyToNodes,
  elemIsHidden,
  getInboundAElemPath,
};
