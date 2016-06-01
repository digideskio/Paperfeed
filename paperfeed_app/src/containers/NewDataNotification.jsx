import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {merge} from '../actions/ArticleActions';

/*Components*/


class NewDataNotification extends Component {

  constructor(props) {
    super(props);
  }
  _handleClick(){
    console.log('mergin');
    this.props.merge();
  }

  render() {
    return (
      this.props.counter > 0 && <div className="new-data" onClick={this._handleClick.bind(this)}>
        <h5>New articles are available ({this.props.counter})</h5>
      </div>
    );
  }

}
function mapStateToProps(state) {
  return {
    counter: state.articles.newData.length
  }
}

function mapDispatchToProps(dispatch) {
  return {
    merge: bindActionCreators(merge, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewDataNotification)