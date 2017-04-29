//import { delay } from 'redux-saga'
import { put, take, call, fork/*, select, spawn*/ } from 'redux-saga/effects'
import * as actions from './../../actions'

var xhr = require('xhr-promise-redux');

// url functions
/*
const user_url = (uid) => {
   return 'http://183.101.189.163:8000/users/' + uid + '/' // TODO
}
*/
const auth_check_url = 'http://183.101.189.163:8000/auth/';

export function* watchSignIn() {
    while (true) {
        const data = yield take(actions.SIGN_IN)
        yield call(sign_in, data)
    }
}

export function* sign_in(data) {
    const auth = "Basic " + window.btoa(data.username+':'+data.password)
    try {
        yield call(xhr.get, auth_check_url/* TODO I need a backend page that checks if the user is authenticated user when frontend requests GET method to this. */, {headers: {'Content-Type': 'application/json', Accept: 'application/json', Authorization: auth}, responseType: 'json'})
        console.log("Succeed to sign in without exception!")
        alert("Succeed to sign in! :)")
        yield put(actions.authenticate(auth));
    }
    catch(error) {
        console.log(error)
        if (error.statusCode === 200) { // Success!
            console.log("Succeed to sign in!")
            alert("Succeed to sign in! :)")
            yield put(actions.authenticate(auth));
        }
        else {
            console.log("Fail to sign in!")
            alert("Fail to sign in! Try again. :(")
        }
    }
}

export default function* saga() {
    yield fork(watchSignIn)
}
