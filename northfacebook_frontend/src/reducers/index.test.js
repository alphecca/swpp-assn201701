// jest테스트를 위한 파일

import * as actions from '../actions';
import homepageApp from './index.js';

const initState = {
    authorization: "",
    articles: [],
    parent_article: null,
    rooms: [],
    texts: [],
    chatting_users: [],
    room_id: 0,
    profile_user: null,
    load: 0
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
            rooms: [],
            texts: [],
            chatting_users: [],
            room_id: 0,
            profile_user: null,
            load: 0
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
        const rooms = [], texts=[], chatting_users = []
        const room_id=0
        const profile_user = null

        const state = {
            authorization: auth,
            articles: articles,
            parent_article: parent_article,
            rooms: rooms,
            room_id: room_id,
            texts: texts,
            chatting_users: chatting_users,
            profile_user: null,
            load: 0
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
})
