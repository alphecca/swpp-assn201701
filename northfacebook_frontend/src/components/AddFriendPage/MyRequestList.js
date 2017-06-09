import React from 'react'
import MyRequest from './MyRequest.js'
import { connect } from 'react-redux'

class MyRequestList extends React.Component {
    render() {
        const list = this.props.my_requests;
        console.log(list);
        if (list.length === 0) {
            return (
                    <div id="mr_list_field" className="MyRequestList">
                    <span id="mr_list_message">아, 자네는 아무에게도 요청을 보내지 않았다우.</span>
                    </div>
                   )
        }
        return (
                <div id="mr_list_field" className="MyRequestList">
                {list.map(friend => <MyRequest key={friend.name} {...friend}/>)}
                </div>
               )
    }
}

let mapStateToProps = (state) => {
    return {
        my_requests: Object.assign(state.my_requests).map(friend => JSON.parse(JSON.stringify(
                                 {
                                    friend: friend,
                                    name: friend.name
                                })
                             )
                         )
    }
}

MyRequestList = connect(mapStateToProps)(MyRequestList)

export default MyRequestList
