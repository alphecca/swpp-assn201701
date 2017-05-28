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
    profile_user: null
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
            profile_user: null
        })
    })
    it('should return the signout state', () => {
        expect(homepageApp(undefined, actions.signOut())).toEqual(initState)
    })
/*    it('should return the changed state', () => {
        const auth = 'test:testpasswd'
        const articles = []
        const parent_article = null
        const rooms = [], texts=[], chatting_users = []
        const room_id=4
        const profile_user = null
    })*/
})
