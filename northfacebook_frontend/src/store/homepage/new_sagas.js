import { put, take, call, /*fork, */select, spawn } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as actions from './../../actions'

var xhr = require('xhr-promise-redux');

//TODO 개인적으로 테스트할 때는 포트번호를 바꾸자. 풀리퀘를 날릴 때는 URL을 확인할 것
const fixed_url = /*"http://localhost:8000/";*/"http://wlxyzlw.iptime.org:8000/"; //포오오오트으으으버어어어언호오오오 확이이이인
//const fixed_url = 'http://wlxyzlw.iptime.org:7777/';
const auth_check_url = fixed_url+'auth/';

// 이제 backend에서 사용하는 url은 모두 'path_name/'의 형식을 따르고, frontend에서 사용하는 url은 모두 '/path_name/'의 형식을 따릅니다.

// localStorage: 현재 사용하고 있는 브라우저 상에 스테이트를 저장하는데 사용.
// 무려 크롬을 종료했다 시작해도 정보가 저장되어 있어요!
// state의 경우 현재 페이지에서만 유지됩니다. (다른 페이지로 이동 시 리셋되기 때문에 새로 스테이트를 세팅해줘야 합니다. - 이 기능을 하는게 watchLoginState)
// localStorage에 들어갈 정보
//   1. "auth" - 아이디 및 비밀번호 (Base64로 encoding된 버전)
//   2. "parent" - articleDetailPage에서 원글 확인 & writePage에서 댓글 / 일반 포스팅 구분을 위한 parent article의 id
// localStorage의 정보를 넣기/가져오기/삭제하기
//      (1) 가져오기: localStorage.getItem('data_name') / localStorage['data_name']
//      (2) 넣기: localStorage.setItem('data_name', data) / localStorage['data_name'] = data
//      (3) 삭제하기: localStorage.removeItem('data_name')
const localStorage = window.localStorage;


