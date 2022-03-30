/**
 * Hero card component.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import Link from 'next/link';
import { Button } from '@components/ui';
import React, { FC } from 'react';
import style from './HeroCard.module.css';

interface HeroCardProps {
  className?: string;
  header?: string;
  subheader?: string;
  buttonText?: string;
  buttonUrl?: string;
  textColor?: string;
  }

const HeroCard: FC<HeroCardProps> = ({
  header, 
  subheader, 
  buttonText, 
  buttonUrl='', 
  textColor
}) => {
  return (
    <div 
      className={style.root}
      style={{color: textColor}}
    >
      <h2 className={style.title}>{header}</h2>
      <p className={style.subheader}>{subheader}</p>
      <Button
        variant="flat"
      >
        <Link href={buttonUrl} passHref={true}>
          <a>{buttonText}</a>
        </Link>
                
      </Button>
    </div>
  );
};

export default HeroCard;
