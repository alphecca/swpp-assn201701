
const homepageInitialState = {
    authorization: "",
    articles: [],
    parent_article: null
};

const homepage = (state = homepageInitialState, action) => {
    switch (action.type) {
        case 'AUTHENTICATE': {
            return Object.assign({}, state, {
                authorization: window.atob(action.auth),
                articles: state.articles,
                parent_article: state.parent_article
            })
        }
        case 'SIGN_OUT': {
            return homepageInitialState //go back to initial state when sign out
        }
        case 'CHANGE_URL': {
            window.location = action.path
            return state
        }
        case 'SET_STATE': {
            return Object.assign({}, state, {
                authorization: action.state.authorization,
                articles: action.state.articles,
                parent_article: state.parent_article
            })
        }
        case 'ARTICLE_DETAIL': {
            alert(action.id)
            return Object.assign({}, state, {
                authorization: state.authorization,
                articles: state.articles,
                parent_article: action.id
            })
        }
        default: {
            return state
        }
   }
}

const homepageApp = homepage // If there are at least two reducers, use 'combineReducers' instead of this code.
export default homepageApp
