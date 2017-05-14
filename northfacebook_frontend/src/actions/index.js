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
export function addArticle (id, text){
    return {
      type: 'ADD_ARTICLE',
      text,
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
export const editArticle = (id) => {
    return {
        type: 'EDIT_ARTICLE',
        id: id,
    }
}
export const putArticle = (text) =>{
    return {
        type: 'PUT_ARTICLE',
        text: text//after edit
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
export const showChattingRoom = () => {
    return {
        type: 'SHOW_CHATTING_ROOM'
    }
}