// saga: 미들웨어에서 돌아갈 함수
export default function *saga() {
    const path = window.location.pathname;
    switch(window.location.pathname) {
        case '/':
            yield spawn(loginPageSaga);
            break;
        case '/main/':
            yield spawn(mainPageSaga);
            break;
        case '/sign_up/':
            yield spawn(signUpPageSaga);
            break;
        default:
            const url = path.split("/");
            switch(url[1]) {
                case 'article':
                    yield spawn(articleDetailPageSaga);
                    break;
                case 'room':
                    yield spawn(roomPageSaga);
                    break;
                case 'create_room':
                    yield spawn(createRoomPageSaga);
                    break;
                case 'chatting':
                    yield spawn(chattingPageSaga, url[2]);
                    break;
                case 'wall':
                    yield spawn(wallPageSaga);
                    break;
                case 'profile':
                    yield spawn(profilePageSaga);
                    break;
                case 'friend':
                    yield spawn(friendPageSaga);
                    break;
                case 'addfriend':
                    yield spawn(addFriendPageSaga);
                    break;
                default:
                    console.log("default state");
                    alert("없는 장소");
                    if(localStorage.getItem("auth") === null) {
                        localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/'));
                    } else {
                        localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/main/'));
                    }
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
//   (좋은 예: 메인 페이지의 url - '/main/', 나쁜 예: 메인 페이지의 url - '/sogaewonsil_real_geukhyum/')
// 3. switch문의 케이스에 추가한다.
//   (ex. 메인페이지 추가 - case '/main/': yield spawn(timeLinePageSaga); break;)
// 4. 페이지 이동은 yield put(actions.changeUrl('/target_path/'))를 이용하시면 됩니다.
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
    yield spawn(watchDetail);
    yield spawn(watchLike);
    yield spawn(watchSignOut);
    yield spawn(watchGoToMain);
    yield spawn(watchDelete);
    yield spawn(watchChattingRoom);
    yield spawn(watchToProfile);
    yield spawn(watchPostArticle);
    yield spawn(watchPutArticle);
}

function *articleDetailPageSaga() {
    console.log("Article Detail Page");
    yield spawn(watchLoginState);
    yield spawn(watchDetail);
    yield spawn(watchLike);
    yield spawn(watchGoToMain);
    yield spawn(watchSignOut);
    yield spawn(watchDelete);
    yield spawn(watchToProfile);
    yield spawn(watchPostArticle);
    yield spawn(watchPutArticle);
}

function *roomPageSaga(){
    console.log("Chatting Room Page")
    yield spawn(watchLoginState);
    yield spawn(watchSignOut);
    yield spawn(watchGoToMain);
    yield spawn(watchCreateRoom);
    yield spawn(watchJoinRoom);
    yield spawn(watchQuitRoom);
    yield spawn(watchChatting);
}

function *chattingPageSaga(id){
    console.log("Chatting Page: "+id);
    yield spawn(watchLoginState);
    yield spawn(watchSignOut);
    yield spawn(watchGoToMain);
    yield spawn(watchChattingRoom);
    yield spawn(watchSendText);
    yield spawn(watchUpdateChatting);
}

function *createRoomPageSaga(){
    console.log("Create Chatting Room Page")
    yield spawn(watchLoginState);
    yield spawn(watchSignOut);
    yield spawn(watchPostRoom);
    yield spawn(watchChattingRoom);
}

function *wallPageSaga() {
    yield spawn(watchLoginState);
    yield spawn(watchDetail);
    yield spawn(watchLike);
    yield spawn(watchSignOut);
    yield spawn(watchGoToMain);
    yield spawn(watchToProfile);
}

function *profilePageSaga() {
    console.log("[ProfilePageSaga]");
    yield spawn(watchLoginState);
    yield spawn(watchSignOut);
    yield spawn(watchGoToMain);
    yield spawn(watchPWChange);
    yield spawn(watchIntroChange);
    yield spawn(watchEscape);
    yield spawn(watchGoToFriend);
    yield spawn(watchAddFriend);
    yield spawn(watchGoToWall);
    yield spawn(watchPostSasang);
    yield spawn(watchPutSasang);
}

function *friendPageSaga() {
    yield spawn(watchLoginState);
    yield spawn(watchSignOut);
    yield spawn(watchGoToMain);
    yield spawn(watchAddFriend);
    yield spawn(watchToProfile);
}

function *addFriendPageSaga() {
    yield spawn(watchLoginState);
    yield spawn(watchSignOut);
    yield spawn(watchGoToMain);
    yield spawn(watchGoToFriend);
    yield spawn(watchToProfile);
    yield spawn(watchPostAddFriend);
    yield spawn(watchDeleteAddFriend);
    // TODO add something else
}

///// Page별 saga함수에서 쓸 saga함수들 (watch 함수 편)
// watchLoginState: 브라우저에서의 로그인 여부 확인 및 state 업데이트
// <<주의>> 새로운 Page를 추가할 경우 PageSaga함수에 반드시 추가할 것
// <<주의>> 새로운 state를 추가할 경우 try-catch문을 이용해 정보를 받아온 후 스테이트에 업데이트 해야 함
function *watchLoginState() {
    if(window.location.pathname[window.location.pathname.length-1] !== '/') {
        yield put(actions.changeUrl(window.location.pathname+'/'));
        return;
    }
    if(window.location.pathname === '/' || window.location.pathname === '/sign_up/') {
        if(localStorage.getItem("auth") !== null) {
            localStorage.removeItem('parent');
            yield put(actions.changeUrl('/main/'));
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
            if(path === '/main/') { // 여기가 바로 하드코딩된 부분입니다 여러분!
                localStorage.removeItem('parent');
                try {
                    data = yield call(xhr.get, fixed_url+'mainpage/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic '+ localStorage['auth'],
                            Accept: 'application/json'
                        },
                        responseType: 'json'
                    })
                    console.log('Get data without exception');
                }
                catch(error) {
                    console.log(error);
                    if(error.statusCode === 200) {
                        console.log('Succeed to get data');
                        data = error;
                    }
                    else if(error.statusCode === 403) {
                        alert("BooK에 가려면 려권을 보여주게나.");
                        console.log('whyyyyyyyy');
                        localStorage.removeItem('auth');
                        localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/'));
                    }
                    else if (error.statusCode === 404) {
                        alert("없는 장소");
                        if(localStorage.getItem("auth") === null) {
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                        } else {
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/main/'));
                        }
                    }
                    else if(error.statusCode === 0) {
                        console.log("Backend is not accessible");
                        alert("나라에 사정이 있소");
                        localStorage.removeItem('auth');
                        localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/'));
                        return;
                    }
                    else {
                        console.log("Whyyyyyyyyyyy");
                        alert("1조원들을 찾아주게나");
                        return;
                    }
                }
                yield put(actions.setState({
                    authorization: window.atob(localStorage['auth']),
                    articles: data.body,
                    parent_article: null,
                    nowchat_rooms: [],
                    nonchat_rooms: [],
                    texts: [],
                    chatting_users: [],
                    room_id: 0,
                    loading: true,
                    sasangs:[],
                    load : 0
                    //TODO 이후 state 추가 시 여기에 스테이트 업데이트 추가
                }));
            }
            else if (path === '/room/') { // 여기도 하드코딩된 부분이지
                localStorage.removeItem('parent');
                try {
                    data = yield call(xhr.get, fixed_url+'nowchat/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic '+ localStorage['auth'],
                            Accept: 'application/json'
                        },
                        responseType: 'json'
                    })
                    console.log('Get data without exception');
                }
                catch(error) {
                    console.log(error);
                    if(error.statusCode === 200) {
                        console.log('Succeed to get data');
                        data = error;
                    }
                    else if(error.statusCode === 403) {
                        alert("대화방에 가려면 려권을 보여주게나.");
                        console.log('permission denied');
                        localStorage.removeItem('auth');
                        localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/'));
                    }
                    else if (error.statusCode === 404) {
                        alert("없는 장소");
                        if(localStorage.getItem("auth") === null) {
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                        } else {
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/main/'));
                        }
                    }
                    else if(error.statusCode === 0) {
                        alert("나라에 사정이 있소.");
                        console.log("Temporary Server Error");
                        localStorage.removeItem('auth');
                        localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/'));
                        return;
                    }
                    else {
                        alert("1조원들을 찾아주게나.");
                        console.log("Unknown error occurred");
                        return;
                    }
                }
                let data2;
                try {
                    data2 = yield call(xhr.get, fixed_url+'nonchat/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic '+ localStorage['auth'],
                            Accept: 'application/json'
                        },
                        responseType: 'json'
                    })
                    console.log('Get data without exception');
                }
                catch(error) {
                    console.log(error);
                    if(error.statusCode === 200) {
                        console.log('Succeed to get data');
                        data2 = error;
                    }
                    else if(error.statusCode === 403) {
                        alert("대화방에 가려면 려권을 보여주게나.");
                        console.log('permission denied');
                        localStorage.removeItem('auth');
                        localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/'));
                    }
                    else if (error.statusCode === 404) {
                        alert("없는 장소");
                        if(localStorage.getItem("auth") === null) {
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                        } else {
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/main/'));
                        }
                    }
                    else if(error.statusCode === 0) {
                        alert("나라에 사정이 있소.");
                        console.log("Temporary Server Error");
                        localStorage.removeItem('auth');
                        localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/'));
                        return;
                    }
                    else {
                        alert("1조원들을 찾아주게나.");
                        console.log("Unknown error occurred");
                        return;
                    }
                }
                yield put(actions.setState({
                    authorization: window.atob(localStorage['auth']),
                    articles: [],
                    parent_article: null,
                    nowchat_rooms: data.body,
                    nonchat_rooms: data2.body,
                    texts: [],
                    chatting_users: [],
                    room_id: 0,
                    profile_user: null,
                    loading: true,
                    sasangs:[],
                    load: 0,
                    // TODO 이후 state에 항목 추가 시 여기에도 추가바람.
                }));
            }
            else if (path === '/create_room/') { // 여기도 하드코딩된 부분이지
		let username = window.atob(localStorage['auth']).split(':')[0];
                console.log("username: "+username);
                localStorage.removeItem('parent');
                try{
                    data = yield call(xhr.get, fixed_url+'users/'+username+'/friends/',{
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic '+localStorage['auth'],
                        Accept: 'application/json'
                        },
                        responseType: 'json'
                     });
                     console.log('Get data without exception');
                } catch(error) {
                    console.log(error);
                    //TODO error case
                    if (error.statusCode === 403) {
                        alert("자격이 없소.");
                    } else if(error.statusCode === 404) {
                        alert("없는 장소");
                        console.log("안단티노가 안심하래");
                        if(localStorage.getItem("auth") === null) {
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                        } else {
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/main/'));
                        }
                        return;
                    } else if(error.statusCode === 0) {
                        alert("나라에 잠시 일이 생겼소.");
                        console.log("Temporary Server error. Try reloading");
                        localStorage.removeItem('auth');
                        localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/'));
                        return;
                    } else {
                        alert("1조원들을 찾아주게나.");
                        return;
                    }
                }
                yield put(actions.setState({
                    authorization: window.atob(localStorage['auth']),
                    articles: [],
                    parent_article: null,
                    nowchat_rooms: [],
                    nonchat_rooms: [],
                    friends: data.body,
                    texts: [],
                    chatting_users: [],
                    room_id: 0,
                    profile_user: null,
                    loading: true,
                    sasangs:[],
                    load: 0,
                    // TODO 이후 state에 항목 추가 시 여기에도 추가바람.
                }));
            }
            else { // username또는 id를 기준으로 backend에 겟을 날리는 경우
                const username = path.split("/")[2];
                const id = path.split("/")[2];//그냥..
                let profile_data = null;
                let friend_data = null;
                let my_data = null;
                let sasangs = null;
                if (username === undefined || username === '') {
                    console.log("404 not found");
                    alert("없는 장소");
                    if(localStorage.getItem("auth") === null) {
                        localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/'));
                    } else {
                        localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/main/'));
                    }
                    return;
                }
                if (path.split("/")[1] === 'chatting') {
                    localStorage.removeItem('parent');
                    yield put(actions.updateChatting(username));
                    // watchUpdateChatting이 뒤를 맡게 되니 여기선 신경쓰지 않아도 됨
                }
                else if(path.split("/")[1] === 'wall') {
                    // 담벼락에 들어갈 글을 Get하는 부분
                    localStorage.removeItem('parent');
                    console.log("asdf");
                    try {
                        data = yield call(xhr.get, fixed_url+'users/'+username+'/wall/', { //TODO 이후 프로필 페이지 프론트도 완성 시 프로필이 들어갈 거에요
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic '+ localStorage['auth'],
                            Accept: 'application/json'
                            },
                            responseType: 'json'
                        });
                    }
                    catch(error) {
                        console.log(error);
                        if(error.statusCode === 200) {
                            data = error;
                        }
                        else if(error.statusCode === 403) {
                            alert("담벼락으로 가려면 려권을 보여주게나.");
                            console.log('whyyyyyyyy');
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                        }
                        else if(error.statusCode === 404) {
                            console.log("404 Not Found");
                            console.log("안심하세요, 이 오류는 Unknown Error가 아닙니다.");
                            alert("없는 장소");
                            if(localStorage.getItem("auth") === null) {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/'));
                            } else {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/main/'));
                            }
                            return;
                        }
                        else if(error.statusCode === 0) {
                            console.log("Backend is not accessible");
                            alert("나라에 잠시 사정이 생겼소! 다시 오게나.");
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                            return;
                        }
                        else {
                            console.log("Whyyyyyyyyyyy");
                            alert("1조원들을 찾아주게나.");
                            return;
                        }
                    }
                    try {
                        profile_data = yield call(xhr.get, fixed_url+'users/'+username+'/', { //TODO 이후 프로필 페이지 완성 시 프로필이 들어갈 거에요
                            headers: {
                               'Content-Type': 'application/json',
                                'Authorization': 'Basic '+ localStorage['auth'],
                            Accept: 'application/json'
                           },
                            responseType: 'json'
                        });
                    }
                    catch(error) {
                        console.log(error);
                        if(error.statusCode === 200) {
                           data = error;
                        }
                        else if(error.statusCode === 403) {
                            alert("담벼락에 오려면 려권을 보여주게나.");
                           console.log('whyyyyyyyy');
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                        }
                        else if(error.statusCode === 404) {
                            console.log("404 Not Found");
                            console.log("안심하세요, 이 오류는 Unknown Error가 아닙니다.");
                            alert("없는 장소");
                            if(localStorage.getItem("auth") === null) {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/'));
                            } else {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/main/'));
                            }
                            return;
                        }
                        else if(error.statusCode === 0) {
                            console.log("Backend is not accessible");
                            alert("나라에 잠시 사정이 생겼소!");
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                            return;
                        }
                        else {
                            console.log("Whyyyyyyyyyyy");
                            alert("1조원들을 찾아주게나.");
                            return;
                        }
                    }
                    console.log(profile_data);
                    yield put(actions.setState({
                        authorization: window.atob(localStorage['auth']),
                        articles: data.body,
                        parent_article: null,
                        nowchat_rooms: [],
                        nonchat_rooms: [],
                        texts: [],
                        chatting_users: [],
                        room_id: 0,
                        profile_user: profile_data.body,
                        loading: true,
                        load: 0,
                        //TODO 이후 state 추가 시 여기에 스테이트 업데이트 추가
                    }));
                }
                else if(path.split("/")[1] === 'profile'){
                    //프로필 정보를 get하는 부분
                    console.log("get profile details...");
                    try{
                        profile_data = yield call(xhr.get, fixed_url+'users/'+username+'/profile/',{
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic '+localStorage['auth'],
                            Accept: 'application/json'
                            },
                            responseType: 'json'
                         });
                         sasangs = yield call(xhr.get, fixed_url+'users/'+username+'/sasang/',{
                            headers:{
                                'Content-Type':'application/json',
                                'Authorization':'Basic '+localStorage['auth'],
                            Accept: 'application/json'
                            },
                            responseType:'json'
                         });
                         console.log('Get data without exception');
                    }catch(error){
                        console.log(error);
                        //TODO error case
                        if(error.statusCode === 403){
                            alert("당신은 려권을 볼 자격이 없소!");
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                        }else if(error.statusCode === 404){
                            alert("없는 장소");
                            console.log("뉴스프링이 안심하래");
                            if(localStorage.getItem("auth") === null) {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/'));
                            } else {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/main/'));
                            }
                            return ;
                        }else if(error.statusCode === 0){
                            console.log("Backend server is not accessible");
                            alert("나라에 잠시 사정이 생겼소.");
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                            return;
                        }else{
                            alert("1조원들을 찾아주시오.");
                            return;
                        }
                    }
                    yield put(actions.setState({
                        authorization: window.atob(localStorage['auth']),
                        parent_article: null,
                        articles: [],
                        nowchat_rooms: [],
                        nonchat_rooms: [],
                        texts: [],
                        chatting_users: [],
                        room_id: 0,
                        profile_user: profile_data.body,
                        loading: true,
                        load: 0,
                        sasangs:sasangs.body
                    }));
                }
                else if(path.split("/")[1] === 'friend'){
                    //프로필 정보를 get하는 부분
                    console.log("get friend list...");
                    try{
                        data = yield call(xhr.get, fixed_url+'users/'+username+'/friends/',{
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic '+localStorage['auth'],
                            Accept: 'application/json'
                            },
                            responseType: 'json'
                         });
                         console.log('Get data without exception');
                    } catch(error) {
                        console.log(error);
                        //TODO error case
                        if (error.statusCode === 403) {
                            alert("자격이 없소.");
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                        } else if(error.statusCode === 404) {
                            alert("없는 장소");
                            console.log("안단티노가 안심하래");
                            if(localStorage.getItem("auth") === null) {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/'));
                            } else {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/main/'));
                            }
                            return;
                        } else if(error.statusCode === 0) {
                            alert("나라에 잠시 일이 생겼소.");
                            console.log("Temporary Server error. Try reloading");
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                            return;
                        } else {
                            alert("1조원들을 찾아주게나.");
                            return;
                        }
                    }
                    yield put(actions.setState({
                        authorization: window.atob(localStorage['auth']),
                        parent_article: null,
                        articles: [],
                        nowchat_rooms: [],
                        nonchat_rooms: [],
                        texts: [],
                        chatting_users: [],
                        room_id: 0,
                        profile_user: { user: username },
                        friends: data.body,
                        friend_requests: [],
                        my_requests: [],
                        loading: true,
                        load: 0,
                                        }));
                }
                else if(path.split("/")[1] === 'addfriend'){
                    //프로필 정보를 get하는 부분
                    console.log("get addfriend list...");
                    try{
                        data = yield call(xhr.get, fixed_url+'users/'+username+'/addfriend/',{
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic '+localStorage['auth'],
                            Accept: 'application/json'
                            },
                            responseType: 'json'
                         });
                         console.log('Get data without exception');
                    } catch(error) {
                        console.log(error);
                        //TODO error case
                        if (error.statusCode === 403) {
                            console.log("Unauthorized user tried to access profile page. Please sign in first");
                            alert("당신은 자격이 없소.");
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                            return;
                        } else if(error.statusCode === 404) {
                            alert("없는 장소");
                            console.log("안단티노가 안심하래");
                            if(localStorage.getItem("auth") === null) {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/'));
                            } else {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/main/'));
                            }
                            return;
                        } else if(error.statusCode === 0) {
                            alert("나라에 사정이 생겼소.");
                            console.log("Temporary Server error. Try reloading");
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                            return;
                        } else {
                            alert("1조를 찾아주시오.");
                            return;
                        }
                    }
                    try{
                        friend_data = yield call(xhr.get, fixed_url+'users/'+username+'/friends/',{
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic '+localStorage['auth'],
                            Accept: 'application/json'
                            },
                            responseType: 'json'
                         });
                         console.log('Get data without exception');
                    } catch(error) {
                        console.log(error);
                        //TODO error case
                        if (error.statusCode === 403) {
                            alert("려권을 볼 자격이 없소");
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                            return;
                        } else if(error.statusCode === 404) {
                            alert("없는 장소");
                            console.log("안단티노가 안심하래");
                            if(localStorage.getItem("auth") === null) {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/'));
                            } else {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/main/'));
                            }
                            return;
                        } else if(error.statusCode === 0) {
                            console.log("Backend server is not accessible");
                            alert("나라에 사정이 있소.");
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                            return;
                        } else {
                            alert("1조를 찾아주시오.");
                            return;
                        }
                    }
                    try{
                        my_data = yield call(xhr.get, fixed_url+'myaddfriend/',{
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic '+localStorage['auth'],
                            Accept: 'application/json'
                            },
                            responseType: 'json'
                         });
                         console.log('Get data without exception');
                    } catch(error) {
                        console.log(error);
                        //TODO error case
                        if (error.statusCode === 403) {
                            alert("려권을 볼 자격이 없소");
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                            return;
                        } else if(error.statusCode === 404) {
                            alert("없는 장소");
                            console.log("안단티노가 안심하래");
                            if(localStorage.getItem("auth") === null) {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/'));
                            } else {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/main/'));
                            }
                            return;
                        } else if(error.statusCode === 0) {
                            console.log("Backend server is not accessible");
                            alert("나라에 사정이 있소.");
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                            return;
                        } else {
                            alert("1조를 찾아주시오.");
                            return;
                        }
                    }
                    yield put(actions.setState({
                        authorization: window.atob(localStorage['auth']),
                        parent_article: null,
                        articles: [],
                        nowchat_rooms: [],
                        nonchat_rooms: [],
                        texts: [],
                        chatting_users: [],
                        room_id: 0,
                        profile_user: { user: username },
                        friends: friend_data.body,
                        friend_requests: data.body,
                        my_requests: my_data.body,
                        loading: true,
                        load: 0,
                                        }));
                }
                else {
                    // 스테이트의 articles에 들어갈 내용을 받는 try-catch 문
                    try {
                        localStorage.setItem('parent', id);
                        data = yield call(xhr.get, fixed_url+'article/'+id+'/total/', {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic '+ localStorage['auth'],
                            Accept: 'application/json'
                            },
                            responseType: 'json'
                        });
                    }
                    catch(error) {
                        console.log(error);
                        if(error.statusCode === 200) {
                            data = error;
                        }
                        else if(error.statusCode === 403) {
                            alert("자격이 없소. 려권을 보여주시오.");
                            console.log('whyyyyyyyy');
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                        }
                        else if(error.statusCode === 404) {
                            alert("없는 장소");
                            console.log("안심하세요, 이 오류는 Unknown Error가 아닙니다.");
                            if(localStorage.getItem("auth") === null) {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/'));
                            } else {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/main/'));
                            }
                            return;
                        }
                        else if(error.statusCode === 0) {
                            alert("나라에 문제가...");
                            console.log("Temporary Server Error. Try reloading!");
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                            return;
                        }
                        else {
                            console.log("Whyyyyyyyyyyy");
                            alert("1조를 찾아주시오.");
                            return;
                        }
                    }
                    // 스테이트의 parent_article에 들어갈 내용을 받는 try-catch 문
                    try {
                        parent_data = yield call(xhr.get, fixed_url+'article/'+id+'/', {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic '+ localStorage['auth'],
                            Accept: 'application/json'
                            },
                            responseType: 'json'
                        });
                        console.log('Get data without exception');
                    }
                    catch(error) {
                        console.log(error);
                        if(error.statusCode === 200) {
                            console.log('Succeed to get data');
                            parent_data = error;
                        }
                        else if(error.statusCode === 403) {
                            alert("1조를 찾아주시오");
                            console.log('whyyyyyyyy');
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                        }
                        else if(error.statusCode === 404) {
                            alert("없는 장소");
                            console.log("안심하세요, 이 오류는 Unknown Error가 아닙니다.");
                            if(localStorage.getItem("auth") === null) {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/'));
                            } else {
                                localStorage.removeItem('parent');
                                yield put(actions.changeUrl('/main/'));
                            }
                            return;
                        }
                        else if(error.statusCode === 0) {
                            console.log("Backend is not accessible");
                            alert("나라에 문제가 생겼소.");
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                            yield put(actions.changeUrl('/'));
                            return;
                        }
                        else {
                            console.log("Whyyyyyyyyyyy");
                            alert("1조를 찾아주시오");
                            return;
                        }
                    }
                    //TODO 이후 state에 새로운 element를 추가할 경우 이 부분에 try-catch를 추가하면 됩니다
                    yield put(actions.setState({
                        authorization: window.atob(localStorage['auth']),
                        articles: data.body,
                        parent_article: parent_data !== null ? parent_data.body : null,
                        nowchat_rooms: [],
                        nonchat_rooms: [],
                        texts: [],
                        chatting_users: [],
                        room_id: 0,
                        profile_user: profile_data !== null ? profile_data.body : null,
                        loading: true,
                        load: 0,
                        //TODO 이후 state 추가 시 여기에 스테이트 업데이트 추가
                    }));
                }
            }
        }
    }
    console.log(yield select());
    console.log(localStorage['parent']);
}

