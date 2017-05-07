import { put, take, call, fork, select, spawn } from 'redux-saga/effects'
//import { delay } from 'redux-saga'
import { router } from 'redux-saga-router'
import * as actions from './../../actions'

import {createBrowserHistory} from 'history'

var xhr = require('xhr-promise-redux');

//TODO change before send pull request
const fixed_url = "http://wlxyzlw.iptime.org:7777";
const auth_check_url = fixed_url+'/auth/';
//const article_get_url = fixed_url+'mainpage/';

const history = createBrowserHistory();
// redux-saga-router : sharing state with other pages
const routes = {
    '/': function *loginPageSaga() {
        yield spawn(precheckLogin) //TODO 로그인 후 '/' 접근시 '/main'으로 redirect
        yield spawn(watchSignIn)
    },
    '/main': function *timeLinePageSaga() {
        yield spawn(updateState, '/mainpage/')
        yield spawn(watchSignOut)
        yield spawn(watchWrite)
        yield spawn(watchLike)
        yield spawn(watchDetail)
    },
    '/article/*': function *articleDetailPageSaga() {
        yield spawn(updateDetailPage)
        yield spawn(watchSignOut)
        yield spawn(watchLike)
        yield spawn(watchWrite)
        yield spawn(watchDetail)
    },
    '/sign_up': function *signUpPageSaga() {
        yield spawn(watchSignUp)
    },
    '/write/:id?': function *writeArticleSaga(){
        yield spawn(updateWritePage)
        yield spawn(watchSignOut)
        yield spawn(watchPost)
    }
}

