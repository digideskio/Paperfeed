import axios from 'axios';
import {notifActions} from 'redux-notif';
const {notifSend} = notifActions;
import {getAllLikes} from './ArticleActions';
/*Constants*/
import {AUTH_USER, AUTH_ERROR, UNAUTH_USER, GET_AVATAR, CLEAR_LIKES, GET_LIKES} from './types.jsx';


/*
 * Signs in user, if success, store key and email at session og local storage
 * */
export function signinUser(email, password, rememberMe) {

	return function (dispatch) {
		// Submit email/password to the server
		axios.post(`/jwtauth/login`, {email, password})
			.then(response => {
				// - If request is good...
				// Update state to indicate user is authenticated
				saveUser(response.data, email, rememberMe);
				dispatch({
					type: AUTH_USER,
					payload: {email: getEmail(), message: response.data.Message}
				});
				dispatch(notifSend({message: `Welcome, ${email}`, kind: 'success', dismissAfter: 1000}));
				dispatch(getAllLikes());

			})
			.catch(response => {
				// - If request is wrong...
				dispatch(notifSend({
					message: response.data.Message,
					kind: 'error',
					dismissAfter: 3000
				}));
				dispatch({
					type: AUTH_ERROR,
					payload: response.data.Message
				});

			});
	}
}
/*
 * Registers the user
 * Stores key & email at sessionStorage
 * */
export function signupUser(email, password, confirmpassword) {
	return function (dispatch) {
		axios.post(`/jwtauth/register`, {email, password, confirmpassword})
			.then(response => {
				saveUser(response.data, email, false);
				// - Dispatch event so application knows that the user is logged in

				dispatch({type: AUTH_USER, payload: {email: getEmail(), message: 'Successfully signed up'}});
				dispatch(notifSend({message: `Successfully registered new account!`, kind: 'success', dismissAfter: 1000}));

			})
			.catch(response => {
				dispatch({type: AUTH_ERROR, payload: response.data});
				dispatch(notifSend({message: response.data, kind: 'error', dismissAfter: 1000}));
			});
	}
}
// - Download user agatar
export function uploadAvatar(file) {
	return function (dispatch) {
		// - Fake form-data
		var data = new FormData();
		data.append('file', file);
		const URL = '/api/userapi/uploadavatar';
		// - Jwt config
		const config = {
			headers: {authorization: localStorage.getItem('token') || sessionStorage.getItem('token')},
			encType: "multipart/form-data"
		};
		// - Upload file with correct headers
		axios.post(URL, data, config)
			.then(response => {
				// - Dispatch action that tells that image upload was success
				dispatch({type: `${GET_AVATAR}_SUCCESS`, payload: `/api/userapi/getavatar?email=${getEmail()}?${Date.now()}`});
				// - if file is provided means the user is trying to upload an avatar
				return file && dispatch(notifSend({
						message: 'Successfully uploaded avatar!',
						kind: 'success',
						dismissAfter: 1000
					}));
			})
			.catch(error => {
				// - Dispatch action that tells that error occurred
				dispatch({type: `${GET_AVATAR}_ERROR`, payload: error});
				return dispatch(notifSend({message: error, kind: 'error', dismissAfter: 1000}));
			});
	}
}

// - Signs out the user, clears localstorage and session
export function signoutUser() {
	return function (dispatch) {
		removeUser();
		dispatch({type: UNAUTH_USER});
		dispatch({type: CLEAR_LIKES});
		return dispatch(notifSend({message: 'Signed out', kind: 'success', dismissAfter: 2000}));
	}
}

// Save user to store
const saveUser = (token, email, rememberMe) => {
	if (rememberMe) {
		localStorage.setItem('token', token);
		localStorage.setItem('email', email);
	} else {
		sessionStorage.setItem('token', token);
		sessionStorage.setItem('email', email);
	}
};
// - Remove user from stores
const removeUser = () => {
	localStorage.removeItem('token');
	sessionStorage.removeItem('token');
	localStorage.removeItem('email');
	sessionStorage.removeItem('email');
};

const getEmail = () => {
	return localStorage.getItem('email') || sessionStorage.getItem('email');
};
