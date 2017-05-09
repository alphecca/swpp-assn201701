import { put, take, call, /*fork, select, */spawn } from 'redux-saga/effects'
//import { delay } from 'redux-saga'
import * as actions from './../../actions'

var xhr = require('xhr-promise-redux');

//TODO 개인적으로 테스트시 포트번호를 바꾸자. 풀리퀘를 날릴 때는 포트번호를 확인할 것
const fixed_url = "http://wlxyzlw.iptime.org:7777"; //포오오오트으으으버어어어언호오오오 확이이이인
const auth_check_url = fixed_url+'/auth/';

// localStorage: 현재 사용하고 있는 브라우저 상에 스테이트를 저장하는데 사용.
// 무려 크롬을 종료했다 시작해도 정보가 저장되어 있어요! (컴퓨터를 완전히 껐다 켜면 날라가지만...)
const localStorage = window.localStorage;
// localStorage에 들어갈 정보
//   1. "auth" - 아이디 및 비밀번호 (Base64로 encoding된 버전)
//   2. "parent" - articleDetailPage에서 원글 확인 & writePage에서 댓글 / 일반 포스팅 구분을 위한 parent article의 id

// saga: 미들웨어에서 돌아갈 함수
export default function *saga() {
    const path = window.location.pathname;
    switch(window.location.pathname) {
        case '/':
            yield spawn(loginPageSaga);
            break;
        case '/main':
            yield spawn(mainPageSaga);
            break;
        case '/sign_up':
            yield spawn(signUpPageSaga);
            break;
        default:
            const url = path.split("/");
            switch(url[1]) {
                case 'article':
                    yield spawn(articleDetailPageSaga);
                    break;
                case 'write':
                    yield spawn(writePageSaga);
                    break;
                default:
                    console.log("default state");
            }
    }
}


///// Page별 saga함수
// 여러 기능들을 한 함수에 묶어서 saga함수에 추가할 때 예쁘게 추가하는 용도
//////////////////////////////////////////////////
// Page별 saga함수 작성 규칙
// 1. 페이지명을 포함하는 직관적인 이름의 함수를 정의한다.
//   (ex. 로그인 페이지를 작성할 경우 loginPageSaga)
// 2. 페이지의 url을 예쁘게(<<<<<중요>>>>>) 정의한다.
//   (좋은 예: 메인 페이지의 url - '/main', 나쁜 예: 메인 페이지의 url - '/sogaewonsil_geukhyum')
// 3. switch문의 케이스에 추가한다.
//   (ex. 메인페이지 추가 - case '/main': yield spawn(timeLinePageSaga); break;)
//////////////////////////////////////////////////
function *loginPageSaga() {
    console.log("Login Page");
    yield spawn(watchLoginState);
    yield spawn(watchSignIn);
    yield spawn(watchSignUp);
}

function *signUpPageSaga() {
    console.log("Sign Up Page")
    yield spawn(watchLoginState);
    yield spawn(watchPostSignUp);
}

function *mainPageSaga() {
    console.log("Main Page");
    yield spawn(watchLoginState);
    yield spawn(watchWrite);
    yield spawn(watchDetail);
    yield spawn(watchLike);
    yield spawn(watchSignOut);
    //TODO 메인페이지에도 메인으로 돌아가는 버튼 만들어주세요
    yield spawn(watchGoToMain);

    //TODO 이 부분부터는 함수 구현해야해용
    yield spawn(watchEdit);
    yield spawn(watchDelete);
}

function *articleDetailPageSaga() {
    console.log("Article Detail Page");
    yield spawn(watchLoginState);
    yield spawn(watchWrite);
    yield spawn(watchDetail);
    yield spawn(watchLike);
    yield spawn(watchGoToMain);
    yield spawn(watchSignOut);
    //TODO 이 부분부터는 함수 구현해야해용
    yield spawn(watchEdit);
    yield spawn(watchDelete);
}

function *writePageSaga() {
    console.log("Write Page")
    yield spawn(watchLoginState);
    yield spawn(watchSignOut);
    yield spawn(watchPostArticle);
    //TODO 글쓰기 페이지에도 메인페이지로 돌아가는 버튼 추가해주세오 와와
    yield spawn(watchGoToMain);
}


