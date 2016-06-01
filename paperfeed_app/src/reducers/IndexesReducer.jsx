import {FETCH_INDEXES} from '../actions/types.jsx';

const initialState = {
  isPending: true,
  isRejected: false,
  error: null,
  data: {}
};
/*
 * Reducer for fetching sport results
 * */
const IndexesReducer = (state = initialState, action) => {

  switch (action.type) {
    case `${FETCH_INDEXES}_PENDING`:
      return {
        ...state,
        isPending: true
      };

    case `${FETCH_INDEXES}_FULFILLED`:
      return {
        ...state,
        isPending: false,
        error: false,
        data: action.payload.data
      };

    case `${FETCH_INDEXES}_REJECTED`:
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

export default IndexesReducer;