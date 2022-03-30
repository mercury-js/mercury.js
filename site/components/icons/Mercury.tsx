/**
 * Mercury.js logo.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import Image from 'next/image';

const Mercury = ({ ...props }) => {
  return (
    <Image
      src="/assets/MercuryJS_logo.png"
      alt="Mercury.js logo"
      width={props.width}
      height={props.height}
    />
  );
};

export default Mercury;
