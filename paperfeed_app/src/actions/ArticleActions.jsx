import axios from 'axios';
import {notifActions} from 'redux-notif';
const {notifSend} = notifActions;

/*Constants*/
import {FETCH_ARTICLES, LOAD_MORE, NO_MORE_ARTICLES, NEW_ARTICLES, GET_LIKES} from  './types.jsx';

/*
 * Fetch articles from the API
 * @Start : Skip documents
 * @End : Limit documents
 * */
export function fetchArticles(category, id, filters) {
    const URL = `/api/articles/loadmore?${filters}&category=${category}&id=${id}`;

    return {
        type: FETCH_ARTICLES,
        payload: {
            promise: axios.get(URL, {
                headers: {
                    timeout: 2000
                }
            })
        }
    }
}
/*
 * Enables us to load more from API by sending using the old list
 * @Old: old articles
 */
export function loadMoreArticles(category) {
    return function (dispatch, getState) {
        // - Gettings filters so we can except those when requestion from server
        let filters = getState().filters.selectedSources; // - Articles by source that we don't want
        let query = filters.map(filter => `&filters=${filter}`).join('');
        // - If articles doesn't exists (initial request)
        // - Get initial articles from server
        var old = getState().articles.data;
        if (old.length == 0) {
            return dispatch(fetchArticles(category, '', query)); // using fetchArticles to get initial
        }
        // - If the articles which we have stored are from another category, we need to remove them
        if (old[0].Category != category){
            return dispatch(fetchArticles(category, '', query)); // using fetchArticles to get initial
        }

        // - If we get so far, it means we have want more articles
        // - We'll find last articles in our list so we can ask for more by sending id and currently selected filters
        let lastKey = old[old.length - 1].Id;
        const URL = `/api/articles/loadmore?${query}&category=${category}&id=${lastKey}`;
        axios.get(URL)
            .then(response => {
                // - if the request for more articles is good
                // - then we dispatch a new action with the new data + the old ones, but only if server sends new data
                if (response.data.length > 0) {
                    dispatch({
                        type: LOAD_MORE,
                        payload: old.concat(response.data)
                    });
                }
                else {
                    dispatch({
                        type: NO_MORE_ARTICLES
                    });
                }
            })
            .catch(error => {

            })
    }
}

/*
* @param id : id of the first article
* Server will respond with article that are newer than this id
* */
export function checkIfNewArticle(category) {
  // - We can access current application state with second param, thanks redux-thunk
  return (dispatch, getState) => {
    var articles = getState().articles.data;
      let filters = getState().filters.selectedSources; // - Articles by source that we don't want
      let query = filters.map(filter => `&filters=${filter}`).join('');

      if(articles[0].Category != category) return;
    if(articles.length == 0) return;
    // - Get first key if there are articles
    let firstKey = articles[0].Id;
    const URL = `/api/articles/getnewerarticles?${query}&category=${category}&id=${firstKey}`;
    axios.get(URL)
      .then(response => {
        // - New data?
        if (response.data.length > 0){
          dispatch({
            type: NEW_ARTICLES,
            payload: response.data
          });
        }
      })
  }
}
export function merge() {
  return (dispatch, getState) => {
    var articles = getState().articles.data;  // - old articles
    var new_articles = getState().articles.newData;
    console.log(new_articles);
    dispatch({type: `${NEW_ARTICLES}_MERGE`,
      payload: new_articles.concat(articles)});
  }
}
/*
* Likes article
* @aid : article id
* */
export function toggleLike(aid) {
    const token = getToken();
    /*Axios Setup*/
    const config = {
        headers:  {authorization: token}
    };

    if(!token) return notifSend({message: 'Please sign in.', kind: 'warning', dismissAfter: 500});

    return function (dispatch) {
        const URL = `api/like/add?id=${aid}`;
        axios.post(URL,{}, config)
            .then (response => {
              let code = response.data.Code;
  
                if(code == "0"){
                  dispatch(notifSend({message: response.data.Message, kind: 'info', dismissAfter: 500}));  // - Success
                  dispatch(getAllLikes()); // - Refresh likes @ state
                }else{
                  dispatch(notifSend({message: response.data.Message, kind: 'error', dismissAfter: 1000})); // - Error
                }
            })
            .catch(error =>{
                dispatch(notifSend({message: `Unable to like this post`, kind: 'error', dismissAfter: 500})); // - Request Error
            });
    }
}

export function getAllLikes(){

  const token = getToken();
  /*Axios Setup*/
  const config = {
    headers:  {authorization: token}
  };

  if(!token) return notifSend({message: 'Please sign in.', kind: 'warning', dismissAfter: 500});

  return function (dispatch) {
    const URL = `api/like/userlikes`;
    axios.get(URL, config)
      .then(response => {
        dispatch({
          type: GET_LIKES,
          payload: response.data
        })
      })
  }
}

function getToken(){
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}