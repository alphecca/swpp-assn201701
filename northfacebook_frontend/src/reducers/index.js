const homepageInitialState = {
    authorization: "",
};

const homepage = (state = homepageInitialState, action) => {
    switch (action.type) {
        case 'authenticate':
            return Object.assign({}, state, {
                authorization: action.auth
            });
        default:
            return state
    }
}

const homepageApp = homepage // If there are at least two reducers, use 'combineReducers' instead of this code.

export default homepageApp
