import { put, take, call, /*fork, */select, spawn } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as actions from './../../actions'

var xhr = require('xhr-promise-redux');

//TODO 개인적으로 테스트할 때는 포트번호를 바꾸자. 풀리퀘를 날릴 때는 URL을 확인할 것
const fixed_url = /*"http://localhost:8000/";*/"http://wlxyzlw.iptime.org:8000/"; //포오오오트으으으버어어어언호오오오 확이이이인
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
                case 'write':
                    yield spawn(writePageSaga);
                    break;
                case 'edit':
                    yield spawn(editPageSaga, url[2]);
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
                default:
                    console.log("default state");
                    alert("Oops, page not found");             
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
    yield spawn(watchWrite);
    yield spawn(watchDetail);
    yield spawn(watchLike);
    yield spawn(watchSignOut);
    yield spawn(watchGoToMain);
    yield spawn(watchEdit);
    yield spawn(watchDelete);
    yield spawn(watchChattingRoom)
    //TODO 시간 남으면 더 보기 기능 부탁해요
}

function *articleDetailPageSaga() {
    console.log("Article Detail Page");
    yield spawn(watchLoginState);
    yield spawn(watchWrite);
    yield spawn(watchDetail);
    yield spawn(watchLike);
    yield spawn(watchGoToMain);
    yield spawn(watchSignOut);
    yield spawn(watchEdit);
    yield spawn(watchDelete);
}

function *writePageSaga() {
    console.log("Write Page")
    yield spawn(watchLoginState);
    yield spawn(watchSignOut);
    yield spawn(watchPostArticle);
    yield spawn(watchGoToMain);
}

function *editPageSaga(id){
    console.log("Edit Page: "+id);
    yield spawn(watchLoginState);
    yield spawn(watchSignOut);
    yield spawn(watchPutArticle, id);
    yield spawn(watchGoToMain);
}

function *roomPageSaga(){
    console.log("Chatting Room Page")
    yield spawn(watchLoginState);
    yield spawn(watchSignOut);
    yield spawn(watchGoToMain);
    yield spawn(watchCreateRoom);
    yield spawn(watchJoinRoom);
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
//  yield spawn(watchLoadMoreText); // 더 보기 기능
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
    yield spawn(watchWrite);
    yield spawn(watchDetail);
    yield spawn(watchLike);
    yield spawn(watchSignOut);
    yield spawn(watchGoToMain);
    yield spawn(watchEdit);
    yield spawn(watchDelete);
    yield spawn(watchToProfile);
}

//TODO 프로필 페이지 만들어주세요 와와
function *profilePageSaga() {
    console.log("[ProfilePageSaga]");
    yield spawn(watchLoginState);
    yield spawn(watchSignOut);
    yield spawn(watchGoToMain);
    yield spawn(watchDescChange);
    yield spawn(watchPWChange);
}

