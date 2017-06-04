
const homepageInitialState = {
    authorization: "",
    articles: [],
    parent_article: null,
    rooms: [],
    texts: [],
    chatting_users: [],
    profile_user: null,
    room_id: 0,
    load : 0
};

const homepage = (state = homepageInitialState, action) => {
    switch (action.type) {
         case 'MORE_ARTICLE': {
            return Object.assign({}, state, {
              load:state.load+5
            })
        }
        case 'MORE_CHAT': {
            return Object.assign({}, state, {
              load:state.load+10
            })
        }
         case 'LESS_CHAT': {
            return Object.assign({}, state, {
              load:state.load>0?state.load-10:state.load
            })
        }
        case 'AUTHENTICATE': {
            return Object.assign({}, state, {
                authorization: window.atob(action.auth),
                articles: state.articles,
                parent_article: state.parent_article,
                profile_user: state.profile_user
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
                parent_article: action.state.parent_article,
                rooms: action.state.rooms,
                texts: action.state.texts,
                chatting_users: action.state.chatting_users,
                room_id: action.state.room_id,
                profile_user: action.state.profile_user,
            })
        }
        case 'ARTICLE_DETAIL': {
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
