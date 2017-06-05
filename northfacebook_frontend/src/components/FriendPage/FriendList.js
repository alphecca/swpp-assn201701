import React from 'react'
import Friend from './Friend.js'
import { connect } from 'react-redux'

class FriendList extends React.Component {
    render() {
        const list = this.props.friends;
        return (
                <div id="f_list_field" className="FriendList">
                {list.map(friend => <Friend key={friend.name} {...friend}/>)}
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        friends: Object.assign(state.friends).map(friend => JSON.parse(JSON.stringify(
                                 {
                                    friend: friend,
                                    name: friend.friend
                                })
                             )
                         )
    }
}

FriendList = connect(mapStateToProps)(FriendList)

export default FriendList
