import React from 'react'
import FriendRequest from './FriendRequest.js'
import { connect } from 'react-redux'

class FriendRequestList extends React.Component {
    render() {
        const list = this.props.friends;
        return (
                <div id="fr_list_field" className="FriendRequestList">
                {list.map(friend => <FriendRequest key={friend.friend} {...friend}/>)}
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        friends: Object.assign(state.friends).map(friend => JSON.parse(JSON.stringify(
                                 {
                                    friend: friend
                                })
                             )
                         )
    }
}

FriendRequestList = connect(mapStateToProps)(FriendRequestList)

export default FriendRequestList
