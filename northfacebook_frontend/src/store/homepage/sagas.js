import { put, take, call, fork, select, spawn } from 'redux-saga/effects'
//import { delay } from 'redux-saga'
import { router } from 'redux-saga-router'
import * as actions from './../../actions'

import {createBrowserHistory} from 'history'

var xhr = require('xhr-promise-redux');

const auth_check_url = 'http://wlxyzlw.iptime.org:8888/auth/';//TODO change before send pull request
const fixed_url = "http://wlxyzlw.iptime.org:8888/";

const history = createBrowserHistory();
// redux-saga-router : sharing state with other pages
const routes = {
    '/': function *loginPageSaga() {
        yield spawn(watchSignIn)
    },
    '/main': function *timeLinePageSaga() {
        yield spawn(changeUrl)
        yield spawn(watchSignOut)
    },
    '/sign_up': function *signUpPageSaga() {
        yield spawn(watchSignUp)
    },
    '/write': function *WritingSaga(){
        yield spawn(enterWriteUrl)
//        yield spawn(watchWrite)
    }
}

//SIGN IN
export function* watchSignIn() {
    while (true) {
        console.log("watch sign in")
        const data = yield take(actions.SIGN_IN)
        yield call(sign_in, data)
    }
}

//TODO hard-coding into beautiful code: redirect when logged in
export function* sign_in(data) {
    const preCheck = yield select()
    if(preCheck.authorization !== "") {
        yield put({type: 'CHANGE_URL', path: '/main'})
    }
    const encodedData = window.btoa(data.username+':'+data.password)
    const auth = "Basic " + encodedData
    console.log(history)
    try {
        yield call(xhr.get, auth_check_url/* TODO I need a backend page that checks if the user is authenticated user when frontend requests GET method to this. */, {headers: {'Content-Type': 'application/json', Accept: 'application/json', Authorization: auth}, responseType: 'json'})
        console.log("Succeed to sign in without exception!")
        alert("Succeed to sign in! :)")
        yield put(actions.authenticate(encodedData))
        const state = yield select()
        history.push('/main', state)
        yield put({type: 'CHANGE_URL', path: '/main'})
    }
    catch(error) {
        console.log(error)
        if (error.statusCode === 200) { // Success!
            console.log("Succeed to sign in!")
            alert("Succeed to sign in! :)")
            yield put(actions.authenticate(auth));
            const state = yield select()
            history.push('/main', state)
            yield put({type: 'CHANGE_URL', path: '/main'})
        }
        else if (error.statusCode === 0) {
            console.log("Backend server is not available!")
            alert("Fail to sign in! Server is not available!")
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
        console.log("watch sign up")
        const data = yield take('POST_SIGN_UP');
        yield call(signUp, data);
    }
}

//TODO hard coding: same as sign_in
export function *signUp(data) {
    const preCheck = yield select()
    if(preCheck.authorization !== "") {
        yield put({type: 'CHANGE_URL', path: '/main'})
    }
    yield call(console.log, "saga!");
    yield call(console.log, data.username + " " + data.password);
    const auth = window.btoa(data.username+":"+data.password);
    try {
        yield call(xhr.post, fixed_url+'users/', {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            responseType: 'json',
            body: '{"username": "'+data.username+'", "password": "'+data.password+'"}'
        });
        console.log("Succeed to sign up without exception!");
        alert("Succeed to sign up!");
        yield put(actions.authenticate(auth))
        const state = yield select()
        history.push('/main', state)
        yield put({type: 'CHANGE_URL', path: '/main'})

    }
    catch(error) {
        console.log(error)
        console.log(error.statusCode)
        if(error.statusCode === 201) {
            console.log("Succeed to sign up without exception!");
            alert("Succeed to sign up!");
            yield put(actions.authenticate(auth));
            const state = yield select()
            history.push('/main', state)
            yield put({type: 'CHANGE_URL', path: '/main'})
        }
        else if(error.statusCode === 405) { //Temporary status code for duplicated username
            console.log("User already exist!");
            alert("Username already exist! Try again!");
        }
        else if(error.statusCode === 404) {
            console.log("Backend server does not exist!");
        }
        else if(error.statusCode === 0) {
            console.log("Backend server is not available!");
            alert("Fail to sign up! Server is not available!");
        }
        else if(Object.keys(error).length === 0) {
            console.log("Succeed to sign up without exception!");
            alert("Succeed to sign up!");
            yield put(actions.authenticate(auth));
            const state = yield select()
            history.push('/main', state)
            yield put({type: 'CHANGE_URL', path: '/main'})
        }
        else {
            console.log("버그 잡아라 뉴스프링 깔깔깔");
            alert("Fail to sign up! Try again!");
        }
    }
}
//SIGN UP END
//SIGN OUT
export function* watchSignOut() {
    while (true) {
      console.log("watch sign out")
      yield take(actions.SIGN_OUT)
      yield fork(sign_out)
    }
}

export function* sign_out(){
    yield call(console.log, "Succeed to sign out!")
}
//SIGN OUT END

//URL CHANGE
//TODO change HARD CODING into more beautiful code
function *changeUrl() {
    console.log(history.location)
    if(history.location.state === undefined || history.location.state.authorization === "")
        yield put({type: 'CHANGE_URL', path: '/'})
    else
        yield put({type: 'SET_STATE', state: history.location})
}

export default function* saga() {
    yield fork(router, history, routes);
}

function *enterWriteUrl(){
     console.log(history.location)
    if(history.location.state === undefined)
        yield put({type: 'CHANGE_URL', path: '/'})
    else
        yield put({type: 'SET_STATE', state: history.location})
}
export function* watchWrite(){
   while(true){
     console.log("Enter writing page")
     yield take(actions.SIGN_OUT)
     yield fork(sign_out)
   } 
}