// watchSignIn: 로그인 버튼 클릭 관찰
function *watchSignIn() {
    while(true) {
        const data = yield take(actions.SIGN_IN);
        yield call(signIn, data);
    }
}

// watchSignUp: 회원가입 버튼 클릭 관찰
function *watchSignUp() {
    while(true) {
        yield take('GOTO_SIGN_UP');
        yield put(actions.changeUrl('/sign_up/'));
    }
}

// watchSignOut: 로그아웃 버튼 클릭 관찰
function *watchSignOut() {
    while(true) {
        yield take('SIGN_OUT');
        localStorage.removeItem('auth');
        localStorage.removeItem('parent');
        yield put(actions.changeUrl('/'));
    }
}

// watchPostSignUp: 회원가입 페이지에서 가입 버튼 클릭 관찰
function *watchPostSignUp() {
    while(true) {

        const data = yield take('POST_SIGN_UP');
        yield call(signUp, data);
    }
}

// watchDetail: 디테일 버튼 클릭 관찰 및 리다이렉트
function *watchDetail() {
    while(true) {
        const data = yield take('ARTICLE_DETAIL');
        yield put(actions.changeUrl('/article/'+data.id +'/'));
    }
}

// watchLike: 좋아요 버튼 클릭 관찰
function *watchLike() {
    while(true) {
        const data = yield take('POST_LIKE');
        yield call(postLike, data.id);
    }

}

