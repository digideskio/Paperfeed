import React, {Component} from 'react';
/*Components*/
import LazyLoad from 'react-lazy-load';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Comments from '../containers/Comments.jsx';
import FontIcon from 'material-ui/FontIcon';
import Timestamp from 'react-timestamp';
import LikeButton from '../containers/LikeButton';


class Article extends Component {

  static propTypes = {
    email: React.PropTypes.string.isRequired
  };


  constructor() {
    super();
    this.state = {displayComments: false, width: window.innerWidth, likes: [], liked: false};
    this._toggleCommentsModal = this._toggleCommentsModal.bind(this);
  }


  updateDimensions() {
    this.setState({width: window.innerWidth});
  }

  componentWillMount() {
    this.updateDimensions();
  }

  // - Adds listener on resize
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  // - Removes resize listener
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  _toggleCommentsModal(e) {
    if (e)
      e.preventDefault();
    this.setState({displayComments: !this.state.displayComments})
  }

  // - Checks if the there is a image with valid url
  shouldRenderImage(image) {
    let innerWidth = this.state.width;
    let imageHeight = innerWidth > 1800 ? 500 : innerWidth > 768 ? 400 : 300;

    image = image.indexOf('http') > -1 ? image : 'http://www.mediabistro.com/prnewser/files/2014/03/ron-burgandy-breaking-news.png';

    return <LazyLoad height={imageHeight}>

      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeaveTimeout={500}
        transitionLeave={false}>

        <img src={image} height='auto' width="auto" className="article-image"/>
        <div className="cover_lg">{this.props.Source}</div>
        <div className="cover_sm"><Timestamp time={this.props.Timestamp}/></div>
      </ReactCSSTransitionGroup>

    </LazyLoad>

  };

  render() {
    const commentIconStyle = {
      fontSize: '16px',
      marginTop: '5px',
      marginLeft: '5px',
      color: 'white'
    };

    return (

      <div className="article">
        <a href={this.props.Link} target="_blank">{this.shouldRenderImage(this.props.Image)}</a>


        <div className="row article-bar top-xs">
          
            
              <LikeButton aid={this.props.Id} count={this.props.Likes}/>
      

          <div onClick={this._toggleCommentsModal} className="col-xs-6 article-element">
              <div className="row middle-xs center-xs">
                <div className="col-xs-2 col-lg-1">
                  <FontIcon style={commentIconStyle} className="material-icons">comments</FontIcon>
                </div>
                <div className="col-xs-2">
                  <span style={{color:'white', fontSize:'12px'}}>Comments</span>
                </div>
              </div>
          </div>

        </div>


        <div className="article-title">
          <h1 className="hint--bottom-left hint--medium"  aria-label={this.props.Description}>
            <a href={this.props.Link} target="_blank">
              {this.props.Title}
            </a>
          </h1>
        </div>

        {this.state.displayComments &&
        <Comments title={this.props.Title} aid={this.props.Id} cb={this._toggleCommentsModal}/>}
        <span className="divider"/>

      </div>

    );
  }
};


export default Article;

