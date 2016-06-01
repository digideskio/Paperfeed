import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'

/*Actions*/
import {fetchCurrencies, fetchIndexes} from '../../actions/WidgetActions';

/*Components*/
import Spinner from 'react-spinkit';

class FinanceWidget extends Component {

  constructor(props) {
    super(props);
    this.state = {next: true, intervalId: ''};
  }

  componentWillMount(){
    this.props.fetchCurrency();
    this.props.fetchIndexes();
    let self = this;
    let intervalId = setInterval(function () {
      intervalId && self.setState({next: !self.state.next});
    }, 10000);
    this.setState({intervalId});
  }

  componentWillUnmount(){
    clearInterval(this.state.intervalId);
  }

  // - returns list of weather according to the state "next"
  _renderWidget() {
    const data = this.state.next ?  this.props.currency.data : this.props.indexes.data;

    return (
      <div className="row middle-xs">
        {
          data.map(currency => {
            return <div key={currency.Symbol} className="col-xs">
                     <div className="widget-element">
                       <span>
                         {currency.Symbol}
                       </span>
                       <span style={{color:'lightgreen', marginLeft:'10px', fontSize:'12px'}}>
                         {currency.Price}
                       </span>
                     </div>
                  </div>
          })
        }
      </div>
    )
  }


  render() {
    const isPending = this.props.currency.isPending || this.props.indexes.isPending;

    return (

      <div className='widget black'>
        {
          isPending ?
            <div className="row center-sm middle-sm">
              <div className="col-xs-1">
                <Spinner spinnerName='three-bounce'/>
              </div>
            </div>
            :
            this._renderWidget()
        }
      </div>
    );
  }

}


function mapStateToProps(state) {
  return {
    currency: state.currency,
    indexes: state.indexes
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCurrency: bindActionCreators(fetchCurrencies, dispatch),
    fetchIndexes: bindActionCreators(fetchIndexes, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FinanceWidget)
