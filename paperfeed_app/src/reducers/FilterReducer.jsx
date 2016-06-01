import {SEARCH, GET_SOURCES, FILTER_CLICK, CLEAR_FILTER, FILTER_GET_FROM_STORAGE} from '../actions/types.jsx';

const initialState = {
  search: '',
  fetchedSources : [''],
  fetchError: false,
  selectedSources: ['']
};

const FilterReducer = (state = initialState, action) => {


  switch (action.type) {
    case SEARCH:
      return {
        ...state,
        search: action.term
      };
    case GET_SOURCES:
      return {
        ...state,
        fetchError: false,
        fetchedSources: action.payload
      }
    case `${GET_SOURCES}_REJECTED`:
      return {
        ...state,
        fetchError: true
      }
    case FILTER_CLICK:
      return {
        ...state,
        selectedSources: action.payload
      }
    case CLEAR_FILTER:
         return {
           ...state,
           selectedSources: []
         };
    case  FILTER_GET_FROM_STORAGE:
          return {
              ...state,
            selectedSources: action.payload
          }
    default:
      return state
  }

};

export default FilterReducer;
