/**
 * Descendant blocking.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import { useRef, useState, useEffect } from 'react';
import { elemIsHidden } from '@lib/custom/helpers';

/* NOTE:
 - workaround for prerendering components with
   nested elements that should not be rendered
   until the prerendered root's to be revealed
   (e.g. components/common/SEO)
*/
/**
 * Blocks rendering of children, unless a direct
 * ancestor passes a given test.
 */
export default function DescendantBlocker({
  children,
  test=elemIsHidden,
  onContext=(()=>{})
  // TODO:max depth?
}: {
  /** Passed through (blocked as per `test`). */
  children?: React.ReactElement;
  /**
   * Passed each direct ancestor, up to root.
   * Return `true` to **un**block `children`.
   */
  test?: (ancestor: HTMLElement) => boolean;
  /**
   * Context hook to bypass ancestor memoization.
   * Won't be used for anything but subscription.
  */
  onContext?: () => any;
}) {
  const ref = useRef(null);
  const [block, setBlock] = useState(true);

  onContext(); // for bypassing ancestor memoization
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { // NOTE: need for ref assignment
    let currentElem = ref.current as any;
    do if (test(currentElem)) return setBlock(true);
    while (currentElem = currentElem.parentElement);
    setBlock(false);
  }); // (see note above (must run on every render))

  return <span ref={ref}>{block ? null : children}</span>;
}
