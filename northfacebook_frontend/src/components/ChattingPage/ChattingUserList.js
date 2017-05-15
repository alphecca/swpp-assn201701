import React from 'react'
import ChattingUser from './ChattingUser.js'
import { connect } from 'react-redux'

class ChattingUserList extends React.Component {
    render() {
        const list = this.props.users
        return (
                <div id="chatting_user_list_field" className="ChattingUserList">
                {list.map(user => <ChattingUser key={user.id} {...user}/>)}
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        users: Object.assign(state.chatting_users).map(user => JSON.parse(JSON.stringify(
                            {
                                user: user,
                                id: user.id
                            })
                           )
                       )
    }
}

ChattingUserList = connect(mapStateToProps)(ChattingUserList)

export default ChattingUserList