///// Page별 saga함수에서 쓸 saga함수들 (watch 함수 편)
// watchLoginState: 브라우저에서의 로그인 여부 확인 및 state 업데이트
// 이 코드는 안 봐도 상관은 없을 듯... 애초에 에러 체크때문에 넘나 긴 것
function *watchLoginState() {
    console.log("Prev Auth: "+localStorage.getItem("auth"));
    console.log("Prev Parent: "+localStorage.getItem("parent"))
    if(window.location.pathname === '/' || window.location.pathname === '/sign_up') {
        if(localStorage.getItem("auth") !== null) {
            localStorage.removeItem('parent');
            yield put(actions.changeUrl('/main'));
        }
    }
    else {
        if(localStorage.getItem("auth") === null) {
            localStorage.removeItem('parent');
            yield put(actions.changeUrl('/'));
        }
        else {
            const path = window.location.pathname;
            let data, parent_data;
            if(path === '/main' || path === '/write') {
                //TODO GET the mainpage & update state
                localStorage.removeItem('parent');
                try {
                    data = yield call(xhr.get, fixed_url+'/mainpage/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic '+ localStorage['auth'],
                        Accept: 'application/json'
                        },
                        responseType: 'json'
                    })
                    console.log('Get data without exception');
                    yield put(actions.setState({
                        authorization: window.atob(localStorage['auth']),
                        articles: data.body,
                        parent_article: localStorage['parent']
                    }));
                }
                catch(error) {
                    console.log(error);
                    if(error.statusCode === 200) {
                        //TODO 이거 제대로 작동하는지 확인해야 함 (error로 굴러왔을 때도 data를 쓸 수 있는지 확인)
                        console.log('Succeed to get data');
                        yield put(actions.setState({
                            authorization: localStorage['auth'],
                            articles: data.body,
                            parent_article: localStorage['parent']
                        }));
                    }
                    else if(error.statusCode === 403) {
                        alert("Unauthorized user tried to access mainpage");
                        console.log('whyyyyyyyy');
                    }
                    else if(error.statusCode === 0) {
                        console.log("Backend is not accessible");
                        alert("Temporal Server Error");
                    }
                    else {
                        console.log("Whyyyyyyyyyyy");
                        alert("Unknown Error Occurred");
                    }
                }
            }
            else {
                const id = path.split("/")[2];
                //TODO GET /article/{some_id}/article/ & update state & localStorage
                try {
                    localStorage.setItem('parent', id);
                    data = yield call(xhr.get, fixed_url+'/article/'+id+'/article/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic '+ localStorage['auth'],
                        Accept: 'application/json'
                        },
                        responseType: 'json'
                    });
                    try {
                        parent_data = yield call(xhr.get, fixed_url+'/article/'+id+'/', {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic '+ localStorage['auth'],
                            Accept: 'application/json'
                            },
                            responseType: 'application/json'
                        });
                        console.log('Get data without exception');
                        yield put(actions.setState({
                            authorization: window.atob(localStorage['auth']),
                            articles: data.body,
                            parent_article: parent_data.body
                        }));
                    }
                    catch(error) {
                        console.log(error);
                        if(error.statusCode === 200) {
                            //TODO 이거 제대로 작동하는지 확인해야 함 (error로 굴러왔을 때도 data를 쓸 수 있는지 확인)
                            console.log('Succeed to get data');
                            yield put(actions.setState({
                                authorization: localStorage['auth'],
                                articles: data.body,
                                parent_article: parent_data.body
                            }));
                        }
                        else if(error.statusCode === 403) {
                            alert("Unauthorized user tried to access mainpage");
                            console.log('whyyyyyyyy');
                        }
                        else if(error.statusCode === 0) {
                            console.log("Backend is not accessible");
                            alert("Temporal Server Error");
                        }
                        else {
                            console.log("Whyyyyyyyyyyy");
                            alert("Unknown Error Occurred");
                        }
                    }
                }
                catch(error) {
                    console.log(error);
                    if(error.statusCode === 200) {
                        //TODO 이거 제대로 작동하는지 확인해야 함 (error로 굴러왔을 때도 data를 쓸 수 있는지 확인)
                        try {
                            parent_data = yield call(xhr.get, fixed_url+'/article/'+id+'/', {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Basic '+ localStorage['auth'],
                                Accept: 'application/json'
                                },
                                responseType: 'application/json'
                            });
                            console.log('Get data without exception');
                            yield put(actions.setState({
                                authorization: window.atob(localStorage['auth']),
                                articles: data.body,
                                parent_article: parent_data.body
                            }));
                        }
                        catch(error) {
                            console.log(error);
                            if(error.statusCode === 200) {
                                //TODO 이거 제대로 작동하는지 확인해야 함 (error로 굴러왔을 때도 data를 쓸 수 있는지 확인)
                                console.log('Succeed to get data');
                                yield put(actions.setState({
                                    authorization: localStorage['auth'],
                                    articles: data.body,
                                    parent_article: parent_data.body
                                }));
                            }
                            else if(error.statusCode === 403) {
                                alert("Unauthorized user tried to access mainpage");
                                console.log('whyyyyyyyy');
                            }
                            else if(error.statusCode === 0) {
                                console.log("Backend is not accessible");
                                alert("Temporal Server Error");
                            }
                            else {
                                console.log("Whyyyyyyyyyyy");
                                alert("Unknown Error Occurred");
                            }
                        }
                    }
                    else if(error.statusCode === 403) {
                        alert("Unauthorized user tried to access mainpage");
                        console.log('whyyyyyyyy');
                    }
                    else if(error.statusCode === 0) {
                        console.log("Backend is not accessible");
                        alert("Temporal Server Error");
                    }
                    else {
                        console.log("Whyyyyyyyyyyy");
                        alert("Unknown Error Occurred");
                    }
                }
            }
        }
    }
    console.log('Curr Auth: '+localStorage['auth']);
    console.log('Curr Parent: '+localStorage['parent']);
}

