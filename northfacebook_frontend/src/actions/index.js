// When the user inputs username, password and clicks the 'Sign In' button, this action is invoked and Saga requests GET to 'auth' in backend page.
export const signIn = (username, password) => {
    return {
        type: 'SIGN_IN',
        username,
        password
    }
}

export const SIGN_IN = 'SIGN_IN'

// When the user is authenticated and succeeds to sign in, this action is invoked by Saga and reducer stores the user's authorization to its state.
export const authenticate = (auth) => {
    return {
        type: 'AUTHENTICATE',
        auth
    }
}

// When the user enters username, password and pwdverification and clicks the '회원가입', this action is invocked and Saga requests POST to 'User List' in backend page.
export const postSignUp = (username, password) => {
    return {
        type: 'POST_SIGN_UP',
        username,
        password
    }
}
//When the user clicks the 'Sign Out' button, this action is invoked
export const signOut = () => {
    return {
       type: 'SIGN_OUT',
    }
}
export const SIGN_OUT = 'SIGN_OUT'
export function addArticle (id, text, images, url){
    return {
      type: 'ADD_ARTICLE',
      text,
      images,
      url,
      id
    }
}
export const ADD_ARTICLE = 'ADD_ARTICLE'

// Move to another page
export const changeUrl = (pathname) => {
    return {
        type: 'CHANGE_URL',
        path: pathname
    }
}

// Send redirection request to /write
export const writeArticle = (id) => {
    return {
        type: 'WRITE_ARTICLE',
        id
    }
}
export const editArticle = (id, username) => {
    return {
        type: 'EDIT_ARTICLE',
        id: id,
        username: username
    }
}
export const putArticle = (id, text, removeImg, images, removeUrl, url) =>{
    return {
        type: 'PUT_ARTICLE',
        text: text,
        removeImg: removeImg,
        images: images,
        removeUrl: removeUrl,
        url: url,
        id: id
    }
}
export const deleteArticle = (id) => {
    return {
        type: 'DELETE_ARTICLE',
        id: id
    }
}

export const setState = (state) => {
    return {
        type: 'SET_STATE',
        state: state
    }
}

export const articleDetail = (id) => {
    return {
        type: 'ARTICLE_DETAIL',
        id: id
    }
}

export const gotoSignUpPage = () => {
    return {
        type: 'GOTO_SIGN_UP',
    }
}

export const postLike = (id, auth) => {
    return {
        type: 'POST_LIKE',
        id: id,
        auth: auth
    }
}

export const postBack = () => {
    return {
        type: 'POST_BACK'
    }
}

// for chatting
export const showCreateRoom = () => {
    return {
	type: 'SHOW_CREATE_ROOM'
    }
}

export const joinRoom = (id) => {
    return {
	type: 'JOIN_ROOM',
	id: id
    }
}

export const showChatting = (id) => {
    return {
	type: 'SHOW_CHATTING',
	id: id
    }
}

export const showChattingRoom = () => {
    return {
        type: 'SHOW_CHATTING_ROOM'
    }
}

export const postText = (room_id, text) => {
    return {
	type: 'POST_TEXT',
	room_id: room_id,
	text: text
    }
}

export const postRoom = (room_name) => {
    return {
	type: 'POST_ROOM',
	room_name: room_name
    }
}

export const updateChatting = (room_id) => {
    return {
	type: 'UPDATE_CHATTING',
	room_id: room_id
    }
}

export const moreArticle = () => {
  return {
    type: "MORE_ARTICLE"
  }
}
export const moreChat = () => {
  return {
    type: "MORE_CHAT"
  }
}
export const lessChat = () => {
  return {
    type: "LESS_CHAT"
  }
}
export const toProfile = (profile_user) =>{
    return {
        type: 'TO_PROFILE',
        profuser: profile_user,
    }
}
export const toChangeIntro = (user,name,belong,intro, removeImg, changeImg, img)=>{
    return {
         type: 'TO_INTRO_CHANGE',
         user: user,
         myname: name,
         mybelong: belong,
         myintro: intro,
         removeImg: removeImg,
         changeImg: changeImg,
         img: img
    }
}
export const toChangePW = (profile_user, oldpw, newpw) => {
    return {
        type: 'TO_PW_CHANGE',
        profuser: profile_user,
        oldpw : oldpw,
        newpw : newpw,
    }
}
export const toEscape = (profile_user) => {
    return {
        type: 'TO_ESCAPE',
        profuser: profile_user,
    }
}
export const gotoFriend = (profile_user) => {
    return {
        type: 'TO_FRIEND',
        profuser: profile_user
    }
}
export const addFriend = (profile_user) => {
    return {
        type: 'ADD_FRIEND',
        profuser: profile_user
    }
}
export const gotoWall = (profile_user) => {
    return {
        type: 'TO_WALL',
        profuser: profile_user
    }
}
export const postAddFriend = (profile_user) => {
    return {
	type: 'POST_ADD_FRIEND',
	profuser: profile_user
    }
}
export const deleteAddFriend = (profile_user) => {
    return {
	type: 'DELETE_ADD_FRIEND',
        profuser: profile_user
    }
}
export const postSasang = (profile_user) => {
    return {
      type: 'POST_SASANG',
      profuser : profile_user
    }
}
export const putSasang = (profile_user) => {
    return {
      type: 'PUT_SASANG',
      profuser : profile_user
    }
}
