import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {getAllLikes, toggleLike} from '../actions/ArticleActions';

/*Components*/
import FontIcon from 'material-ui/FontIcon';


class LikeButton extends Component {

  static childContextTypes = {
    aid: React.PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
  }
  
  // - Handles article like by sending aid
  _handleLike(e) {
    e.preventDefault();
    this.props.toggleLike(this.props.aid);
  }

  _checkIfLiked(){
    const allLikes = this.props.allLikes;
    const aid = this.props.aid;

    for (let i of allLikes){
      if(i[0]._value == aid){
        return true;
      }
    }
    return false;
  }

  render() {
    let color = this._checkIfLiked() ? '#64FFDA' : 'white';

    const likeIconStyle = {
      fontSize: '16px',
      marginTop: '5px',
      marginLeft: '5px',
      color: color
    };

    return (
      <a onClick={this._handleLike.bind(this)} href="#" className="col-xs-6 article-element">
        <span className="row center-xs middle-xs">
          <span className="col-xs-2 col-lg-1">
            <FontIcon style={likeIconStyle} className="material-icons">thumb_up</FontIcon>
          </span>
          <span className="col-xs-2">
            <span style={{fontSize:'12px', color:'white'}}>({this.props.count})</span>
          </span>
        </span>
      </a>
    );
  }

}

function mapStateToProps(state) {
  return {
    authenticated : state.auth.authenticated,
    allLikes: state.articles.allLikes
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getLikes : bindActionCreators(getAllLikes, dispatch),
    toggleLike: bindActionCreators(toggleLike, dispatch)
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LikeButton)