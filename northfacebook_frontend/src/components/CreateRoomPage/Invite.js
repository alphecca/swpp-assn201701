import React from 'react'
import PropTypes from 'prop-types'

class Invite extends React.Component {
    render() {
        const friendName = this.props.friend.friend;
        const friendNameId = "I_"+this.props.friend.friend+"_name_field";
        const checkId = "I_"+this.props.friend.friend+"_check_field";
        const componentId = "I_"+this.props.friend.friend+"_field";

        return (
                <div id={componentId} className='Friend'>
                <span id={friendNameId}>{friendName}</span>
                <input type='checkbox' id={checkId} className='checkfield'></input><br />
                </div>
               )
    }
}

Invite.propTypes = {
    friend: PropTypes.object,
}

export default Invite;