///// Page별 saga함수에서 쓸 saga함수들 (watch 함수 편)
// watchLoginState: 브라우저에서의 로그인 여부 확인 및 state 업데이트
// <<주의>> 새로운 Page를 추가할 경우 PageSaga함수에 반드시 추가할 것
// <<주의>> 새로운 state를 추가할 경우 try-catch문을 이용해 정보를 받아온 후 스테이트에 업데이트 해야 함
function *watchLoginState() {
    console.log("Prev Auth: "+localStorage.getItem("auth"));
    console.log("Prev Parent: "+localStorage.getItem("parent"))
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
	        console.log(path);
            let data, parent_data;
            if(path === '/main/' || path === '/write/') { // 여기가 바로 하드코딩된 부분입니다 여러분!
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
                        alert("Unauthorized user tried to access mainpage. Please sign in first!");
                        console.log('whyyyyyyyy');
                        localStorage.removeItem('auth');
                        localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/'));
                    }
                    else if(error.statusCode === 0) {
                        console.log("Backend is not accessible");
                        alert("Temporary Server Error");
                        return;
                    }
                    else {
                        console.log("Whyyyyyyyyyyy");
                        alert("Unknown Error Occurred");
                        return;
                    }
                }
                //alert(JSON.stringify(data.body));
                yield put(actions.setState({
                    authorization: window.atob(localStorage['auth']),
                    articles: data.body,
                    parent_article: null,
                    rooms: [],
                    texts: [],
                    chatting_users: [],
                    room_id: 0
                    //TODO 이후 state 추가 시 여기에 스테이트 업데이트 추가
                }));
            }
            else if (path === '/room/' || path === '/create_room/') { // 여기도 하드코딩된 부분이지
                localStorage.removeItem('parent');
                try {
                    data = yield call(xhr.get, fixed_url+'chatroom/', {
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
                        alert("Unauthorized user tried to access chatting room page. Please sign in first!");
                        console.log('permission denied');
                        localStorage.removeItem('auth');
                        localStorage.removeItem('parent');
                        yield put(actions.changeUrl('/'));
                    }
                    else if(error.statusCode === 0) {
                        console.log("Backend is not available");
                        alert("Temporary Server Error");
                        return;
                    }
                    else {
                        console.log("Unknown error");
                        alert("Unknown error occurred");
                        return;
                    }
                }
                yield put(actions.setState({
                    authorization: window.atob(localStorage['auth']),
                    articles: [],
                    parent_article: null,
                    rooms: data.body,
                    texts: [],
                    chatting_users: [],
                    room_id: 0,
                    profile_user: null
                    // TODO 이후 state에 항목 추가 시 여기에도 추가바람.
                }));
            }
            else { // username또는 id를 기준으로 backend에 겟을 날리는 경우
                const username = path.split("/")[2];
                const id = path.split("/")[2];//그냥..
                let profile_data = null;
                if (username === undefined) {
                    console.log("404 not found");
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
                            alert("Unauthorized user tried to access wall. Please sign in first!");
                            console.log('whyyyyyyyy');
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                        }
                        else if(error.statusCode === 404) {
                            alert("404 Not Found");
                            console.log("안심하세요, 이 오류는 Unknown Error가 아닙니다.");
                            return;
                        }
                        else if(error.statusCode === 0) {
                            console.log("Backend is not accessible");
                            alert("Temporary Server Error. Try reloading!");
                            return;
                        }
                        else {
                            console.log("Whyyyyyyyyyyy");
                            alert("Unknown Error Occurred");
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
                            alert("Unauthorized user tried to access wall. Please sign in first!");
                            console.log('whyyyyyyyy');
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                        }
                        else if(error.statusCode === 404) {
                            alert("404 Not Found");
                            console.log("안심하세요, 이 오류는 Unknown Error가 아닙니다.");
                            return;
                        }
                        else if(error.statusCode === 0) {
                            console.log("Backend is not accessible");
                            alert("Temporary Server Error. Try reloading!");
                            return;
                        }
                        else {
                            console.log("Whyyyyyyyyyyy");
                            alert("Unknown Error Occurred");
                            return;
                        }
                    }
                    console.log(profile_data);
                    yield put(actions.setState({
                        authorization: window.atob(localStorage['auth']),
                        articles: data.body,
                        parent_article: null,
                        rooms: [],
                        texts: [],
                        chatting_users: [],
                        room_id: 0,
                        profile_user: profile_data.body,
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
                         console.log('Get data without exception');
                    }catch(error){
                        console.log(error);
                        //TODO error case 
                        if(error.statusCode === 403){
                            alert("Unauthorized user tried to access profile page. Please sign in first");
                        }else if(error.statusCode ===404){
                            alert("404 Not Found");
                            console.log("뉴스프링이 안심하래");
                            return ;
                        }else if(error.statusCode === 0){
                            console.log("Backend server is not accessible");
                            alert("Temporary Server error. Try reloading");
                            return;
                        }else{
                            alert("Unknown Error Occured");
                            return;
                        }
                    }
                    yield put(actions.setState({
                        authorization: window.atob(localStorage['auth']),
                        parent_article: null,
                        articles: [],
                        rooms: [],
                        texts: [],
                        chatting_users: [],
                        room_id: 0,
                        profile_user: profile_data.body,
                                        }));
                } 
 
                else {
                    // 스테이트의 articles에 들어갈 내용을 받는 try-catch 문
                    try {
                        localStorage.setItem('parent', id);
                        data = yield call(xhr.get, fixed_url+'article/'+id+'/article/', {
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
                            alert("Unauthorized user tried to access article detail page. Please sign in first!");
                            console.log('whyyyyyyyy');
                            localStorage.removeItem('auth');
                            localStorage.removeItem('parent');
                        }
                        else if(error.statusCode === 404) {
                            alert("404 Not Found");
                            console.log("안심하세요, 이 오류는 Unknown Error가 아닙니다.");
                            return;
                        }
                        else if(error.statusCode === 0) {
                            console.log("Backend is not accessible");
                            alert("Temporary Server Error. Try reloading!");
                            return;
                        }
                        else {
                            console.log("Whyyyyyyyyyyy");
                            alert("Unknown Error Occurred");
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
                            alert("Unauthorized user tried to access article detail page. Please sign in first!");
                            console.log('whyyyyyyyy');
                        }
                        else if(error.statusCode === 404) {
                            alert("404 Not Found");
                            console.log("안심하세요, 이 오류는 Unknown Error가 아닙니다.");
                            return;
                        }
                        else if(error.statusCode === 0) {
                            console.log("Backend is not accessible");
                            alert("Temporary Server Error. Try reloading");
                            return;
                        }
                        else {
                            console.log("Whyyyyyyyyyyy");
                            alert("Unknown Error Occurred");
                            return;
                        }
                    }
                    //TODO 이후 state에 새로운 element를 추가할 경우 이 부분에 try-catch를 추가하면 됩니다
                    yield put(actions.setState({
                        authorization: window.atob(localStorage['auth']),
                        articles: data.body,
                        parent_article: parent_data !== null ? parent_data.body : null,
                        rooms: [],
                        texts: [],
                        chatting_users: [],
                        room_id: 0,
                        profile_user: profile_data !== null ? profile_data.body : null
                        //TODO 이후 state 추가 시 여기에 스테이트 업데이트 추가
                    }));
                }
            }
        }
    }
    //console.log('Curr Auth: '+localStorage['auth']);
    //console.log('Curr Parent: '+localStorage['parent']);
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

