const homepageInitialState = {
    authorization: "",
};

const homepage = (state = homepageInitialState, action) => {
    switch (action.type) {
        case 'authenticate':
            return Object.assign({}, state, {
                authorization: action.auth
            })
        case 'SIGN_OUT':
            return homepageInitialState //go back to initial state when sign out
        default:
            return state
    }
}

const homepageApp = homepage // If there are at least two reducers, use 'combineReducers' instead of this code.

export default homepageApp
