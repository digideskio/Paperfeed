import {FETCH_WEATHER, SET_LOCATION} from '../actions/types.jsx';

const initialState = {
	isPending: true,
	isRejected: false,
	error: null,
	location: 'Oslo, Norge',
	data: {}
};
/*
 * Reducer for fetching weather
 * */
const WeatherReducer = (state = initialState, action) => {

	switch (action.type) {
		case `${FETCH_WEATHER}_PENDING`:
			return {
				...state,
				isPending: true
			};

		case `${FETCH_WEATHER}_FULFILLED`:
			return {
				...state,
				isPending: false,
				error: false,
				data: action.payload.data
			};

		case `${FETCH_WEATHER}_REJECTED`:
			return {
				...state,
				isRejected: true,
				isPending: false,
				error: action.payload
			};
		case SET_LOCATION:
				return {
						...state,
					location: action.payload
				};
		default:
			return state;

	}
};

export default WeatherReducer;