// watchWrite: 글쓰기/답글쓰기 버튼 클릭 관찰 및 리다이렉트
function *watchWrite() {
    while(true) {
        const data = yield take('WRITE_ARTICLE');
        if(data.id === null)
            yield put(actions.changeUrl('/write/'));
        else
            yield put(actions.changeUrl('/write/'+data.id.id+'/'));
    }

}

// watchDetail: 디테일 버튼 클릭 관찰 및 리다이렉트
function *watchDetail() {
    while(true) {
        const data = yield take('ARTICLE_DETAIL');
        yield put(actions.changeUrl('/article/'+data.id.id+'/'));
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
        yield call(postArticle, data.text);
    }
}

// watchDelete: 메인페이지 또는 세부페이지에서 삭제 버튼 클릭 관찰
function *watchDelete() {
    while(true) {
        const data = yield take('DELETE_ARTICLE');
        yield call(deleteArticle, data.id);
    }
}

// watchEdit: 메인페이지 또는 세부페이지에서 수정 버튼 클릭 관찰 
function *watchEdit(){
    while(true){
        console.log("in edit article");
        const data = yield take('EDIT_ARTICLE');
        //TODO user data GET해서 forbidden or not
        yield put(actions.changeUrl('/edit/'+data.id+'/'));     
    } 
}

