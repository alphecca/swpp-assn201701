import React from 'react'
import FriendRequest from './FriendRequest.js'
import { connect } from 'react-redux'

class FriendRequestList extends React.Component {
    render() {
        const list = this.props.friend_requests;
        console.log(list);
        if (list.length === 0) {
            return (
                    <div id="fr_list_field" className="FriendRequestList">
                    <span id="fr_list_message">아, 자네에게 온 요청이 없다우.</span>
                    </div>
                   )
        }
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
