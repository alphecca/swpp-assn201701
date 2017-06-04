import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { changeUrl } from '../../actions'

class Friend extends React.Component {
    render() {
        const friendName = this.props.friend.friend;
        const friendNameId = "f_"+this.props.friend.friend+"_name_field";
        const componentId = "f_"+this.props.friend.friend+"_field";

        return (
                <div id={componentId} className="Friend">
                    <a id={friendNameId} onClick={() => this.props.onFriendClick(this.props.friend.friend)}><u>{friendName}</u></a>
                </div>
               )
    }
}

Friend.propTypes = {
    friend: PropTypes.object,
}

let mapDispatchToProps = (dispatch) => {
    return {
        onFriendClick: (friend) => dispatch(changeUrl('/profile/'+friend+'/'))
    }
}

Friend = connect(undefined, mapDispatchToProps)(Friend);

export default Friend
