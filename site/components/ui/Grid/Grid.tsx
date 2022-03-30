import { FC, ReactNode, Component } from 'react'
import style from './Grid.module.css'
import { CollectionCard } from '@components/ui'

interface GridProps {
  className?: string
  header?: string
  items: ReactNode[] | Component[] | any[]
  type: 'product' | 'productCategory' | 'display' | 'custom'
  totalItems?: number
  itemsPerGridLine?: object
  imageHeightPx?: string
}

const defaultNumberOfItems = {
  'xxl': 6,
  'xl': 5,
  'lg': 4,
  'md': 3,
  'sm': 2,
  'xs': 1
}

const Grid: FC<GridProps> = ({
  header,
  type,
  items,
  totalItems=items.length,
  itemsPerGridLine=defaultNumberOfItems,
  imageHeightPx='250px'
}) => {

  let classes = `grid py-20 px-4 gap-6`

  for (const [size, value] of Object.entries(itemsPerGridLine)) {
    classes = classes.concat(` ${size}:grid-cols-${value}`)
  }

  return (
    <>
      { header && <h1 className={style.gridHeader}>{header}</h1> }
      <div className={classes}>
        { items?.slice(0, totalItems).map((item, i) => <CollectionCard key={i} type={type} item={item} imageHeight={imageHeightPx}/>) }     
      </div>
    </>
  )
}

export default Grid
