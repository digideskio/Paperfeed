import {createStore, applyMiddleware, compose} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import reduxThunk from 'redux-thunk';
import {AUTH_USER} from '../actions/types.jsx';
import {fetchFiltersFromStorage} from '../actions/DefaultActions';
import {setLocation} from '../actions/WidgetActions';
import rootReducer from '../reducers/Reducers.jsx';
import {notifActions} from 'redux-notif';
import {getAllLikes} from "../actions/ArticleActions";
const {notifSend} = notifActions;

export default function configureStore(initialState) {
		const store = createStore(
				rootReducer,
				initialState,
				compose(
						applyMiddleware(reduxThunk, promiseMiddleware()),
						window.devToolsExtension ? window.devToolsExtension() : f => f
				)
		);


		// CHECK IF USER IS LOGGED IN
		const token = localStorage.getItem('token') || sessionStorage.getItem('token');
		const email = localStorage.getItem('email') || sessionStorage.getItem('email');
		// - AUTH IF LOGGED IN
		if (token) {
				store.dispatch({type: AUTH_USER, payload: {email, message: ''}});
				store.dispatch(getAllLikes());
				store.dispatch(notifSend({message: `Welcome, ${email}`, kind: 'success', dismissAfter: 1000}));
		}
		// - Get filters and location from storage
		store.dispatch(fetchFiltersFromStorage());
		let location = localStorage.getItem('location');
		if(location)
			store.dispatch(setLocation(location));

		if (module.hot) {
				module.hot.accept('../reducers/Reducers.jsx', () => {
						const nextRootReducer = require('../reducers/Reducers.jsx').default;
						store.replaceReducer(nextRootReducer)
				})
		}

		return store
}
