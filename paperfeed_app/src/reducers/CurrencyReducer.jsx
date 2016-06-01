import {FETCH_CURRENCIES} from '../actions/types.jsx';

const initialState = {
  isPending: true,
  isRejected: false,
  error: null,
  data: {}
};

/*
 * Reducer for fetching stocks
 * */
const CurrencyReducer = (state = initialState, action) => {

  switch (action.type) {
    case `${FETCH_CURRENCIES}_PENDING`:
      return {
        ...state,
        isPending: true
      };

    case `${FETCH_CURRENCIES}_FULFILLED`:
      return {
        ...state,
        isPending: false,
        error: false,
        data: action.payload.data
      };

    case `${FETCH_CURRENCIES}_REJECTED`:
      return {
        ...state,
        isRejected: true,
        isPending: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default CurrencyReducer;