// watchPutArticle: 글 수정 페이지에서 EDIT 버튼 클릭 관찰
function *watchPutArticle(id){
    while(true){
        console.log("in watchPutArticle...");
        const data = yield take('PUT_ARTICLE');
        console.log("text: "+data.text);
        yield call(putArticle, id, data.text);
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
        yield call(postRoom, data.room_name); // TODO 채팅방 관련 추가구현 시 방 정보(방 공개 여부 등)에 관한 사항을 여기에 추가해야 함.
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
        yield take('TO_PROFILE');
        const id = window.location.pathname.split('/')[2];
        yield put(actions.changeUrl('/profile/' + id + '/'));
    }
}
function *watchDescChange(){
    while(true){
        yield take('TO_DESC_CHANGE');
        console.log("get desc change action");
        const username = window.location.pathname.split('/')[2];
        yield put(actions.changeUrl('/profile/' + username + '/desc/'));

    }
}
function *watchPWChange(){
    while(true){
        yield take('TO_PW_CHANGE');
        const username = window.location.pathname.split('/')[2];
        yield put(actions.changeUrl('/profile/'+username+'/pwd/'));
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
        alert("Succeed to sign in! :)");
        localStorage.setItem("auth", encodedData);
        yield put(actions.changeUrl('/main/'));
    }
    catch(error) {
        if(error.statusCode === 200) {
            console.log('Login Success');
            alert("Succeed to sign in! :)");
            localStorage.setItem("auth", encodedData);
            yield put(actions.changeUrl('/main/'));
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
            alert("Backend server not available");
            console.log("Check backend server");
        }
        else if(error.statusCode === 404) {
            alert("Parent Article Does Not Exist");
            console.log("parent article removed");
        }
        else if(error.statusCode === 405) {
           alert("This username already exists");
           console.log("duplicate username");
        }
        else if(Object.keys(error).length === 0) {
            console.log("post article succeed 3");
            localStorage.setItem("auth", window.btoa(data.username + ":" + data.password));
            yield put(actions.changeUrl('/main/'));
        }
        else {
            alert("Unknown Error Occurred");
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
        console.log("post article succeed 1");
        yield put(actions.changeUrl(window.location.pathname));
    }
    catch(error) {
        console.log(error);
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
        else if(error.statusCode === 405) {
            alert("You cannot like this post!");
            console.log("double like");
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

// postArticle: 새로운 글/댓글을 쓰는 함수
function *postArticle(text) {
    const path = localStorage['parent'] === null || localStorage['parent'] === undefined ? 'mainpage/' : 'article/'+localStorage['parent']+'/article/';
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
        yield put(actions.changeUrl(path === 'mainpage/' ? '/main/' : '/article/'+localStorage['parent']+'/'));
    }
    catch(error) {
        if(error.statusCode === 201) {
            console.log("post article succeed 2");
            yield put(actions.changeUrl(path === 'mainpage/' ? '/main/' : '/article/'+localStorage['parent']+'/'));
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
            yield put(actions.changeUrl(path === 'mainpage/' ? '/main/' : '/article/'+localStorage['parent']+'/'));
        }
        else {
            alert("Unknown Error Occurred");
            console.log(error);
        }
    }
}

// deleteArticle: 자신이 쓴 글을 지우는 함수
function *deleteArticle(id){
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
    yield put(actions.changeUrl('/main/'));
    //TODO parent article여부 확인해서 main 또는 detailpage로
    }catch(error){
        console.log(error);
        if(error.statusCode === 204){
            console.log("delete article succeedd!!");
            yield put(actions.changeUrl('/main/'));
        }
        else if(error.statusCode === 403){
            alert("This is not your article");
        }  
        else yield put(actions.changeUrl('/main/'));
    }
}

// putArticle: 자신이 쓴 글을 수정하는 함수
function *putArticle(id, text){
    const path = 'article/'+id+'/';
    console.log("in editArticle[path]: "+path);
    try {
        yield call(xhr.send, fixed_url+path, {
            method: 'PUT',
            headers: { 
                "Authorization": "Basic "+localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType:'json',
            body: JSON.stringify({"text": text}),
            responseType:'json'
        });
        console.log("edit article succeeeeed!!!!!!!!!");
        yield put(actions.changeUrl('/'+path));
    } catch(error){
        console.log(error);
        if(error.statusCode === 403){
            alert("This article is not yours");
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
        yield put(window.location.pathname);
    }catch(error){
        if(error.statusCode === 201){
            console.log("join room succeed 2.");
            yield put(actions.changeUrl(window.location.pathname));
        }
        else if(error.statusCode === 0) {
            alert("Backend server not available");
            console.log("Check backend server");
        }
        else if(error.statusCode === 403) {
            alert("Please sign in first");
            console.log("permission denied");
            yield put(actions.changeUrl('/'));
        }
        else if(error.statusCode === 404) {
            alert("This room does not exist");
            console.log("the room has removed");
        }
        else if(error.statusCode === 405) {
            alert("You already join in this room");
            console.log("you can join in this room once");
        }
        else if(Object.keys(error).length === 0) {
            console.log("join room succeed 3.");
            yield put(actions.changeUrl(window.location.pathname));
        }
        else {
            alert("Unknown Error Occurred");
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
            alert("Backend server not available");
            console.log("Check backend server");
        }
        else if(error.statusCode === 400) {
            alert("Please input message correctly");
            console.log("bad request");
        }
        else if(error.statusCode === 403) {
            alert("Please sign in first");
            console.log("permission denied");
            yield put(actions.changeUrl('/'));
        }
        else if(error.statusCode === 404) {
            alert("This room does not exist");
            console.log("the room has removed");
        }
        else if(error.statusCode === 405) {
            alert("You didn't join in this room. Please join in first.");
            console.log("The user isn't a chatting member");
            yield put(actions.changeUrl('/room/'));
        }
        else if(Object.keys(error).length === 0) {
            console.log("post text succeed 3.");
            yield put(actions.updateChatting(room_id))
            //yield put(actions.changeUrl(window.location.pathname));
        }
        else {
            alert("Unknown Error Occurred");
            console.log(error);
        }
    }
}

// postRoom: 새 채팅방을 생성하는 함수 // TODO 채팅방 관련 추가구현 시 수정바람.
function *postRoom(room_name) {
    const path = 'chatroom/';
    try{
        yield call(xhr.post, fixed_url+path, {
            headers: {
                "Authorization": "Basic "+localStorage['auth'],
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            contentType: 'json',
            body: JSON.stringify({"room_name": room_name})
        });
        console.log("post room succeed.");
    }catch(error){
        if(error.statusCode === 201){
            console.log("post room succeed 2.");
        }
        else if(error.statusCode === 0) {
            alert("Backend server not available");
            console.log("Check backend server");
            return;
        }
        else if(error.statusCode === 400) {
            alert("Please input correctly");
            console.log("Bad request");
            return;
        }
        else if(error.statusCode === 403) {
            alert("Please sign in first");
            console.log("permission denied");
            yield put(actions.changeUrl('/'));
            return;
        }
        else if(Object.keys(error).length === 0) {
            console.log("post room succeed 3.");
        }
        else {
            alert("Unknown Error Occurred");
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
            alert("Unauthorized user tried to access chatting page. Please sign in first!");
            console.log('permission denied');
            localStorage.removeItem('auth');
            localStorage.removeItem('parent');
            yield put(actions.changeUrl('/'));
        }
        else if(error.statusCode === 404) {
            alert("404 Not Found");
            console.log("안심하세요! 이 에러는 Unknown Error가 아닙니다.");
            return;
        }
        else if(error.statusCode === 0) {
            console.log("Backend is not available");
            //alert("Temporary Server Error");
            return;
        }
        else {
            console.log("Unknown error");
            alert("Unknown error occurred");
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
            alert("Unauthorized user tried to access chatting page. Please sign in first!");
            console.log('permission denied');
            localStorage.removeItem('auth');
            localStorage.removeItem('parent');
            yield put(actions.changeUrl('/'));
        }
        else if(error.statusCode === 404) {
            alert("404 Not Found");
            console.log("안심하세요! 이 에러는 Unknown Error가 아닙니다.");
            return;
        }
        else if(error.statusCode === 0) {
            console.log("Backend is not available");
            //alert("Temporary Server Error");
            return;
        }
        else {
            console.log("Unknown error");
            alert("Unknown error occurred");
            return;
        }
    }
    let getArticles = yield select((state) => state.articles);
    let getParentArticle = yield select((state) => state.parent_article);
    let getRooms = yield select((state) => state.rooms);
    yield put(actions.setState({
        authorization: window.atob(localStorage['auth']),
        articles: getArticles,
        parent_article: getParentArticle,
        rooms: getRooms,
        texts: textRes.body,
        chatting_users: userRes.body,
        room_id: room_id
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
