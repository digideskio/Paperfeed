import axios from 'axios';

/*Constants*/
import {SEARCH, GET_SOURCES, FILTER_CLICK, CLEAR_FILTER} from './types.jsx';
import {FILTER_PUSH_TO_STORAGE, FILTER_GET_FROM_STORAGE, CHANGE_PATH} from "./types";
import {fetchArticles} from './ArticleActions';


/*
 * Used to dispatch search event
 * */
export function search(term) {
    return {
        type: SEARCH,
        term
    }
}


/*Get all sources from server*/
export function getSources(category) {
    /*
     if(category == "/"){
     category = "Front"
     } else{
     category = category.charAt(1).toUpperCase() + category.substr(2);  // remove the / and capitalize first char, so mongodb understands it
     }
     */
    const URL = `api/urls/getall`;

    return function (dispatch) {
        axios.get(URL)
            .then(response => {
                dispatch({
                    type: GET_SOURCES,
                    payload: response.data
                });
            })
            .catch(error => {

            })
    }

}

export function addFilter(item) {
    return function (dispatch, getState) {
        let state = getState();
        let oldFilters = state.filters.selectedSources;
        let index = oldFilters.indexOf(item);
        //console.log(item + " is at index: " + index);
        index < 0 ? oldFilters.push(item) : oldFilters.splice(index, 1);
        //console.log('Current Filters: ' + oldFilters);
        dispatch(pushFiltersToStorage()); // - Also save to storage for permanent use
        
        return dispatch({
            type: FILTER_CLICK,
            payload: oldFilters
        });


    }
}

export function clearFilter() {
    return {type: CLEAR_FILTER}
}

// - Saves filters permanently
export function pushFiltersToStorage() {

    return function (dispatch, getState) {
        let filters = getState().filters.selectedSources;
        localStorage.setItem('filters', JSON.stringify(filters));
        return dispatch({
            type: FILTER_PUSH_TO_STORAGE,
            payload: null
        })
    }

}

// - Gets filters from storage and adds to state
export function fetchFiltersFromStorage() {
    return {
        type: FILTER_GET_FROM_STORAGE,
        payload: localStorage.getItem('filters') ? JSON.parse(localStorage.getItem('filters')) : ['']
    }
}

export function changeCurrentPath(path){
    switch (path){
        case '/':
            path = 'Front';
            break;
        case '/sport':
            path = 'Sport';
            break;

        case '/gaming':
            path = 'Gaming';
            break;

        case '/economy':
            path = 'Economy';
            break;

        case '/tech':
            path = 'Tech';

    }

    return {
        type:CHANGE_PATH,
        payload:path
    }
}

