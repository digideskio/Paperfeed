import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  GET_AVATAR
} from '../actions/types.jsx';

const initialState = {
  authenticated: false,
  avatar: '/api/userapi/getavatar?email=default',
  message: '',
  email: '',
  error: false
};

export default function (state = initialState, action) {

  switch (action.type) {
    case AUTH_USER:
      return {email: action.payload.email,
        authenticated: true,
        message: action.payload.message,
        error: false,
        avatar: `/api/userapi/getavatar?email=${action.payload.email}`
      };
    case UNAUTH_USER:
      return {authenticated: false, error: false, message: 'Signed out.', email: '', avatar: '/api/userapi/getavatar?email='};
    case AUTH_ERROR:
      return {...state, error: true, message: action.payload, email: ''};
    case `${GET_AVATAR}_SUCCESS`:
      return {...state, avatar: action.payload, error:false};
    case `${GET_AVATAR}_ERROR`:
      return {...state, error:action.payload};
    default:
      return state;
  }

}
