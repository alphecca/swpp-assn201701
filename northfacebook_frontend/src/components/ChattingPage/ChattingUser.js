import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

class ChattingUser extends React.Component {
    render() {
        const username = this.props.user.username;
        const componentId = "u"+this.props.user.id+"_field";
        return (
                <div id={componentId} className="ChattingUser">
                <span>{username}</span>
                </div>
               )
    }
}

ChattingUser.propTypes = {
    user: PropTypes.object,
}

export default ChattingUser
