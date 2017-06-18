import React from 'react'
import CreateRoom from './CreateRoom.js'
import SignOut from '../TimeLinePage/SignOut.js'
import { connect } from 'react-redux'

class CreateRoomPage extends React.Component {
    render() {
        if (!this.props.loading) {
            return (
                    <div>
                        <SignOut />
                    </div>
                    )
        }
        return (
                <div className="CreateRoomPage">
                    <SignOut />
                    <CreateRoom />
                </div>
            )
        }
}

let mapStateToProps = (state) => {
    return {
        loading: state.loading,
    }
}

CreateRoomPage = connect(mapStateToProps)(CreateRoomPage);

export default CreateRoomPage;