// watchGoToMain: 메인으로 돌아가기 버튼 클릭 관찰 및 리다이렉트
function *watchGoToMain() {
    while(true) {
        yield take('POST_BACK');
        yield put(actions.changeUrl('/main/'));
    }

}

// watchPostArticle: 글쓰기 페이지에서 포스트 버튼 클릭 관찰
function *watchPostArticle() {
    while(true) {
        const data = yield take('ADD_ARTICLE');
        yield call(postArticle, data.id, data.text, data.images, data.url);
    }
}

// watchDelete: 메인페이지 또는 세부페이지에서 삭제 버튼 클릭 관찰
function *watchDelete() {
    while(true) {
        const data = yield take('DELETE_ARTICLE');
        yield call(deleteArticle, data.id);
    }
}

// watchPutArticle: 글 수정 페이지에서 EDIT 버튼 클릭 관찰
function *watchPutArticle(){
    while(true){
        console.log("in watchPutArticle...");
        const data = yield take('PUT_ARTICLE');
        console.log("text: "+data.text);
        yield call(putArticle, data.id, data.text, data.removeImg, data.images, data.removeUrl, data.url);
    }
}

// watchCreateRoom: 채팅방 목록 페이지에서 새 채팅방 버튼 클릭 관찰
function *watchCreateRoom(){
    while(true){
        yield take('SHOW_CREATE_ROOM');
        yield put(actions.changeUrl('/create_room/'));
    }
}

