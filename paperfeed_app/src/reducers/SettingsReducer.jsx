import {
    CHANGE_PATH
} from '../actions/types.jsx';

const initialState = {
    path : 'Front'
};

export default function (state = initialState, action) {

    switch (action.type) {
        case CHANGE_PATH:
         return {
             ...state,
             path: action.payload
         }
        default:
            return state;
    }

}