function *watchSignIn() {
    while(true) {
        const data = yield take(actions.SIGN_IN);
        yield call(signIn, data);
    }
}

function *watchSignUp() {
    while(true) {
        yield take('GOTO_SIGN_UP');
        yield put(actions.changeUrl('/sign_up'));
    }
}

function *watchSignOut() {
    while(true) {
        yield take('SIGN_OUT');
        localStorage.removeItem('auth');
        localStorage.removeItem('parent');
        yield put(actions.changeUrl('/'));
    }
}

function *watchPostSignUp() {
    while(true) {
        const data = yield take('POST_SIGN_UP');
        yield call(signUp, data);
    }
}

function *watchWrite() {
    while(true) {
        const data = yield take('WRITE_ARTICLE');
        if(data.id === null)
            yield put(actions.changeUrl('/write'));
        else
            yield put(actions.changeUrl('/write/'+data.id.id));
    }

}

function *watchDetail() {
    while(true) {
        const data = yield take('ARTICLE_DETAIL');
        yield put(actions.changeUrl('/article/'+data.id.id));
    }
}

function *watchLike() {
    while(true) {
        const data = yield take('POST_LIKE');
        yield call(postLike, data.id);
    }

}

function *watchGoToMain() {
    while(true) {
        yield take('POST_BACK');
        yield put(actions.changeUrl('/main'));
    }

}

function *watchPostArticle() {
    while(true) {
        const data = yield take('ADD_ARTICLE');
//        alert(localStorage['parent']);
        yield call(postArticle, data.text);
    }
}

// TODO 이후에 구현할 것들
function *watchDelete() {
    while(true) {
        yield take('POST_DELETE');
    }
}

function *watchEdit() {
    while(true) {
        yield take('EDIT_ARTICLE');
    }
}