// watchJoinRoom: 채팅방 목록 페이지에서 참가하기 버튼 클릭 관찰
function *watchJoinRoom(){
    while(true){
        const data = yield take('JOIN_ROOM');
        yield call(joinRoom, data.id);
    }
}

// watchQuitRoom: 채팅방 목록 페이지에서 참가하기 버튼 클릭 관찰
function *watchQuitRoom(){
    while(true){
        const data = yield take('QUIT_ROOM');
        yield call(quitRoom, data.id);
    }
}

// watchChatting: 채팅방 목록 페이지에서 대화하기 버튼 클릭 관찰
function *watchChatting(){
    while(true){
        const data = yield take('SHOW_CHATTING');
        yield put(actions.changeUrl('/chatting/'+data.id+'/'));
    }
}

// watchChattingRoom: 메인페이지에서의 채팅 버튼 또는 채팅 페이지에서의 방 변경 버튼 클릭 관찰
function *watchChattingRoom(){
    while(true){
        yield take('SHOW_CHATTING_ROOM');
        console.log("take SHOw_CHATTING_ROOM");
        yield put(actions.changeUrl('/room/'));
    }
}

// watchSendText: 채팅 페이지에서 전송 버튼 클릭 관찰
function *watchSendText(){
    while(true){
        const data = yield take('POST_TEXT');
        yield call(postText, data.room_id, data.text);
    }
}

// watchPostRoom: 채팅방 목록 페이지에서 새 채팅방 버튼 클릭 관찰
function *watchPostRoom(){
    while(true){
        const data = yield take('POST_ROOM');
        yield call(postRoom, data.room_name, data.secret, data.invite); // TODO 채팅방 관련 추가구현 시 방 정보(방 공개 여부 등)에 관한 사항을 여기에 추가해야 함.
    }
}

// watchUpdateChatting: 채팅 페이지에서 0.5초마다 자동으로 실행
function *watchUpdateChatting(){
    while(true){
        const data = yield take('UPDATE_CHATTING');
        yield call(updateChatting, data.room_id)
    }
}

function *watchToProfile() {
    while(true) {
        const data=yield take('TO_PROFILE');
        yield put(actions.changeUrl('/profile/' + data.profuser + '/'));
    }
}
function *watchIntroChange(){
    while(true){
        const data = yield take('TO_INTRO_CHANGE');
        console.log("##"+data.user);
        yield call(updateIntro, data.user, data.myname, data.mybelong, data.myintro, data.removeImg, data.changeImg, data.img);
    }
}
function *watchPWChange(){
    while(true){
        const data = yield take('TO_PW_CHANGE');
        console.log("**get PW change action");
        yield call(updatePW, data.profuser, data.newpw);
    }
}
function *watchEscape(){
    while(true){
        const data = yield take('TO_ESCAPE');
        console.log("**get excape action");
        yield call(escapeBook, data.profuser);
    }
}
function *watchGoToFriend(){
    while(true){
        const data = yield take('TO_FRIEND');
        yield put(actions.changeUrl('/friend/'+data.profuser+'/'));
    }
}
function *watchAddFriend(){
    while(true){
        const data = yield take('ADD_FRIEND');
        yield put(actions.changeUrl('/addfriend/'+data.profuser+'/'));
    }
}
function *watchGoToWall(){
    while(true){
        const data=yield take('TO_WALL');
        yield put(actions.changeUrl('/wall/'+data.profuser+'/'));
    }
}

function *watchPostAddFriend() {
    while(true) {
        const data = yield take('POST_ADD_FRIEND');
        yield call(postAddFriend, data.profuser);
    }
}

function *watchDeleteAddFriend() {
    while(true) {
        const data = yield take('DELETE_ADD_FRIEND');
        yield call(deleteAddFriend, data.profuser);
    }
}
function *watchPostSasang() {
    while(true) {
        const data = yield take('POST_SASANG');
        yield call(postSasang, data.profuser);
    }
}
function *watchPutSasang() {
    while(true) {
        const data = yield take('PUT_SASANG');
        yield call(putSasang, data.profuser);
    }
}
///// Page별 saga함수에서 쓸 saga함수 (그 외)
// signIn: 백엔드에 get을 날리는 함수
function *signIn(data) {
    const encodedData = window.btoa(data.username + ":" + data.password);
    try {
        yield call(xhr.get, auth_check_url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ encodedData,
                Accept: 'application/json'
            },
            responseType: 'json'
        })
        console.log("Login Success without exception");
        localStorage.setItem("auth", encodedData);
        yield put(actions.changeUrl('/main/'));
    }
    catch(error) {
        if(error.statusCode === 200) {
            console.log('Login Success');
            localStorage.setItem("auth", encodedData);
            yield put(actions.changeUrl('/main/'));
        }
        else if(error.statusCode === 403) {
            console.log("User not found");
            alert("그런 려권은 없는데?");
            localStorage.removeItem('auth');
            localStorage.removeItem('parent');
            yield put(actions.changeUrl('/'));
        }
        else if(error.statusCode === 0) {
            console.log("Server not available");
            alert("나라에 문제가 생겼소.");
            localStorage.removeItem('auth');
            localStorage.removeItem('parent');
            yield put(actions.changeUrl('/'));
        }
        else {
            console.log(error);
            alert('1조를 찾아주게나.');
        }
    }
}

// signUp: 백엔드 users에 POST를 날리는 함수
function *signUp(data) {
    try {
        yield call(xhr.post, fixed_url + 'users/', {
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType:'json',
            body: JSON.stringify({"username": data.username, "password": data.password})
        });
        console.log("post article succeed 1");
        localStorage.setItem("auth", window.btoa(data.username + ":" + data.password));
        yield put(actions.changeUrl('/main/'));
    }
    catch(error) {
        if(error.statusCode === 201) {
            console.log("post article succeed 2");
            localStorage.setItem("auth", window.btoa(data.username + ":" + data.password));
            yield put(actions.changeUrl('/main/'));

        }
        else if(error.statusCode === 0) {
            alert("나라에 문제가...");
            console.log("Check backend server");
        }
        else if(error.statusCode === 400){
            alert("성명이나 암호가 려권에 맞지 않소.");
            console.log("Put correct username & password");
        }
        else if(error.statusCode === 405) {
           alert("이미 같은 성명이 있소.");
           console.log("duplicate username");
        }
        else if(Object.keys(error).length === 0) {
            console.log("post article succeed 3");
            localStorage.setItem("auth", window.btoa(data.username + ":" + data.password));
            yield put(actions.changeUrl('/main/'));
        }
        else {
            alert("1조를 찾아주시오.");
            console.log(error);
        }
    }

}

