/**
 * Product filters component.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import cn from 'clsx';
import { FC, useState, Dispatch, SetStateAction } from 'react';
import style from './ProductFilters.module.css';


type Filters = Record<string, any>;
interface FilterProps {
  className?: string;
  filters: Filters;
  setter: any;
};

const FilterAlternative = ({ label, filter, setter }: {
    label: string,
    filter: string,
    setter: Dispatch<SetStateAction<Filters>>
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => { 
    setIsSelected(!isSelected); 
    setter(prevState => {
      return {
        ...prevState,
        [filter]: {
          ...prevState[filter], [label]: !isSelected
        }
      };
    });
  };

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
  );
};

const ProductFilters: FC<FilterProps> = ({
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
        { Object.keys(filters).map((filter, i) => {
          const values = Object.keys(filters[filter]).map(key => <FilterAlternative key={key} label={key} filter={filter} setter={setter}/>);

          return (
            <div key={i} className={style.filterContainer}>
              <p className={style.filterHeader}>{filter}</p>
              {values}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProductFilters;
