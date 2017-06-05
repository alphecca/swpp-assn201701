import React from 'react'
import FriendRequest from './FriendRequest.js'
import { connect } from 'react-redux'

class FriendRequestList extends React.Component {
    render() {
        const list = this.props.friend_requests;
        console.log(list);
        return (
                <div id="fr_list_field" className="FriendRequestList">
                {list.map(friend => <FriendRequest key={friend.name} {...friend}/>)}
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        friend_requests: Object.assign(state.friend_requests).map(friend => JSON.parse(JSON.stringify(
                                 {
                                    friend: friend,
                                    name: friend.name
                                })
                             )
                         )
    }
}

FriendRequestList = connect(mapStateToProps)(FriendRequestList)

export default FriendRequestList
