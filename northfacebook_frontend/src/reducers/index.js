
const homepageInitialState = {
    authorization: "",
    articles: []
};

const homepage = (state = homepageInitialState, action) => {
    switch (action.type) {
        case 'AUTHENTICATE': {
            return Object.assign({}, state, {
                authorization: window.atob(action.auth),
                articles: state.articles
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
//            alert(JSON.stringify(action.state))
//            alert(JSON.stringify(action.state.articles))
            return Object.assign({}, state, {
                authorization: action.state.authorization,
                articles: action.state.articles
            })
        }
        default: {
//            alert(JSON.stringify(state))
            return state
        }
   }
}

const homepageApp = homepage // If there are at least two reducers, use 'combineReducers' instead of this code.
export default homepageApp
