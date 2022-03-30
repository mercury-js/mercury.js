/**
 * Alternative hero card component.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import React, { FC } from 'react';
import { Container } from '@components/ui';
import { HeroCard } from '@components/ui';
import s from './HeroAlt.module.css';

interface HeroProps {
  className?: string;
  headline: string;
  subheader: string;
  textColor?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundImageUrl: string;
}

const HeroAlt: FC<HeroProps> = ({ 
  headline, 
  subheader,
  textColor='#FFF',
  buttonText,
  buttonUrl,
  backgroundImageUrl,
}) => {
  return (
    <div 
      className="border-b border-t border-accent-2"
      style={{backgroundImage: `url("${backgroundImageUrl}")`, backgroundSize: 'cover'}} 
    >
      <Container>
        <div className={s.root}>
          <HeroCard
            header={headline}
            subheader={subheader}
            textColor={textColor}
            buttonText={buttonText}
            buttonUrl={buttonUrl}
          >  
          </HeroCard>
        </div>
      </Container>
    </div>
  );
};

export default HeroAlt;
