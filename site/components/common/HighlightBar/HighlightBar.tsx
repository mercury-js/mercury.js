/**
 * Highlight bar component.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import cn from 'clsx';
import { FC, useState, useEffect, useRef, ReactElement } from 'react';
import throttle from 'lodash.throttle';
import style from './HighlightBar.module.css';

interface HighlightBarProps {
  body: HTMLElement | ReactElement;
}

const HighlightBar: FC<HighlightBarProps> = ({body}) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const id = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const offset = 600 + id.current!.offsetHeight;
      const { scrollTop } = document.documentElement;
      const scrolled = scrollTop > offset;

      if (hasScrolled !== scrolled) {
        setHasScrolled(scrolled);
      }
    }, 200);
    
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolled]);

  return (
    <div ref={id} className={ cn(style.highlightBar, { [style.hiddenHighlightBar]: hasScrolled }) }>
      {body}
    </div>
  );
};


export default HighlightBar;
