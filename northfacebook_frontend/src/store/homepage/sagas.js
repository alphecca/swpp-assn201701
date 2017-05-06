import { put, take, call, fork, select, spawn } from 'redux-saga/effects'
//import { delay } from 'redux-saga'
import { router } from 'redux-saga-router'
import * as actions from './../../actions'

import {createBrowserHistory} from 'history'

var xhr = require('xhr-promise-redux');

//TODO change before send pull request
const fixed_url = "http://wlxyzlw.iptime.org:7777/";
const auth_check_url = fixed_url+'auth/';
//const article_get_url = fixed_url+'mainpage/';

const history = createBrowserHistory();
// redux-saga-router : sharing state with other pages
const routes = {
    '/': function *loginPageSaga() {
        yield spawn(precheckLogin) //TODO 로그인 후 '/' 접근시 '/main'으로 redirect
        yield spawn(watchSignIn)
    },
    '/main': function *timeLinePageSaga() {
        yield spawn(updateState, 'mainpage/')
        yield spawn(watchSignOut)
        yield spawn(watchWrite)
        yield spawn(watchLike)
        yield spawn(watchDetail)
    },
    '/article/:id?': function *articleDetailPageSaga() {
        yield spawn(updateDetailPage)
    },
    '/sign_up': function *signUpPageSaga() {
        yield spawn(watchSignUp)
    },
    '/write': function *writeArticleSaga(){
        yield spawn(updateState, 'mainpage/')
        yield spawn(watchSignOut)
    }
}

function* getNewState(state, path) {
    console.log(path)
    let data;
    try {
        console.log("hoeee")
        data = yield call(xhr.get, fixed_url+path) //TODO ADD header for authentication after backend authentication for /mainpage/ is implemented
        return Object.assign({}, state, {
            authorization: state.authorization,
            articles: data.body,
            parent_article: state.parent_article
        })
    }
    catch(error) {
        console.log(error)
        if(error.statusCode === 200) {
            console.log("it's okay")
            return Object.assign({}, state, {
                authorization: state.authorization,
                articles: data.body,
                parent_article: state.parent_article
            })
        }
        else if(error.statusCode === 0) {
            alert("Temporal Server Error")
            return null
        }
        else {
            alert("Problem occured when loading the timeline!")
        }
    }
}

/////SIGN IN PAGE/////
//SIGN IN
function* precheckLogin() {
    const data = yield select();
    console.log(data)
    if(data.authorization !== "")
        yield put(actions.changeUrl('/main'))
}

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
        yield put(actions.changeUrl('/main'))
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
        yield put(actions.changeUrl('/main'))
    }
    catch(error) {
        console.log(error)
        console.log("asdfasdfasdf")
        if (error.statusCode === 200) { // Success!
            console.log("Succeed to sign in!")
            alert("Succeed to sign in! :)")
            yield put(actions.authenticate(encodedData));
            const newState = yield select()
            history.push('/main', newState)
            yield put(actions.changeUrl('/main'));
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

/////SIGN UP PAGE/////
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
        yield put(actions.changeUrl('/main'))
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
        yield put(actions.changeUrl('/main'))
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
            yield put(actions.changeUrl('/main'))
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
            const state = yield select()
            history.push('/main', state)
            yield put(actions.changeUrl('/main'))
        }
        else {
            console.log("버그 잡아라 뉴스프링 깔깔깔");
            alert("Fail to sign up! Try again!");
        }
    }
}
//SIGN UP END

/////TIME LINE PAGE/////
//SIGN OUT
export function* watchSignOut() {
    while (true) {
      console.log("watch sign out")
      yield take(actions.SIGN_OUT)
      yield fork(sign_out)
    }
}

export function* sign_out(){
    const state = yield select()
    history.push('/', state)
    yield put(actions.changeUrl('/'))
}
//SIGN OUT END

//WATCH REPLY
export function* watchWrite(){
    while(true) {
        console.log("댓글을 써라 노딩코예야")
        yield take('WRITE_ARTICLE')
        console.log("watch reply")
        const state = yield select()
        history.push('/write', state)
        yield put(actions.changeUrl('/write'))
    }
}


//URL CHANGE
//TODO change HARD CODING into more beautiful code
//TODO remove statusCode 0 error
function *updateState(path) {
    console.log(history.location.state);
    if(history.location.state === undefined || history.location.state.authorization === "")
        yield put(actions.changeUrl('/'))
    else {
        const newState = yield call(getNewState, history.location.state, path)
        if(newState !== null) {
            yield put(actions.setState(newState))
            return
        }
    }
}

//WATCH LIKE
function *watchLike() {
    while(true) {
        const data = yield take('POST_LIKE')
        console.log(data)
        try {
            yield call(xhr.post, fixed_url+'article/'+data.id+'/like/', {
            headers: {
              'Authorization': 'Basic '+ window.btoa(data.auth),
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            responseType: 'json',
        });
        }
        catch(error) {
            console.log(error)
        }
    }
}

//WATCH ARTICLE DETAIL
function *watchDetail() {
    while(true) {
        const data = yield take('ARTICLE_DETAIL')
        alert('detail button clicked')
        const state = yield select()
        alert(JSON.stringify(data))
        const path = 'article/'+data.id
        const newState = yield call(getNewState, state, path)
//        alert(JSON.stringify(newState))
        history.push(path, newState)
        alert(JSON.stringify(history.location))
        yield put(actions.changeUrl(data.id))
    }
}


/////ARTICLE DETAIL PAGE/////
function *updateDetailPage() {
    console.log("welcome to article detail page")
    console.log(history.location)
    let data = yield select()
//    alert(JSON.stringify(history.location.state))
    yield call(updateState, 'article/'+data.parent_article)
    data = yield select()
    alert(JSON.stringify(data))
}

export default function* saga() {
    yield fork(router, history, routes);
}

