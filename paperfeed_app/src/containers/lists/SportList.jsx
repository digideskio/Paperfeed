import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {loadMoreArticles, checkIfNewArticle} from '../../actions/ArticleActions.jsx';

/*Components*/
import Article from '../../components/Article';
import Spinner from 'react-spinkit';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

class SportList extends Component {

  constructor(props) {
    super(props);
    this.state = {category: 'Sport'}
  }

  componentDidMount() {
    this.props.fetchCurrency(this.state.category);
    let iId = setInterval(() => {
      iId && this.props.checkIfNewArticle(this.state.category);
    }, 10000)
    this.setState({intervalId:iId});
  }

  componentWillUnmount(){
    clearInterval(this.state.intervalId);
  }

  _loadMore() {
    this.props.fetchCurrency(this.state.category);
  }

  renderArticles() {
    const {data} = this.props.articles;
    const list = data.map(article => {
      if (article.Title.toUpperCase().indexOf(this.props.filters.search.toUpperCase()) == -1) return null;
      if (this.props.filters.selectedSources.indexOf(article.Source) > -1) return null;
      return <Article {...article} key={article.Title} email={this.props.email}/>
    });
    return list;
  }

  render() {
    const {isPending} = this.props.articles;

    return (
      isPending ? <Spinner spinnerName='three-bounce'/>
        :
        <div >

          {
            this.renderArticles()
          }
          {!this.props.noMoreData ?
            <FlatButton label='Load More' onClick={this._loadMore.bind(this)}
                        icon={<FontIcon className="material-icons" >keyboard_arrow_down</FontIcon>}/>
            :
            <div className="outofarticles"><h3>We ran out of articles, sorry!</h3></div>
          }
        </div>
    );
  }

}


function mapStateToProps(state) {
  return {
    articles: state.articles,
    noMoreData: state.articles.noMoreData,
    email: state.auth.email,
    filters: state.filters
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCurrency: bindActionCreators(loadMoreArticles, dispatch),
    checkIfNewArticle : bindActionCreators(checkIfNewArticle, dispatch)

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SportList)