function* getNewState(state, path) {
//    console.log(path)
    let data;
    let parent_data = null;
    try {
        console.log("hoeee")
        data = yield call(xhr.get, fixed_url+path) //TODO ADD header for authentication after backend authentication for /mainpage/ is implemented
        if(state.parent_article !== null) {
            parent_data = yield call(xhr.get, fixed_url + '/article/' + state.parent_article.id+'/')
        }
        return Object.assign({}, state, {
            authorization: state.authorization,
            articles: data.body,
            parent_article: parent_data === null ? state.parent_article : parent_data.body
        })
    }
    catch(error) {
        console.log(error)
        if(error.statusCode === 200) {
            console.log("it's okay")
            return Object.assign({}, state, {
                authorization: state.authorization,
                articles: data.body,

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
        const newState = yield call(getNewState, state, '/mainpage/')
        history.push('/main', newState)
    }
    catch(error) {
        console.log(error)
        console.log("asdfasdfasdf")
        if (error.statusCode === 200) { // Success!
            console.log("Succeed to sign in!")
            alert("Succeed to sign in! :)")
            yield put(actions.authenticate(encodedData));
            const state = yield select()
            const newState = yield call(getNewState, state, '/mainpage/')
            history.push('/main', newState)
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
        yield call(xhr.post, fixed_url+'/users/', {
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
        const newState = yield call(getNewState, state, '/mainpage/')
        alert(JSON.stringify(newState))
        history.push('/main', newState)
    }
    catch(error) {
        console.log(error)
        console.log(error.statusCode)
        if(error.statusCode === 201) {
            console.log("Succeed to sign up without exception!2");
            alert("Succeed to sign up!");
            yield put(actions.authenticate(auth));
            const state = yield select()
            const newState = yield call(getNewState, state, '/mainpage/')
            history.push('/main', newState)
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
            console.log("Succeed to sign up without exception!3");
            alert("Succeed to sign up!");
            yield put(actions.authenticate(auth))
            const state = yield select()
            const newState = yield call(getNewState, state, '/mainpage/')
            history.push('/main', newState)

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
        const data = yield take('WRITE_ARTICLE')
        console.log("watch reply")
        const state = yield select()
//        alert(JSON.stringify(data))
        if(data.id === null) {
//            alert(JSON.stringify(state))
            history.push('/write', state)
        }
        else {
            const newState = yield call(getNewState, state, '/article/'+data.id.id+'/article/')
//            alert(data.id.id+" "+JSON.stringify(newState))
            history.push('/write/'+data.id.id, Object.assign({}, newState, {
                authorization: newState.authorization,
                articles: newState.articles,
                parent_article: data.id
            }))
        }
//        yield put(actions.changeUrl('/write'))
    }
}


//URL CHANGE
//TODO change HARD CODING into more beautiful code
//TODO remove statusCode 0 error
function *updateState(path) {
    if(history.location.state === undefined || history.location.state.authorization === "")
        yield put(actions.changeUrl('/'))
    else {
        const newState = yield call(getNewState, history.location.state, path)
//        console.log(newState)
//        console.log(history.location.state)
        if(newState !== null) {
            yield put(actions.setState(newState))
            const tmp = yield select()
            console.log(tmp)
            console.log("웅앵웅 초키포키")
            if(JSON.stringify(tmp) !== JSON.stringify(history.location.state)) {
                history.push(history.location.pathname, newState)
                console.log('NUGABA')
            }
        }
    }
}

//WATCH LIKE
function *watchLike() {
    while(true) {
        const data = yield take('POST_LIKE')
        console.log(data)
        try {
            yield call(xhr.post, fixed_url+'/article/'+data.id+'/like/', {
                headers: {
                  'Authorization': 'Basic '+ window.btoa(data.auth),
                  'Content-Type': 'application/json',
                  Accept: 'application/json'
                },
                responseType: 'json',
            });
        }
        catch(error) {
            if(error.statusCode === 201) {
                console.log("Succeed2");
            }
            else if(error.statusCode === 404) {
                console.log("Backend server does not exist!");
            }
            else if(error.statusCode === 0) {
                console.log("Backend server is not available!");
            }
            else if(Object.keys(error).length === 0) {
                console.log("Succeed3");
            }
        }
    }
}

//WATCH ARTICLE DETAIL
function *watchDetail() {
    while(true) {
        const data = yield take('ARTICLE_DETAIL')
        alert('detail button clicked')
        const state = yield select()
        const path = '/article/'+data.id.id
        const newState = yield call(getNewState, state, path+'/article/')
        history.push(path, newState)
    }
}


/////ARTICLE DETAIL PAGE/////
function *updateDetailPage() {
    console.log("welcome to article detail page")
//    console.log(history.location)
    yield spawn(updateState, history.location.pathname+'/article/')
//    console.log(yield select())
}

/////WRITE PAGE/////
function *updateWritePage() {
    console.log("welcome to write page")
    let url = '/article/'
    if(history.location.pathname === '/write') {
//        alert(JSON.stringify(history.location))
        yield call(updateState, '/mainpage/')
    }
    else {
        url = url+history.location.pathname.split("/")[2]+'/article/'
        yield call(updateState, url)
    }
    console.log(yield select())

}

function *watchPost() {
    const data = yield take('ADD_ARTICLE')
//    alert(JSON.stringify(data))
    const url = data.id === null? '/article/': '/article/'+data.id.id + '/article/'
//    alert(url)
    try {
        yield call(xhr.post, fixed_url + url, {
            headers: {
              'Authorization': 'Basic '+ window.btoa(history.location.state.authorization),
              'Content-Type': 'application/json',
               Accept: 'application/json'
            },
            responseType: 'json',
            body: JSON.stringify({"text": data.text})//'{"text":'+data.text+'}'
        })
        const state = yield select()
        history.push('/main', state)
        console.log(history.location.pathname)
    }
    catch(error) {
        if(error.statusCode === 201) {
            console.log("Succeed2");
            const state = yield select()
            history.push('/main', state)
            console.log(history.location.pathname)
        }
        else if(error.statusCode === 404) {
            console.log("Backend server does not exist!");
        }
        else if(error.statusCode === 0) {
            console.log("Backend server is not available!");
        }
        else if(Object.keys(error).length === 0) {
            console.log("Succeed3");
            const state = yield select()
            history.push('/main', state)
            console.log(history.location.pathname)
        }

    }
}

export default function* saga() {
    yield fork(router, history, routes);
}

