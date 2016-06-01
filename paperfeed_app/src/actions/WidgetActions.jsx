import axios from 'axios';

/*Constants*/
import {FETCH_WEATHER, FETCH_CURRENCIES,FETCH_INDEXES, SET_LOCATION} from './types.jsx';

/*Action Creators*/

/*
 * Dispatch fetchCurrency request
 * */
export function fetchWeather(location) {
	const KEY = '146f0688c6ae17c1efcc72a9eac47a0b';
	const URL = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&mode=json&units=metric&cnt=6&appid=${KEY}`;

	return {
		type: FETCH_WEATHER,
		payload: {
			promise: axios.get(URL)
		}
	}
}


export function fetchCurrencies(limit){
	const URL = `/api/finance/getnewestcurrencies?limit=${limit}`;
	return {
		type: FETCH_CURRENCIES,
		payload: {
			promise: axios.get(URL)
		}
	}
}
export function fetchIndexes(limit){
	const URL = `/api/finance/getnewestindexes?limit=${limit}`;
	return {
		type: FETCH_INDEXES,
		payload: {
			promise: axios.get(URL)
		}
	}
}

export function setLocation(location){
	localStorage.setItem('location', location);
	console.log('FROM DISPATCH', location);
	return function(dispatch){
		dispatch(fetchWeather(location));
		dispatch({
			type: SET_LOCATION,
			payload: location
		})
	}
}
