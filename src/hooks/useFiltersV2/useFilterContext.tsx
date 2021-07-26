import {createContext} from 'react';

const FilterContext = createContext(null);


const useFilterContext = ()=> {

  return FilterContext;
}

export default useFilterContext;
