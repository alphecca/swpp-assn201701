import React from 'react'
import CreateRoom from './CreateRoom.js'
import SignOut from '../TimeLinePage/SignOut.js'

class CreateRoomPage extends React.Component {
    render() {
        // TODO <br />은 나중에 지워주시고 styles.css를 수정해 주세요.
        return (
                <div className="CreateRoomPage">
                    <SignOut />
                    <CreateRoom />
                </div>
            )
        }
}

export default CreateRoomPage;
