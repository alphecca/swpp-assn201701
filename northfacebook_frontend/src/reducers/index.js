
const homepageInitialState = {
    authorization: ""
};

const homepage = (state = homepageInitialState, action) => {
    switch (action.type) {
        case 'AUTHENTICATE': {
            return Object.assign({}, state, {
                authorization: window.atob(action.auth)
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
            return history.state.state
        }
        default:
            return state
   }
}

const homepageApp = homepage // If there are at least two reducers, use 'combineReducers' instead of this code.
export default homepageApp
