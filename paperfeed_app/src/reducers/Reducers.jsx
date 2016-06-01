import {combineReducers} from 'redux';
import {reducer as form} from 'redux-form';
import {notifReducer} from 'redux-notif';
import WeatherReducer from './WeatherReducer.jsx';
import ArticleReducer from './ArticleReducer.jsx';
import FilterReducer from './FilterReducer.jsx';
import UserReducer from './UserReducer.jsx';
import CurrencyReducer from './CurrencyReducer';
import IndexReducer from './IndexesReducer';
import SettingsReducer from './SettingsReducer';

/*Application state*/
const rootReducer = combineReducers({
    weather: WeatherReducer,
    indexes: IndexReducer,
    currency: CurrencyReducer,
    articles: ArticleReducer,
    filters: FilterReducer,
    form: form,
    notifs: notifReducer,
    auth: UserReducer,
    settings: SettingsReducer

});

export default rootReducer;
