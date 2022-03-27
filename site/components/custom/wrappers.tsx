/**
 * React specific custom helpers (that use JSX).
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import {
  lazy,
  Suspense,
  SuspenseProps
} from 'react';


/**
 * Lazifies a dynamically imported component and wraps it in a
 * `Suspense`. For unlocking granular HTML streaming & selective
 * hydration with React 18 while keeping it somewhat DRY (see notes
 * below).
 * 
 * @example
 * const MyComponentWithSuspension = suspend(
 *   () => import(`./components/MyComponent`)
 * );
 * 
 * @note on webpack and dynamic imports
 * - can't simply pass path to component as argument (vs. `imported`)
 *   because webpack will determine the potential modules by scanning
 *   the source code for `import` statements at build-time and is not
 *   able to tell where a variable (vs. string literal) will point to
 * - passing through the callback (containing a call to `import`) to
 *   `lazy` instead offers some DRY encapsulation while ensuring
 *   efficient bundling (you can still use a template literal in a loop
 *   with part of the module path interpolated but it will leave
 *   webpack guessing what module will be requested and can lead to
 *   unnecessary code being bundled in a chunk (any hard-coding here
 *   here would prevent encapsulation))
 */
function suspend(
  imported: Parameters<typeof lazy>[0],
  fallback: SuspenseProps['fallback']=null
) {
  const Component = lazy(imported);
  const SuspendedComponent = (props: any) =>
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>;
  return SuspendedComponent;
}


export {
  suspend
};
