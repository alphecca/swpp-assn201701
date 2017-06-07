import React from 'react'
import MyRequest from './MyRequest.js'
import { connect } from 'react-redux'

class MyRequestList extends React.Component {
    render() {
        const list = this.props.my_requests;
        console.log(list);
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
                                    friend: me,
                                    name: me.name
                                })
                             )
                         )
    }
}

MyRequestList = connect(mapStateToProps)(MyRequestList)

export default MyRequestList
