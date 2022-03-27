import React, { FC } from 'react'
import { Container } from '@components/ui'
import { ArrowRight } from '@components/icons'
import { HeroCard } from '@components/ui'
import s from './HeroAlt.module.css'
import Link from 'next/link'

interface HeroProps {
  className?: string
  headline: string
  subheader: string
  textColor?: string
  buttonText?: string
  buttonUrl?: string
  backgroundImageUrl: string
}

const HeroAlt: FC<HeroProps> = ({ 
    headline, 
    subheader,
    textColor="#FFF",
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
  )
}

export default HeroAlt