// postLike: article_id가 id인 아티클에 Like를 날리는 함수
function *postLike(id) {
    const path = 'article/'+id+'/like/';
    try {
        yield call(xhr.post, fixed_url + path, {
            headers: {
                "Authorization": "Basic " + localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType:'json'
        });
        console.log("post like succeed 1");
        yield put(actions.changeUrl(window.location.pathname));
    }
    catch(error) {
        console.log(error);
        if(error.statusCode === 201) {
            console.log("post like succeed 2");
            yield put(actions.changeUrl(window.location.pathname));
        }
        else if(error.statusCode === 0) {
            alert("나라에 문제가..");
            console.log("Check backend server");
        }
        else if(error.statusCode === 404) {
            alert("윗글이 사라져 길을 잃은 모양이오.");
            console.log("parent article removed");
        }
        else if(error.statusCode === 405) {
            alert("동무는 이 글을 더이상 좋아할 수 없소.");
            console.log("double like");
        }
        else if(Object.keys(error).length === 0) {
            console.log("post like succeed 3");
            yield put(actions.changeUrl(window.location.pathname));

        }
        else {
            alert("1조를 찾아주시오.");
            console.log(error);
        }
    }
}

// postArticle: 새로운 글/댓글을 쓰는 함수
// TODO 임시로 메인페이지로 돌아가게 만들었는데 이거 나중에 로컬스토리지에 어트리뷰트 하나 추가해서 구현하심 될 듯
function *postArticle(id, text, images, url) {
    let form = new FormData();
    form.append('text', text);
    if(url === null || url === '')
        url = 'None';
    form.append('youtube_video', url);
    if(images === null || images === undefined || images.length === 0)
        console.log("No image")
    else
        form.append('image0', images[0]); //TODO 이후에는 여러개 처리 가능하도록
    const path = id === null ? 'mainpage/' : 'article/'+id.id+'/article/';
    //const path = localStorage['parent'] === null || localStorage['parent'] === undefined ? 'mainpage/' : 'article/'+localStorage['parent']+'/article/';
    try {
        yield call(xhr.post, fixed_url + path, {
            headers: {
                "Authorization": "Basic " + localStorage['auth'],
            },
            async: true,
            crossDomain: true,
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            body: form
        });
        console.log("post article succeed 1");
        //yield put(actions.changeUrl(path === 'mainpage/' ? '/main/' : '/article/'+localStorage['parent']+'/'));
        yield put(actions.changeUrl(window.location.pathname));
    }
    catch(error) {
        if(error.statusCode === 201) {
            console.log("post article succeed 2");
            //yield put(actions.changeUrl(path === 'mainpage/' ? '/main/' : '/article/'+localStorage['parent']+'/'));
            yield put(actions.changeUrl(window.location.pathname));
        }
        else if(error.statusCode === 0) {
            alert("나라에 사정이 생겼소");
            console.log("Check backend server");
        }
        else if(error.statusCode === 404) {
           alert("윗글이 사라져 길을 잃은 모양이오.");
            console.log("parent article removed");
        }
        else if(Object.keys(error).length === 0) {
            console.log("post article succeed 3");
            //yield put(actions.changeUrl(path === 'mainpage/' ? '/main/' : '/article/'+localStorage['parent']+'/'));
            yield put(actions.changeUrl(window.location.pathname));
        }
        else {
            alert("1조를 찾아주시오");
            console.log(error);
        }
    }
}

// deleteArticle: 자신이 쓴 글을 지우는 함수
function *deleteArticle(id){
    let changeurl = window.location.pathname;
    if(id.toString() === localStorage['parent']) {
        changeurl = '/main/';
    }
    const path = 'article/'+id+'/';
    try{
        yield call(xhr.send, fixed_url+path,{
            method: 'DELETE',
            headers:{
                'Authorization': 'Basic '+localStorage['auth'],
                Accept: 'application/json'
            },
            responseType:'json'
        });
    console.log("delete article succeed!!!");
    yield put(actions.changeUrl(changeurl));
    } catch(error){
        console.log(error);
        if(error.statusCode === 204){
            console.log("delete article succeedd!!");
            yield put(actions.changeUrl(changeurl));
        }
        else if(error.statusCode === 403){
            alert("당신의 글이 아니오.");
        }
        else yield put(actions.changeUrl(changeurl));
    }
}

// putArticle: 자신이 쓴 글을 수정하는 함수
// TODO 업로드된 사진 수정 가능하게 만들기
function *putArticle(id, text, removeImg, images, removeUrl, url){
    const path = 'article/'+id+'/';
    console.log("in editArticle[path]: "+path);
    let form = new FormData();
    form.append('text', text);
    if(removeImg === true) {
        if (images === null || images === undefined || images.length === 0)
            form.append('image0', null);
        else
            form.append('image0', images[0]);
    }
    else
        if (images !== null && images !== undefined && images.length !== 0)
            form.append('image0', images[0]);

    if(removeUrl === true) {
        if(url === null || url === '' || url === 'null') {
            form.append('youtube_video', 'None');
        }
        else
            form.append('youtube_video', url);
    }
    else
        if(url !== null && url !== '')
            form.append('youtube_video', url);
    //TODO 이후에는 여러개 처리 가능하도록
    try {
        yield call(xhr.send, fixed_url + path, {
            method: 'PUT',
            headers: {
                "Authorization": "Basic " + localStorage['auth'],
            },
            async: true,
            crossDomain: true,
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            body: form
        });
        console.log("edit article succeed");
        yield put(actions.changeUrl(window.location.pathname));
    } catch(error){
        console.log(error);
        if(error.statusCode === 403){
            alert("당신의 글이 아니오.");
        }
    }
}

// joinRoom: 선택한 채팅방(아직 참가하지 않은 채팅방)을 참가한 채팅방으로 만드는 함수
function *joinRoom(id) {
    const path = 'chatroom/'+id+'/user/';
    try{
        yield call(xhr.post, fixed_url+path, {
            headers: {
                "Authorization": "Basic "+localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType: 'json',
            body: JSON.stringify({})
        });
        console.log("join room succeed.");
        yield put(actions.changeUrl(window.location.pathname));
    }catch(error){
        if(error.statusCode === 201){
            console.log("join room succeed 2.");
            yield put(actions.changeUrl(window.location.pathname));
        }
        else if(error.statusCode === 0) {
            alert("나라에 사정이...");
            console.log("Check backend server");
        }
        else if(error.statusCode === 403) {
            alert("려권!");
            console.log("permission denied");
            yield put(actions.changeUrl('/'));
        }
        else if(error.statusCode === 404) {
            alert("방이 존재하지 않소.");
            console.log("the room has removed");
        }
        else if(error.statusCode === 405) {
            alert("당신은 이미 참여하였소.");
            console.log("you can join in this room once");
        }
        else if(Object.keys(error).length === 0) {
            console.log("join room succeed 3.");
            yield put(actions.changeUrl(window.location.pathname));
        }
        else {
            alert("1조를 찾아주시오.");
            console.log(error);
        }
    }
}

// quitRoom: 선택한 채팅방(참가한 채팅방)에서 나가는 함수
function *quitRoom(id) {
    const path = 'chatroom/'+id+'/user/';
    try{
        yield call(xhr.send, fixed_url+path,{
            method: 'DELETE',
            headers:{
                'Authorization': 'Basic '+localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType:'json'
        });
        console.log("quit room succeed.");
        yield put(actions.changeUrl(window.location.pathname));
    }catch(error){
        if(error.statusCode === 200 || error.statusCode === 204){
            console.log("quit room succeed 2.");
            yield put(actions.changeUrl(window.location.pathname));
        }
        else if(error.statusCode === 0) {
            alert("나라에 사정이...");
            console.log("Check backend server");
        }
        else if(error.statusCode === 403) {
            alert("려권!");
            console.log("permission denied");
            yield put(actions.changeUrl('/'));
        }
        else if(error.statusCode === 404) {
            alert("방이 존재하지 않소.");
            console.log("the room has removed");
        }
        else if(error.statusCode === 405) {
            alert("당신은 이 방에 참여하지 않았소.");
            console.log("you cannot quit this room");
        }
        else if(Object.keys(error).length === 0) {
            console.log("quit room succeed 3.");
            yield put(actions.changeUrl(window.location.pathname));
        }
        else {
            alert("1조를 찾아주시오.");
            console.log(error);
        }
    }
}

// postText: 그 채팅방에 새 메시지를 전송하는 함수
function *postText(room_id, text) {
    const path = 'chatroom/'+room_id+'/text/';
    try{
        yield call(xhr.post, fixed_url+path, {
            headers: {
                "Authorization": "Basic "+localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType: 'json',
            body: JSON.stringify({"text": text})
        });
        console.log("post text succeed.");
        //yield put(window.location.pathname);
        yield put(actions.updateChatting(room_id))
    }catch(error){
        if(error.statusCode === 201){
            console.log("post text succeed 2.");
            //yield put(actions.changeUrl(window.location.pathname));
            yield put(actions.updateChatting(room_id))
        }
        else if(error.statusCode === 0) {
            alert("나라에 문제가..");
            console.log("Check backend server");
        }
        else if(error.statusCode === 400) {
            alert("제대로 된 입력을 주시오.");
            console.log("bad request");
        }
        else if(error.statusCode === 403) {
            alert("려권!");
            console.log("permission denied");
            yield put(actions.changeUrl('/'));
        }
        else if(error.statusCode === 404) {
            alert("방이 없소.");
            console.log("the room has removed");
        }
        else if(error.statusCode === 405) {
            alert("참여하고 얘기하시오.");
            console.log("The user isn't a chatting member");
            yield put(actions.changeUrl('/room/'));
        }
        else if(Object.keys(error).length === 0) {
            console.log("post text succeed 3.");
            yield put(actions.updateChatting(room_id))
            //yield put(actions.changeUrl(window.location.pathname));
        }
        else {
            alert("1조를 찾아주시오!");
            console.log(error);
        }
    }
}

// postRoom: 새 채팅방을 생성하는 함수 // TODO 채팅방 관련 추가구현 시 수정바람.
function *postRoom(room_name, secret, invite) {
    const path = 'chatroom/';
    try{
        yield call(xhr.post, fixed_url+path, {
            headers: {
                "Authorization": "Basic "+localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType: 'json',
            body: JSON.stringify({"room_name": room_name, "secret": secret, "invite": invite})
        });
        console.log("post room succeed.");
    }catch(error){
        if(error.statusCode === 201){
            console.log("post room succeed 2.");
        }
        else if(error.statusCode === 0) {
            alert("나라에 문제가...");
            console.log("Check backend server");
            return;
        }
        else if(error.statusCode === 400) {
            alert("제대로 입력하시오.");
            console.log("Bad request");
            return;
        }
        else if(error.statusCode === 403) {
            alert("려권 먼저!");
            console.log("permission denied");
            yield put(actions.changeUrl('/'));
            return;
        }
        else if(Object.keys(error).length === 0) {
            console.log("post room succeed 3.");
        }
        else {
            alert("1조를 찾아주시오.");
            console.log(error);
            return;
        }
    }
    yield put(actions.changeUrl('/room/'));
}

// updateChatting: 채팅 유저 목록과 메시지들을 새로고침 없이 불러오는 함수
function *updateChatting(room_id) {
    const userPath = 'chatroom/'+room_id+'/user/';
    const textPath = 'chatroom/'+room_id+'/text/';
    let userRes, textRes;
    try{
        userRes = yield call(xhr.get, fixed_url+userPath, {
            headers: {
                "Authorization": "Basic "+localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            responseType: 'json'
        });
    }catch(error){
        console.log(error);
        if(error.statusCode === 200) {
            console.log('Succeed to get data');
            userRes = error;
        }
        else if(error.statusCode === 403) {
            alert("려권을 보여주고 대화를 하시오.");
            console.log('permission denied');
            localStorage.removeItem('auth');
            localStorage.removeItem('parent');
            yield put(actions.changeUrl('/'));
        }
        else if(error.statusCode === 404) {
            console.log("404 Not Found");
            alert("없는 장소");
            if(localStorage.getItem("auth") === null) {
                localStorage.removeItem('parent');
                yield put(actions.changeUrl('/'));
            } else {
                localStorage.removeItem('parent');
                yield put(actions.changeUrl('/main/'));
            }
            console.log("안심하세요! 이 에러는 Unknown Error가 아닙니다.");
            return;
        }
        else if(error.statusCode === 0) {
            console.log("Backend is not available");
            //alert("Temporary Server Error");
            localStorage.removeItem('auth');
            localStorage.removeItem('parent');
            yield put(actions.changeUrl('/'));
            return;
        }
        else {
            console.log("Unknown error");
            alert("1조를 찾아주시오");
            return;
        }
    }
    try{
        textRes = yield call(xhr.get, fixed_url+textPath, {
            headers: {
                "Authorization": "Basic "+localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            responseType: 'json'
        });
    }catch(error){
        console.log(error);
        if(error.statusCode === 200) {
            console.log('Succeed to get data');
            textRes = error;
        }
        else if(error.statusCode === 403) {
            alert("대화방에 들어가려면 려권!");
            console.log('permission denied');
            localStorage.removeItem('auth');
            localStorage.removeItem('parent');
            yield put(actions.changeUrl('/'));
        }
        else if(error.statusCode === 404) {
            console.log("404 Not Found");
            alert("없는 장소");
            if(localStorage.getItem("auth") === null) {
                localStorage.removeItem('parent');
                yield put(actions.changeUrl('/'));
            } else {
                localStorage.removeItem('parent');
                yield put(actions.changeUrl('/main/'));
            }
            console.log("안심하세요! 이 에러는 Unknown Error가 아닙니다.");
            return;
        }
        else if(error.statusCode === 0) {
            console.log("Backend is not available");
            //alert("Temporary Server Error");
            localStorage.removeItem('auth');
            localStorage.removeItem('parent');
            yield put(actions.changeUrl('/'));
            return;
        }
        else {
            console.log("Unknown error");
            alert("1조에게 편지를!");
            return;
        }
    }
    let getArticles = yield select((state) => state.articles);
    let getParentArticle = yield select((state) => state.parent_article);
    let getNowChatRooms = yield select((state) => state.nowchat_rooms);
    let getNonChatRooms = yield select((state) => state.nonchat_rooms);
    let getLoad = yield select((state) => state.load);
    yield put(actions.setState({
        authorization: window.atob(localStorage['auth']),
        articles: getArticles,
        parent_article: getParentArticle,
        nowchat_rooms: getNowChatRooms,
        nonchat_rooms: getNonChatRooms,
        texts: textRes.body,
        chatting_users: userRes.body,
        room_id: room_id,
        loading: true,
        load: getLoad,
        // TODO 이후 state에 항목 추가 시 여기에도 추가바람.
    }));
    const path = window.location.pathname;
    const url = path.split("/");
    if(url[1] === 'chatting' && url[2] !== undefined) {
        room_id = url[2];
        yield spawn(createUpdateChatting, room_id);
    }
}

// createUpdateChatting: 매 0.5초마다 채팅 메시지들을 불러오게 하는 함수
function *createUpdateChatting(room_id){
    yield delay(500);
    yield put(actions.updateChatting(room_id))
}

// 비밀번호 바꾼 걸 put 요청 보내는 함수
function *updatePW(profuser, newpw){
    const backPath = 'users/'+profuser+'/';
    try{
        yield call(xhr.send, fixed_url+backPath, {
            method: 'PUT',
            headers: {
                "Authorization": "Basic "+localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json',
            },
            responseType:'json',
            body: JSON.stringify({"username": profuser, "password": newpw})
        });
        console.log("put password succeed ");
        //auto sign out
        localStorage.removeItem('auth');
        yield put(actions.changeUrl('/main/'));
    }catch(error){
        if(error.statusCode === 405){
            console.log("You're not this user");
        }else if(error.statusCode === 400){
            console.log("Bad password");
            return;
        }else if(error.statusCode === 0){
            console.log("Backend is not accessible");
            alert("잠시 나라에 문제가..");
            return;
        }else{
            console.log("Unknown Error occured :"+error.statusCode);
            alert("1조에게 편지~");
            return;
        }
    }
}
// profile을 수정한걸 post요청보내는 함수
function *updateIntro(profuser, myname, mybelong, myintro, removeImg, changeImg, img){
    const backPath = 'users/'+profuser+'/profile/';
    try {
        let form = new FormData();
        form.append('user', profuser);
        form.append('myname', myname);
        form.append('mybelong', mybelong);
        form.append('myintro', myintro);
        if(removeImg === true && changeImg === true && img !== null)
            form.append('myimage', img);
        else if(removeImg === true)
            form.append('myimage', null);
        yield call(xhr.send, fixed_url + backPath, {
            method: 'PUT',
            headers: {
                "Authorization": "Basic " + localStorage['auth'],
            },
            async: true,
            crossDomain: true,
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            body: form
        });
        console.log("put profile succeed");

        yield put(actions.changeUrl('/profile/'+profuser+'/'))
    } catch(error){
        console.log(error);
        if(error.statusCode === 400){
            console.log("Wrong json input format");
        }else if(error.statusCode === 403 ){
            console.log("You cannot change other's profile");
        }else{
            console.log("Unknown error occurs");
            return ;
        }
    }
}
function *escapeBook(profuser){
    const backPath = 'users/'+profuser+'/';
    try{
        yield call(xhr.send, fixed_url+backPath,{
            method : 'DELETE',
            headers:{
                'Authorization': 'Basic '+localStorage['auth'],
                Accept: 'application/json'
            },
            responseType: 'json',
        });
        console.log("delete account succeed!");
        localStorage.removeItem('auth');
        yield put(actions.changeUrl('/main/'));
    }catch(error){
         console.log("error: "+error.statusCode);
         if(error.statusCode === 204){
             console.log("delete account succeed!");
             localStorage.removeItem('parent');
             yield put(actions.changeUrl('/main/'));
        }else if(error.statusCode === 403){
             alert("당신의 려권이 아니오");
        }else if(error.statusCode === 0){
            alert("나라에 문제가...");
        }else{
             console.log("delete account succeed!");
             localStorage.removeItem('parent');
             yield put(actions.changeUrl('/main/'));
           return ;
        }
    }
}


// postAddFriend: profuser에게 자신 명의로 동무 추가 요청을 날리는 함수
function *postAddFriend(profuser) {
    const path = 'users/'+profuser+'/addfriend/';
    try {
        yield call(xhr.post, fixed_url + path, {
            headers: {
                "Authorization": "Basic " + localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType:'json'
        });
        console.log("post addfriend succeed 1");
        yield put(actions.changeUrl(window.location.pathname));
    }
    catch(error) {
        console.log(error);
        if(error.statusCode === 201) {
            console.log("post addfriend succeed 2");
            yield put(actions.changeUrl(window.location.pathname));
        }
        else if(error.statusCode === 0) {
            alert("나라에 문제가 있소.");
            console.log("Check backend server");
        }
        else if(error.statusCode === 404) {
            alert("이런 려권은 없소.");
            console.log("User removed");
        }
        else if(error.statusCode === 405) {
            alert("이미 동무 요청을 보냈소.");
            console.log("Double request or You cannot add yourself");
        }
        else if(Object.keys(error).length === 0) {
            console.log("post addfriend succeed 3");
            yield put(actions.changeUrl(window.location.pathname));

        }
        else {
          alert("1조를 찾아줘");
            console.log(error);
        }
    }
}

// deleteAddFriend: 자신이 보냈거나 자신에게 온 동무 추가 요청을 지우는 함수
function *deleteAddFriend(profuser) {
    let getUsername = yield select((state) => state.authorization);
    let username = getUsername !== null ? Object.assign(getUsername).split(":")[0] : null;
    const path = 'users/'+profuser+'/addfriend/'+username+'/';
    try{
        yield call(xhr.send, fixed_url+path,{
            method: 'DELETE',
            headers:{
                'Authorization': 'Basic '+localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType:'json'
        });
    console.log("delete addfriend succeed!!!");
    yield put(actions.changeUrl(window.location.pathname));
    } catch(error){
        console.log(error);
        if(error.statusCode === 204){
            console.log("delete addfriend succeedd!!");
            yield put(actions.changeUrl(window.location.pathname));
        }
        else if(error.statusCode === 403){
          alert("반동이다!");
        }
        else if(error.statusCode === 404) {
            const path2 = 'users/'+username+'/addfriend/'+profuser+'/';
            try{
                yield call(xhr.send, fixed_url+path2,{
                    method: 'DELETE',
                    headers:{
                        'Authorization': 'Basic '+localStorage['auth'],
                        "Content-Type": 'application/json',
                        Accept: 'application/json'
                    },
                    contentType:'json'
                });
            console.log("delete addfriend succeed!!!");
            yield put(actions.changeUrl(window.location.pathname));
            }catch(error){
                console.log(error);
                if(error.statusCode === 204){
                    console.log("delete addfriend succeedd!!");
                    yield put(actions.changeUrl(window.location.pathname));
                }
                else {
                    yield put(actions.changeUrl(window.location.pathname));
                }
            }
        }
        else {
            yield put(actions.changeUrl(window.location.pathname));
        }
    }
}
function *postSasang(profuser) {
    const path = 'users/'+profuser+'/sasang/';
    try{
        yield call(xhr.post, fixed_url+path,{
            headers:{
                'Authorization': 'Basic '+localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType:'json'
        });
      yield put(actions.changeUrl(window.location.pathname));
    }
    catch(error) {
        console.log(error);
        if(error.statusCode === 201) {
            console.log("post Sasang success!");
            yield put(actions.changeUrl(window.location.pathname));
        }
        else if(error.statusCode === 0) {
            alert("나라에 문제가 있소.");
        }
        else if(error.statusCode === 404) {
            alert("이런 려권은 없소.");
        }
        else if(error.statusCode === 405) {
            alert("사상검증 중이오");
        }
        else {
          alert("1조를 찾아줘");
        }
    }
}

function *putSasang(profuser) {
    const path = 'users/'+profuser+'/sasang/';
    try{
        yield call(xhr.send, fixed_url+path,{
            method: 'PUT',
            headers:{
                'Authorization': 'Basic '+localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType:'json'
        });
      console.log("sasang succeed!!!");
      yield put(actions.changeUrl(window.location.pathname));
    }
    catch(error){
      console.log(error);
      if(error.statusCode === 201) {
          console.log("post Sasang success!");
          yield put(actions.changeUrl(window.location.pathname));
      }
      else if(error.statusCode === 0) {
          alert("나라에 문제가 있소.");
      }
      else if(error.statusCode === 404) {
          alert("이런 려권은 없소.");
      }
      else if(error.statusCode === 405) {
          alert("사상검증 중이오");
      }
      else {
        alert("1조를 찾아줘");
      }
    }
}
