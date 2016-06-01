import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import configStore from './store/ConfigStore.jsx';

/*Essential Components*/
import {Router, Route, hashHistory, IndexRoute, Link} from 'react-router'
import TechList from './containers/lists/TechList.jsx';
import SportList from './containers/lists/SportList.jsx';
import FrontList from './containers/lists/FrontList.jsx';
import EconomyList from './containers/lists/EconomyList.jsx';
import GamingList from './containers/lists/GamingList.jsx';


import theme from './styles/theme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


/*Setup*/
const store = configStore();
injectTapEventPlugin(); // Enables Touch Event's

/*Main*/
import App from './components/App.jsx';


class Main extends React.Component {

  render() {

    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <Router history={hashHistory}>
            <Route path="/" component={App}>
              <IndexRoute component={FrontList}/>
              <Route path="sport" component={SportList}/>
              <Route path="tech" component={TechList}/>
							<Route path="economy" component={EconomyList}/>
              <Route path="gaming" component={GamingList}/>
            </Route>
          </Router>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
