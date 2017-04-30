//import { delay } from 'redux-saga'
import { put, take, call, fork/*, select, spawn*/ } from 'redux-saga/effects'
import * as actions from './../../actions'

var xhr = require('xhr-promise-redux');

const auth_check_url = 'http://wlxyzlw.iptime.org:8000/auth/';//TODO change before send pull request
const fixed_url = "http://wlxyzlw.iptime.org:8000/";

//SIGN IN
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
//SIGN IN END

//SIGN UP
export function *watchSignUp() {
    while(true) {
        const data = yield take('POST_SIGN_UP');
        yield call(signUp, data);
    }
}

export function *signUp(data) {
    yield call(console.log, "saga!");
    yield call(console.log, data.username + " " + data.password);
    const auth = "Basic " + window.btoa(data.username+":"+data.password);
    try {
        yield call(xhr.post, fixed_url+'users/', {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: auth
            },
            responseType: 'json'
        });
        console.log("Succeed to sign up without exception!");
        alert("Succeed to sign up! ><");
        window.self.close();
    }
    catch(error) {
        if(error.statusCode === 201) {
            console.log("Succeed to sign up without exception!");
            alert("Succeed to sign up! ><");
            window.self.close();
        }
        else if(error.statusCode === 400) { //Temporary status code for duplicated username
            console.log("User already exist!");
            alert("Username already exist! Try again!");
        }
        else if(error.statusCode === 404) {
            console.log("Backend server not exist!");
            console.log("Backend server does not exist!");
        }
        else {
            console.log("버그 잡아라 뉴스프링 깔깔깔");
            alert("Fail to sign up! Try again ;o;");
        }
    }
}
//SIGN UP END
//SIGN OUT
export function* watchSignOut(){
    while (true){
      yield take(actions.SIGN_OUT)
      yield call(sign_out)
    }
}
export function* sign_out(){
    console.log("Succeed to sign out!")
}
//SIGN OUT END

export default function* saga() {
    yield fork(watchSignIn)
    yield fork(watchSignUp)
    yield fork(watchSignOut)
}
