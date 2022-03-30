/**
 * Product filtering hook.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import { useState, useEffect } from 'react';
import type { Product } from '@commerce/types/product';

type SR = Record<string, any>;

// Built for Shopify, need to investigate compatibility with other vendors and if filtering is better done by querying the DB

// Takes in an array of Products and returns an object with available filters for the Products
const getProductFilters = (products: Product[]) => {
  const options = {} as SR;

  products && products.forEach(product => {

    // Check that any Products exist
    if (product.options.length) {

      product.options.forEach(option => {

        // Check that the option has not already been recorded
        if (!options.hasOwnProperty(option.displayName)) {
          options[option.displayName] = [];
        }

        option.values.forEach(value => {

          // Check that the value has not already been recorded
          if (!options[option.displayName].includes(value.label)) {
            options[option.displayName].push(value.label);
          }
        });
      });

    }
  });

  const filters = {} as SR;

  // Get filters from the available options. Initialize all filters with "False"
  Object.keys(options).forEach(key => {
    filters[key] = {};
    options[key].forEach((value: any) => {
      filters[key][value] = false;
    });
  });


  return filters;
};


// Takes in an array of Products and an object with filters set to True/False and returns the matching products
const filterMatchingProducts = (products: Product[], filterObject: SR) => {
  const optionsToMatch = {} as SR;
  let anyFilterSet = false;

  Object.keys(filterObject).forEach(filter => {
    optionsToMatch[filter] = [];

    Object.keys(filterObject[filter]).forEach(option => {
      if (filterObject[filter][option] === true) {
        optionsToMatch[filter].push(option);
        anyFilterSet = true;
      }
    });

  });

  // Check to see if any options are set. If not, return all products
  if (!anyFilterSet) return products;

  // Delete empty filters from being matched
  Object.keys(optionsToMatch).forEach(key => {
    if (optionsToMatch[key].length === 0) { delete optionsToMatch[key]; }
  });

  const setFilters = Object.keys(optionsToMatch);

  const filteredProducts = products.filter(product => {
    const productOptions = {} as SR;

    product.options.forEach(filter => {
      productOptions[filter.displayName] = [];

      filter.values.forEach(option => productOptions[filter.displayName].push(option.label));
    });

    let availableFiltersForProduct = Object.keys(productOptions);


    // Product has no options set, return False
    if (availableFiltersForProduct.length === 0) {
      return false;

      // Product has options set, investigate further
    } else {
      // Check which options of the product match with the filters that have been set
      const intersection = setFilters.filter(element => availableFiltersForProduct.includes(element));

      // If the product does not have the same amount of avalable filter than are set, it cannot be a match, return False
      if (intersection.length != setFilters.length) return false;

      return intersection.every(sharedOption => {
        if (optionsToMatch[sharedOption].filter((elem: any) => productOptions[sharedOption].includes(elem)).length > 0) {
          return true;
        } else {
          return false;
        }
      });
    }

  });

  return filteredProducts;
};


export const useFilter = (allProducts: Product[]) => {

  const [productData, setProductData] = useState(allProducts);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    setProductData(allProducts);
  }, [allProducts]);

  useEffect(() => {
    setCurrentFilters(getProductFilters(productData));
  }, [productData]);
    
    
  useEffect(() => {
    setFilteredProducts(filterMatchingProducts(productData, currentFilters));
  }, [currentFilters]);


  return { filteredProducts, currentFilters, setCurrentFilters };

};
