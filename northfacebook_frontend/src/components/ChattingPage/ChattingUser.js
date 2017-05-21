import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

class ChattingUser extends React.Component {
    render() {
        const username = this.props.user.chatuser;
        const usernameId = "u"+this.props.user.id+"_username_field";
        const componentId = "u"+this.props.user.id+"_field";
        return (
                <div id={componentId} className="ChattingUser">
                <span id={usernameId}>{username}</span>
                </div>
               )
    }
}

ChattingUser.propTypes = {
    user: PropTypes.object,
}

export default ChattingUser
