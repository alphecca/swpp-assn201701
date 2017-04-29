// When the user inputs username, password and clicks the 'Sign In' button, this action is invoked and Saga requests POST to 'User List' in backend page.
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
