import cn from 'clsx'
import { FC, ReactNode, Component, useState, useEffect } from 'react'
import style from './ProductFilters.module.css'
import { Container, CollectionCard } from '@components/ui'


interface FilterProps {
    className?: string
    filters: object
    setter: any
}

const FilterAlternative = ({label, filter, setter}) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = () => { 
        setIsSelected(!isSelected) 
        setter(prevState => {
            return {
                ...prevState,
                [filter]: {
                    ...prevState[filter], [label]: !isSelected
                }
            }
        })
    }

    return (
        <div className={style.alternativeContainer}>
            <label className={style.alternativeLabel}>
                <input 
                    className={style.alternativeInput}
                    type="checkbox" 
                    checked={isSelected}
                    onClick={handleClick}
                />
                { label }
            </label>
        </div>
    )
}

const ProductFilters: FC<FilterProps> = ({
    className,
    filters,
    setter,
}) => {

    const [filtersShown, setFiltersShown] = useState(false);

    return (
        <>
            <div className={style.filterToggle} onClick={() => setFiltersShown(!filtersShown)}>
                Filters
            </div>
            <div className={cn(style.filtersContainer, filtersShown ? style.show : style.hide)}>
                { filters != {} && Object.keys(filters).map(filter => {
                    const values = Object.keys(filters[filter]).map(key => <FilterAlternative label={key} filter={filter} setter={setter}/>)

                    return (
                        <div className={style.filterContainer}>
                            <p className={style.filterHeader}>{filter}</p>
                            {values}
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default ProductFilters