///// Page별 saga함수에서 쓸 saga함수 (그 외)
function *signIn(data) {
    const encodedData = window.btoa(data.username + ":" + data.password);
    try {
        yield call(xhr.get, auth_check_url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ encodedData,
                Accept: 'application/json'
            },
            responseType: 'application/json'
        })
        console.log("Login Success without exception");
        alert("Succeed to sign in! :)");
        localStorage.setItem("auth", encodedData);
        yield put(actions.changeUrl('/main'));
    }
    catch(error) {
        if(error.statusCode === 200) {
            console.log('Login Success');
            alert("Succeed to sign in! :)");
            localStorage.setItem("auth", encodedData);
            yield put(actions.changeUrl('/main'));
        }
        else if(error.statusCode === 403) {
            console.log("User not found");
            alert("User not exist!");
        }
        else if(error.statusCode === 0) {
            console.log("Server not available");
            alert("Temporal Server Error");
        }
        else {
            console.log(error);
            alert('Unknown error occurred');
        }
    }
}

function *signUp(data) {
    //TODO post the user data to /user/
    try {
        yield call(xhr.post, fixed_url + '/users/', {
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType:'json',
            body: JSON.stringify({"username": data.username, "password": data.password})
        });
        console.log("post article succeed 1");
        localStorage.setItem("auth", window.btoa(data.username + ":" + data.password));
        yield put(actions.changeUrl('/main'));
    }
    catch(error) {
        if(error.statusCode === 201) {
            console.log("post article succeed 2");
            localStorage.setItem("auth", window.btoa(data.username + ":" + data.password));
            yield put(actions.changeUrl('/main'));

        }
        else if(error.statusCode === 0) {
            alert("Backend server not available");
            console.log("Check backend server");
        }
        else if(error.statusCode === 404) {
            alert("Parent Article Does Not Exist");
            console.log("parent article removed");
        }
        else if(Object.keys(error).length === 0) {
            console.log("post article succeed 3");
            localStorage.setItem("auth", window.btoa(data.username + ":" + data.password));
            yield put(actions.changeUrl('/main'));

        }
        else {
            alert("Unknown Error Occurred");
            console.log(error);
        }
    }

}

function *postLike(id) {
    //TODO post like to /article/{some_id}/like/
    const path = '/article/'+id+'/like/';
    try {
        yield call(xhr.post, fixed_url + path, {
            headers: {
                "Authorization": "Basic " + localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType:'json'
        });
        console.log("post article succeed 1");
        yield put(actions.changeUrl(window.location.pathname));
    }
    catch(error) {
        if(error.statusCode === 201) {
            console.log("post article succeed 2");
            yield put(actions.changeUrl(window.location.pathname));
        }
        else if(error.statusCode === 0) {
            alert("Backend server not available");
            console.log("Check backend server");
        }
        else if(error.statusCode === 404) {
            alert("Parent Article Does Not Exist");
            console.log("parent article removed");
        }
        else if(Object.keys(error).length === 0) {
            console.log("post article succeed 3");
            yield put(actions.changeUrl(window.location.pathname));

        }
        else {
            alert("Unknown Error Occurred");
            console.log(error);
        }
    }
}

function *postArticle(text) {
    const path = localStorage['parent'] === null || localStorage['parent'] === undefined ? '/mainpage/' : '/article/'+localStorage['parent']+'/article/';
    try {
        yield call(xhr.post, fixed_url + path, {
            headers: {
                "Authorization": "Basic " + localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType:'json',
            body: JSON.stringify({"text": text})
        });
        console.log("post article succeed 1");
        yield put(actions.changeUrl('/main'));
    }
    catch(error) {
        if(error.statusCode === 201) {
            console.log("post article succeed 2");
            yield put(actions.changeUrl('/main'));
        }
        else if(error.statusCode === 0) {
            alert("Backend server not available");
            console.log("Check backend server");
        }
        else if(error.statusCode === 404) {
            alert("Parent Article Does Not Exist");
            console.log("parent article removed");
        }
        else if(Object.keys(error).length === 0) {
            console.log("post article succeed 3");
            yield put(actions.changeUrl('/main'));
        }
        else {
            alert("Unknown Error Occurred");
            console.log(error);
        }
    }
}

