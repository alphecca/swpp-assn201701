// jest테스트를 위한 파일

import * as actions from '../actions';
import homepageApp from './index.js';

const initState = {
    authorization: "",
    articles: [],
    parent_article: null,
    nowchat_rooms: [],
    nonchat_rooms: [],
    texts: [],
    chatting_users: [],
    profile_user: null,
    room_id: 0,
    friends: [],
    friend_requests: [],
    my_requests: [],
    load: 0,
    loading: false,
    sasangs: [],
}


describe('homepage reducer', () => {
    it('should return the initial state', () => {
        expect(homepageApp(undefined, {})).toEqual(initState)
    })
    it('should fill authorization', () => {
        const auth = 'test:testpasswd'
        expect(homepageApp(undefined, actions.authenticate(window.btoa(auth)))).toEqual({
            authorization: auth,
            articles: [],
            parent_article: null,
            nowchat_rooms: [],
            nonchat_rooms: [],
            texts: [],
            chatting_users: [],
            profile_user: null,
            room_id: 0,
            friends: [],
            friend_requests: [],
            my_requests: [],
            load: 0,
            loading: false,
            sasangs: [],
        })
    })
    it('should return the signout state', () => {
        expect(homepageApp(undefined, actions.signOut())).toEqual(initState)
    })
    it('should return the changed state', () => {
        const auth = 'test:testpasswd'
        const articles = [{
            "id": 1,
            "owner": "newspring",
            "like_num": 0,
            "depth": 0,
            "text": "asdfasdf",
            "children_num": 0,
            "created_time": "2017-05-29T05:35:59.021455Z",
            "updated_time": "2017-05-29T05:35:59.021566Z",
            "image0": null,
            "images": []
        }]
        const parent_article = null
        const nowchat_rooms = [], nonchat_rooms = [], texts=[], chatting_users = []
        const room_id=0
        const profile_user = null

        const state = {
            authorization: auth,
            articles: articles,
            parent_article: parent_article,
            nowchat_rooms: nowchat_rooms,
            nonchat_rooms: nonchat_rooms,
            room_id: room_id,
            texts: texts,
            chatting_users: chatting_users,
            profile_user: null,
            friends: [],
            friend_requests: [],
            my_requests: [],
            load: 0,
            loading: false,
            sasangs: [],
        }

        expect(homepageApp(undefined, actions.setState(state))).toEqual(state)
    })
    it('should return the updated article detail', () => {
        const parent_article = {
            "id": 1,
            "owner": "newspring",
            "like_num": 0,
            "depth": 0,
            "text": "asdfasdf",
            "children_num": 0,
            "created_time": "2017-05-29T05:35:59.021455Z",
            "updated_time": "2017-05-29T05:35:59.021566Z",
            "image0": null,
            "images": []
        }
        expect(homepageApp(undefined, actions.articleDetail(parent_article))).toEqual(Object.assign({}, initState, {
            parent_article: parent_article
        }))
    })
    it('should return the more load value', () => {
        expect(homepageApp(undefined, actions.moreArticle())).toEqual(Object.assign({}, initState, {
            load: initState.load+5
        }))
    })
    it('should return the more load value2', () => {
        expect(homepageApp(undefined, actions.moreChat())).toEqual(Object.assign({}, initState, {
            load: initState.load+10
        }))
    })
    it('should return the less load value', () => {
        expect(homepageApp(undefined, actions.lessChat())).toEqual(Object.assign({}, initState, {
            load: initState.load
        }))
    })

})
