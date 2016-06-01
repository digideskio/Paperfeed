import React, {Component} from 'react';
import StockWidget from './FinanceWidget';
import WeatherWidget from './WeatherWidget';
import SportWidget from './SportWidget';
import GamingWidget from './GamingWidget';

import {hashHistory} from 'react-router';


class MasterWidget extends Component {
  constructor() {
    super();
    this.state = {activeTab: "/"};
  }

  componentDidMount() {
    hashHistory.listen(ev => {
      this.setState({activeTab: ev.pathname});
    });
  }

  getCurrentWidget() {
    switch (this.state.activeTab) {
      case "/economy":
        return <StockWidget />;
      case "/gaming":
        return <GamingWidget/>;
      case "/sport":
        return <SportWidget />;
      default:
        return <WeatherWidget />
    }
  }

  render() {
    return this.getCurrentWidget()
  }
}

export default MasterWidget;
