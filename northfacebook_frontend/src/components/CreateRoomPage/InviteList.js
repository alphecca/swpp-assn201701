import React from 'react'
import Invite from './Invite.js'
import { connect } from 'react-redux'

class InviteList extends React.Component {
    render() {
        const list = this.props.friends;
        return (
                <div id="I_list_field" className="FriendList">
                {list.map(friend => <Invite key={friend.name} {...friend}/>)}
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

InviteList = connect(mapStateToProps)(InviteList)

export default InviteList
