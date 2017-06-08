import React from 'react'
import Friend from './Friend.js'
import { connect } from 'react-redux'

class FriendList extends React.Component {
    render() {
        const list = this.props.friends;
        if (list.length === 0) {
            return (
                    <div id="mr_list_field" className="MyRequestList">
                    자네에게는 아직 동무가 없다우. 다른 인민들에게 동무가 되자고 요청을 보내보라우.
                    </div>
                   )
        }
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
