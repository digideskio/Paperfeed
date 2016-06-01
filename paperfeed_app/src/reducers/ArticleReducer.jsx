import {FETCH_ARTICLES, LOAD_MORE, NO_MORE_ARTICLES, NEW_ARTICLES, GET_LIKES, CLEAR_LIKES} from '../actions/types.jsx';

const initialState = {
  isPending: true,
  isRejected: false,
  error: null,
  loadedMore: false,
  noMoreData: false,
  newData: [],
  data: [],
  allLikes: []
};
/*
 * Reducer for fetching weather
 * */
const ArticleReducer = (state = initialState, action) => {

  switch (action.type) {
    case `${FETCH_ARTICLES}_PENDING`:
      return {
        ...state,
        isPending: true
      };

    case `${FETCH_ARTICLES}_FULFILLED`:
      return {
        ...state,
        isPending: false,
        error: false,
        noMoreData: false,
        data: action.payload.data
      };

    case `${FETCH_ARTICLES}_REJECTED`:
      return {
        ...state,
        isRejected: true,
        isPending: false,
        error: action.payload
      };
    case LOAD_MORE:
      return {
        ...state,
        isRejected: false,
        isPending: false,
        loadedMore: true,
        data: action.payload
      };
    case NO_MORE_ARTICLES:
      return {
        ...state,
        noMoreData: true
      };
    case NEW_ARTICLES:
      return{
        ...state,                                         // - When new data is available
        newData: action.payload
      };
    case `${NEW_ARTICLES}_MERGE`:                        // - Reset new data as we are merging into main container
      return{
        ...state,
        newData: [],
        data: action.payload
      };
    case GET_LIKES:
      return {
        ...state,
        allLikes : action.payload
      }
    case CLEAR_LIKES:
      return {
        ...state,
        allLikes: []
      }
    default:
      return state;

  }
};

export default ArticleReducer;
